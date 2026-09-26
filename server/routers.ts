import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { systemRouter } from "./_core/systemRouter.js";

import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "./_core/trpc.js";

import {
  archiveProduct,
  assignPlanToStore,
  createPlanUpgradeRequest,
  createStoreForUser,
  deleteAdminUser,
  deleteStore,
  countActiveStoreProducts,
  getAdminPlanOverview,
  getAdminPlanRequests,
  getAdminPlans,
  getAdminUsers,
  getPublicStoreBySlug,
  getStoreDashboardSummary,
  getStoreWithPlanUsage,
  getStoresForUser,
  insertProduct,
  listProducts,
  listPublicProducts,
  markStoreSubscriptionPaid,
  reviewPlanRequest,
  updateStoreStatus,
  updateStoreTheme,
  updateStoreWhatsApp,
  userHasStoreAccess,
} from "./db.js";

import {
  createStoreDownloadUrl,
  createStoreUploadUrl,
} from "./r2.js";

/* ============================================================
   INPUTS
   ============================================================ */

const storeIdInput = z
  .string()
  .trim()
  .min(3)
  .max(64);

const storeSlugInput = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "O endereço da loja contém caracteres inválidos.",
  );

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""));

const whatsappInput = z
  .string()
  .trim()
  .min(7)
  .max(40)
  .refine(
    (value) => {
      if (!/^\+?[\d\s().-]+$/.test(value)) {
        return false;
      }

      const digits = value.replace(/\D/g, "");

      return (
        digits.length >= 7 &&
        digits.length <= 15
      );
    },
    "Introduza um número de WhatsApp válido.",
  );

const themeInput = z.enum([
  "nova",
  "luxe",
  "market",
  "urban",
  "essenza",
  "prime",
  "caliza",
  "chazuca",
]);

const planKeyInput = z.enum([
  "free",
  "starter",
  "business",
  "professional",
  "enterprise",
]);

function planLimit(planKey: string) {
  switch (planKey) {
    case "enterprise":
      return Number.POSITIVE_INFINITY;
    case "professional":
      return 5850;
    case "business":
      return 2450;
    case "starter":
      return 580;
    case "free":
    default:
      return 50;
  }
}

/* ============================================================
   HELPERS
   ============================================================ */

function requireStoreAccess(
  hasAccess: boolean,
) {
  if (!hasAccess) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Não tem acesso a esta loja.",
    });
  }
}

/* ============================================================
   APP ROUTER
   ============================================================ */

export const appRouter = router({
  system: systemRouter,

  /* ==========================================================
     AUTH
     ========================================================== */

  auth: router({
    me: publicProcedure.query(
      ({ ctx }) => ctx.user,
    ),
  }),

  /* ==========================================================
     STORES
     ========================================================== */

  stores: router({
    mine: protectedProcedure.query(
      ({ ctx }) =>
        getStoresForUser(
          ctx.user.id,
          ctx.user.role === "admin",
        ),
    ),

    bySlug: publicProcedure
      .input(
        z.object({
          slug: storeSlugInput,
        }),
      )
      .query(async ({ input }) => {
        const store =
          await getPublicStoreBySlug(
            input.slug,
          );

        if (!store) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Loja não encontrada.",
          });
        }

        return {
          store,
          products:
            await listPublicProducts(
              store.id,
            ),
        };
      }),

    /* ========================================================
       PLANOS DA LOJA (proprietário)
       ======================================================== */

    plan: router({
      /**
       * Plano ativo da loja + utilização.
       * Visível para qualquer membro da loja.
       */
      current: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          }),
        )
        .query(
          async ({ ctx, input }) => {
            requireStoreAccess(
              await userHasStoreAccess(
                ctx.user.id,
                input.storeId,
                ctx.user.role === "admin",
              ),
            );

            const result =
              await getStoreWithPlanUsage(
                input.storeId,
              );

            if (!result) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Loja não encontrada.",
              });
            }

            return result;
          },
        ),

      /**
       * O proprietário pede um upgrade de plano.
       * O limite só muda depois de aprovação
       * manual do administrador.
       */
      requestUpgrade: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            requestedPlanKey: planKeyInput,

            note: optionalText(1000),
          }),
        )
        .mutation(
          async ({ ctx, input }) => {
            requireStoreAccess(
              await userHasStoreAccess(
                ctx.user.id,
                input.storeId,
                ctx.user.role === "admin",
              ),
            );

            const latest =
              await getStoreWithPlanUsage(
                input.storeId,
              );

            if (!latest) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Loja não encontrada.",
              });
            }

            if (
              latest.latestRequest?.status ===
              "pending"
            ) {
              throw new TRPCError({
                code: "CONFLICT",
                message:
                  "Já existe um pedido de plano pendente.",
              });
            }

            if (
              latest.latestRequest?.status ===
                "approved" &&
              latest.latestRequest.assignedPlanKey ===
                input.requestedPlanKey
            ) {
              throw new TRPCError({
                code: "CONFLICT",
                message:
                  "A loja já tem este plano ativo.",
              });
            }
            if (
              planLimit(latest.store.planKey) >=
              planLimit(input.requestedPlanKey)
            ) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Escolha um plano superior ao atual.",
              });
            }

            const request =
              await createPlanUpgradeRequest({
                storeId: input.storeId,
                requestedPlanKey:
                  input.requestedPlanKey,
                note: input.note ?? null,
              });

            return {
              success: true,
              request,
            };
          },
        ),
    }),

    theme: router({
      set: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            themeKey: themeInput,
          }),
        )
        .mutation(
          async ({ ctx, input }) => {
            requireStoreAccess(
              await userHasStoreAccess(
                ctx.user.id,
                input.storeId,
                ctx.user.role === "admin",
              ),
            );

            const store =
              await updateStoreTheme(
                input.storeId,
                input.themeKey,
              );

            if (!store) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message:
                  "Loja não encontrada.",
              });
            }

            return {
              success: true,
              store,
            };
          },
        ),
    }),

    checkout: router({
      updateWhatsApp: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            whatsapp: whatsappInput,
          }),
        )
        .mutation(
          async ({ ctx, input }) => {
            requireStoreAccess(
              await userHasStoreAccess(
                ctx.user.id,
                input.storeId,
                ctx.user.role === "admin",
              ),
            );

            const store =
              await updateStoreWhatsApp(
                input.storeId,
                input.whatsapp,
              );

            if (!store) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message:
                  "Loja não encontrada.",
              });
            }

            return store;
          },
        ),
    }),

    application: router({
      create: protectedProcedure
        .input(
          z.object({
            businessTypes: z
              .array(
                z
                  .string()
                  .trim()
                  .min(1)
                  .max(100),
              )
              .min(1),

            fullName: z
              .string()
              .trim()
              .min(3)
              .max(160),

            username: z
              .string()
              .trim()
              .min(3)
              .max(80)
              .regex(
                /^[a-zA-Z0-9._-]+$/,
                "O nome de utilizador contém caracteres inválidos.",
              ),

            storeName: z
              .string()
              .trim()
              .min(2)
              .max(120),

            storeSlug: storeSlugInput,

            phone: z
              .string()
              .trim()
              .min(7)
              .max(40),

            alternativePhone:
              optionalText(40),

            whatsapp:
              optionalText(40),

            country: z
              .string()
              .trim()
              .min(2)
              .max(80),

            province:
              optionalText(100),

            district:
              optionalText(100),

            neighborhood:
              optionalText(120),

            notes:
              optionalText(5000),
          }),
        )
        .mutation(
          async ({ ctx, input }) => {
            try {
              const store =
                await createStoreForUser({
                  userId: ctx.user.id,
                  name: input.storeName,
                  slug: input.storeSlug,
                  whatsapp:
                    input.whatsapp ||
                    undefined,
                });

              return {
                success: true,
                store,
              };
            } catch (error) {
              if (
                error instanceof Error &&
                error.message ===
                  "STORE_SLUG_ALREADY_EXISTS"
              ) {
                throw new TRPCError({
                  code: "CONFLICT",
                  message:
                    "Já existe uma loja com este endereço.",
                });
              }

              throw error;
            }
          },
        ),
    }),
  }),

  /* ==========================================================
     DASHBOARD
     ========================================================== */

  dashboard: router({
    summary: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,
        }),
      )
      .query(
        async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          const summary =
            await getStoreDashboardSummary(
              input.storeId,
            );

          if (!summary) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message:
                "Loja não encontrada.",
            });
          }

          return summary;
        },
      ),
  }),

  /* ==========================================================
     STORAGE / CLOUDFLARE R2
     ========================================================== */

  storage: router({
    createUploadUrl: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          fileName: z
            .string()
            .trim()
            .min(1)
            .max(255),

          contentType: z.enum([
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ]),
        }),
      )
      .mutation(
        async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          const upload =
            await createStoreUploadUrl({
              storeId: input.storeId,
              folder: "products",
              fileName: input.fileName,
              contentType:
                input.contentType,
            });

          const imageUrl =
            await createStoreDownloadUrl(
              upload.key,
            );

          return {
            key: upload.key,
            uploadUrl:
              upload.uploadUrl,
            imageUrl,
          };
        },
      ),
  }),

  /* ==========================================================
     PRODUCTS
     ========================================================== */

  products: router({
    list: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,
        }),
      )
      .query(
        async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          return listProducts(
            input.storeId,
          );
        },
      ),

    create: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          name: z
            .string()
            .trim()
            .min(2)
            .max(180),

          slug: z
            .string()
            .trim()
            .min(2)
            .max(180),

          description: z
            .string()
            .max(5000)
            .optional(),

          priceMzn: z
            .number()
            .int()
            .nonnegative(),

          compareAtPriceMzn: z
            .number()
            .int()
            .nonnegative()
            .optional(),

          stock: z
            .number()
            .int()
            .nonnegative()
            .default(0),

          category: z
            .string()
            .trim()
            .min(2)
            .max(80)
            .default("General"),

          imageUrl: z
            .string()
            .url()
            .optional(),

          imageKeys: z
            .array(
              z
                .string()
                .trim()
                .min(1)
                .max(1024),
            )
            .max(12)
            .default([]),

          options: z
            .array(
              z.object({
                name: z
                  .string()
                  .trim()
                  .min(1)
                  .max(80),

                values: z
                  .array(
                    z
                      .string()
                      .trim()
                      .min(1)
                      .max(120),
                  )
                  .min(1)
                  .max(100),
              }),
            )
            .max(10)
            .default([]),
        }),
      )
      .mutation(
        async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          /* ======================================================
             LIMITE DO PLANO

             O limite do plano é aplicado no servidor:
             sem aprovação manual do admin, o limite não
             aumenta.
             ====================================================== */

          const storePlan =
            await getStoreWithPlanUsage(
              input.storeId,
            );

          if (!storePlan) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          const limit = planLimit(
            storePlan.store.planKey,
          );

          if (
            storePlan.productsUsed >=
            limit
          ) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message:
                "Limite de produtos do plano atual atingido. Peça um upgrade de plano ao administrador.",
            });
          }

          const productImagePrefix =
            `stores/${input.storeId}/products/`;

          if (
            input.imageKeys.some(
              (key) =>
                !key.startsWith(
                  productImagePrefix,
                ),
            )
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Imagem não pertence à loja selecionada.",
            });
          }

          return insertProduct({
            storeId: input.storeId,
            name: input.name,
            slug: input.slug,
            description:
              input.description,
            priceMzn:
              input.priceMzn,
            compareAtPriceMzn:
              input.compareAtPriceMzn,
            stock:
              input.stock,
            category:
              input.category,
            imageUrl:
              input.imageUrl,
            imageKeys:
              input.imageKeys,
            options:
              input.options,
            status: "draft",
          });
        },
      ),

    archive: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          productId: z
            .number()
            .int()
            .positive(),
        }),
      )
      .mutation(
        async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          await archiveProduct(
            input.storeId,
            input.productId,
          );

          return {
            success: true,
          } as const;
        },
      ),
  }),

  /* ==========================================================
     ADMIN
     ========================================================== */

  admin: router({
    /* ========================================================
       USERS
       ======================================================== */

    users: router({
      list: adminProcedure.query(
        () => getAdminUsers(),
      ),

      delete: adminProcedure
        .input(
          z.object({
            userId: z
              .number()
              .int()
              .positive(),
          }),
        )
        .mutation(
          async ({ input }) => {
            try {
              const deleted =
                await deleteAdminUser(
                  input.userId,
                );

              if (!deleted) {
                throw new TRPCError({
                  code: "NOT_FOUND",
                  message:
                    "Utilizador não encontrado.",
                });
              }

              return {
                success: true,
                user: deleted,
              };
            } catch (error) {
              if (
                error instanceof Error &&
                error.message ===
                  "USER_NOT_FOUND"
              ) {
                throw new TRPCError({
                  code: "NOT_FOUND",
                  message:
                    "Utilizador não encontrado.",
                });
              }

              throw error;
            }
          },
        ),
    }),

    /* ========================================================
       PLANS
       ======================================================== */

    plans: router({
      list: adminProcedure.query(
        () => getAdminPlans(),
      ),

      /**
       * Visão geral: cada loja, plano atual, limite,
       * produtos usados, WhatsApp do proprietário,
       * datas e último pedido.
       */
      overview: adminProcedure.query(
        () => getAdminPlanOverview(),
      ),

      /**
       * Pedidos de upgrade (todos os estados).
       */
      requests: adminProcedure.query(
        () => getAdminPlanRequests(),
      ),

      /**
       * Aprovar / rejeitar um pedido de upgrade.
       * Ao aprovar, o plano pode ser ajustado pelo admin
n       * (assignedPlanKey) antes de ser aplicado à loja.
       */
      review: adminProcedure
        .input(
          z.object({
            requestId: z
              .number()
              .int()
              .positive(),

            decision: z.enum([
              "approved",
              "rejected",
            ]),

            assignedPlanKey: planKeyInput
              .optional(),

            adminNotes: optionalText(2000),
          }),
        )
        .mutation(
          async ({ input }) => {
            try {
              const result =
                await reviewPlanRequest({
                  requestId: input.requestId,
                  decision: input.decision,
                  assignedPlanKey:
                    input.assignedPlanKey ?? null,
                  adminNotes:
                    input.adminNotes ?? null,
                });

              if (!result.request) {
                throw new TRPCError({
                  code: "NOT_FOUND",
                  message:
                    "Pedido não encontrado.",
                });
              }

              return {
                success: true,
                request:
                  result.request,
                store: result.store,
              };
            } catch (error) {
              if (
                error instanceof Error &&
                error.message ===
                  "PLAN_REQUEST_NOT_FOUND"
              ) {
                throw new TRPCError({
                  code: "NOT_FOUND",
                  message:
                    "Pedido não encontrado.",
                });
              }

              if (
                error instanceof Error &&
                error.message ===
                  "PLAN_REQUEST_ALREADY_REVIEWED"
              ) {
                throw new TRPCError({
                  code: "CONFLICT",
                  message:
                    "Este pedido já foi avaliado.",
                });
              }

              throw error;
            }
          },
        ),

      /**
       * Atribuição direta de plano pelo admin,
       * sem pedido do proprietário.
       */
      assign: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            planKey: planKeyInput,
          }),
        )
        .mutation(
          async ({ input }) => {
            try {
              const store =
                await assignPlanToStore({
                  storeId: input.storeId,
                  planKey: input.planKey,
                });

              return {
                success: true,
                store,
              };
            } catch (error) {
              if (
                error instanceof Error &&
                error.message ===
                  "STORE_NOT_FOUND"
              ) {
                throw new TRPCError({
                  code: "NOT_FOUND",
                  message:
                    "Loja não encontrada.",
                });
              }

              throw error;
            }
          },
        ),

      /**
       * Marca o pagamento mensal como recebido:
       * renova a subscrição por mais um mês e
       * mantém o plano ativo.
       */
      markPaid: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          }),
        )
        .mutation(
          async ({ input }) => {
            try {
              const store =
                await markStoreSubscriptionPaid(
                  input.storeId,
                );

              return {
                success: true,
                store,
              };
            } catch (error) {
              if (
                error instanceof Error &&
                error.message ===
                  "STORE_NOT_FOUND"
              ) {
                throw new TRPCError({
                  code: "NOT_FOUND",
                  message:
                    "Loja não encontrada.",
                });
              }

              if (
                error instanceof Error &&
                error.message ===
                  "SUBSCRIPTION_NOT_REQUIRED_FOR_FREE_PLAN"
              ) {
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message:
                    "O plano Free não requer pagamento mensal.",
                });
              }
              
              throw error;
            }
          },
        ),
    }),

    /* ========================================================
       STORES
       ======================================================== */

    stores: router({
      activate: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          }),
        )
        .mutation(
          async ({ input }) => {
            const store =
              await updateStoreStatus(
                input.storeId,
                "active",
              );

            if (!store) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message:
                  "Loja não encontrada.",
              });
            }

            return {
              success: true,
              store,
            };
          },
        ),

      suspend: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          }),
        )
        .mutation(
          async ({ input }) => {
            const store =
              await updateStoreStatus(
                input.storeId,
                "suspended",
              );

            if (!store) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message:
                  "Loja não encontrada.",
              });
            }

            return {
              success: true,
              store,
            };
          },
        ),

      delete: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          }),
        )
        .mutation(
          async ({ input }) => {
            const store =
              await deleteStore(
                input.storeId,
              );

            if (!store) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message:
                  "Loja não encontrada.",
              });
            }

            return {
              success: true,
              store,
            };
          },
        ),
    }),
  }),
});

/* ============================================================
   APP ROUTER TYPE
   ============================================================ */

export type AppRouter =
  typeof appRouter;