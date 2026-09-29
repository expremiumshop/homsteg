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
  getStoreBrandingUrls,
  getStoreWithPlanUsage,
  getStoresForUser,
  insertProduct,
  insertStoreCategory,
  listProducts,
  listStoreCategories,
  renameStoreCategory,
  updateProduct,
  listPublicProducts,
  markStoreSubscriptionPaid,
  reviewPlanRequest,
  updateStoreBranding,
  updateStoreBannerSettings,
  updateStoreProductCardModel,
  updateStoreStatus,
  updateStoreTheme,
  updateStoreWhatsApp,
  userHasStoreAccess,
} from "./db.js";

import type { InsertProduct } from "../drizzle/schema.js";

import { getBetterAuthUserById } from "./auth.js";

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

      return digits.length >= 7 && digits.length <= 15;
    },
    "Introduza um número de WhatsApp válido.",
  );

const brandingKeyInput = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .regex(
    /^stores\/[a-zA-Z0-9_-]+\/branding\/[a-zA-Z0-9._-]+$/,
    "Chave de ficheiro inválida.",
  );

/*
 * Chaves R2 de branding: stores/{storeId}/branding/ficheiro.ext
 * Validadas no formato e revalidadas contra a loja na mutation.
 */
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
]);function planLimit(planKey: string) {
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
   TEMAS

   Regras de acesso:
   - Qualquer loja pode VER/pré-visualizar todos os temas.
   - A restrição aplica-se APENAS à seleção/ativação.
   - Free: apenas o tema "nova".
   - Qualquer plano pago (starter ou superior): todos os temas.
   ============================================================ */

const FREE_PLAN_THEMES = new Set(["nova"]);

function canStoreActivateTheme(
  planKey: string,
  themeKey: string,
) {
  if (planKey !== "free") {
    return true;
  }

  return FREE_PLAN_THEMES.has(themeKey);
}

/* ============================================================
   HELPERS
   ============================================================ */

function requireStoreAccess(hasAccess: boolean) {
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
    me: publicProcedure.query(({ ctx }) => ctx.user),
  }),

  /* ==========================================================
     STORES
     ========================================================== */

  stores: router({
    mine: protectedProcedure.query(({ ctx }) =>
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
        const store = await getPublicStoreBySlug(
          input.slug,
        );

        if (!store) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Loja não encontrada.",
          });
        }

        return {
          store: {
            ...store,
            logoKey: store.logoKey ?? null,
            bannerKey:
              store.bannerKey ?? null,
          },
          branding:
            await getStoreBrandingUrls(
              store,
            ),
          products: await listPublicProducts(
            store.id,
          ),
        };
      }),

    /* ========================================================
       BRANDING (logo + banner da loja)
       ======================================================== */

    branding: router({
      /*
       * Configuração atual (chaves R2) — apenas
       * membros da loja.
       */
      get: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          }),
        )
        .query(async ({ ctx, input }) => {
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

          return {
            logoKey:
              result.store.logoKey ?? null,
            bannerKey:
              result.store.bannerKey ?? null,
            bannerKeys:
              result.store.bannerKeys ?? [],
            productCardModel:
              result.store.productCardModel ?? null,
            bannerModel:
              result.store.bannerModel ?? null,
            bannerTexts:
              result.store.bannerTexts ?? [],
            bannerFeatures:
              result.store.bannerFeatures ?? {},
            ...(await getStoreBrandingUrls(
              result.store,
            )),
          };
        }),

      /*
       * Gera URL de upload presigned R2 para o
       * logo ou banner, isolado por loja
       * (stores/{storeId}/branding/...).
       */
      createUploadUrl: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            asset: z.enum(["logo", "banner"]),

            fileName: z
              .string()
              .trim()
              .min(1)
              .max(255),

            contentType: z.enum([
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/svg+xml",
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
                folder: "branding",
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
              uploadUrl: upload.uploadUrl,
              imageUrl,
            };
          },
        ),      /*
       * Guarda/substitui logo, banner e/ou lista de
       * banners. null remove o asset atual.
       */
      set: protectedProcedure
        .input(
          z
            .object({
              storeId: storeIdInput,

              logoKey: brandingKeyInput
                .nullable()
                .optional(),

              bannerKey: brandingKeyInput
                .nullable()
                .optional(),

              bannerKeys: z
                .array(brandingKeyInput)
                .max(10, "Máximo de 10 banners.")
                .nullable()
                .optional(),
            })
            .refine(
              (data) =>
                data.logoKey !== undefined ||
                data.bannerKey !== undefined ||
                data.bannerKeys !== undefined,
              {
                message:
                  "Indique o logo, o banner ou ambos.",
              },
            ),
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

            /*
             * Defesa extra: cada chave tem de
             * pertencer à própria loja
             * (isolamento total entre lojas).
             */
            if (
              input.logoKey &&
              !input.logoKey.startsWith(
                `stores/${input.storeId}/branding/`,
              )
            ) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message:
                  "Ficheiro não pertence à loja selecionada.",
              });
            }

            if (
              input.bannerKey &&
              !input.bannerKey.startsWith(
                `stores/${input.storeId}/branding/`,
              )
            ) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message:
                  "Ficheiro não pertence à loja selecionada.",
              });
            }

            /*
             * Defesa extra para a lista: cada chave tem de
             * pertencer à própria loja.
             */
            if (
              input.bannerKeys?.some(
                (key) =>
                  !key.startsWith(
                    `stores/${input.storeId}/branding/`,
                  ),
              )
            ) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message:
                  "Ficheiro não pertence à loja selecionada.",
              });
            }

            const store =
              await updateStoreBranding({
                storeId: input.storeId,
                logoKey: input.logoKey,
                bannerKey: input.bannerKey,
                bannerKeys: input.bannerKeys,
              });

            if (!store) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Loja não encontrada.",
              });
            }

            return {
              success: true,
              logoKey: store.logoKey ?? null,
              bannerKey:
                store.bannerKey ?? null,
              bannerKeys:
                store.bannerKeys ?? [],
            };
          },
        ),

      /* ========================================================
         BANNERS: modelo do carrossel + textos por slide
         (tema Nova). Um único modelo por loja em cada
         momento; os textos são guardados por índice de
         slide e os modelos sem texto simplesmente os
         ignoram.
         ======================================================== */

      setBannerModel: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            model: z
              .enum(["1", "2", "3", "4", "5"])
              .nullable(),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          const store =
            await updateStoreBannerSettings({
              storeId: input.storeId,
              bannerModel: input.model,
            });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            bannerModel: store.bannerModel ?? null,
          };
        }),

      setBannerFeatures: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            /*
             * Mapa chave R2 do banner → elementos.
             * Cada chave é validada contra a loja.
             */
            bannerFeatures: z
              .record(
                z.string(),
                z
                  .object({
                  /* Estado de publicação (false = rascunho). */
                  published: z.boolean().optional(),
                  button: z
                    .object({
                      enabled: z.boolean(),
                      label: z.string().max(40).optional(),
                      target: z
                        .enum(["product", "link"])
                        .optional(),
                      destination: z
                        .string()
                        .max(600)
                        .optional(),
                      position: z
                        .enum([
                          "bottom-left",
                          "bottom-right",
                          "top-left",
                          "top-right",
                          "center",
                        ])
                        .optional(),
                    })
                    .optional(),
                  text: z
                    .object({
                      enabled: z.boolean(),
                      text: z.string().max(200).optional(),
                      position: z
                        .enum([
                          "top-left",
                          "top-center",
                          "bottom-left",
                          "bottom-center",
                          "bottom-right",
                        ])
                        .optional(),
                    })
                    .optional(),
                  animation: z
                    .object({
                      enabled: z.boolean(),
                      type: z
                        .enum([
                          "none",
                          "fade",
                          "zoom",
                          "slide-up",
                          "slide-left",
                        ])
                        .optional(),
                    })
                    .optional(),
                  countdown: z
                    .object({
                      enabled: z.boolean(),
                      endsAt: z.string().max(40).optional(),
                    })
                    .optional(),
                })
                  .strip(),
              )
              .refine(
                (features) =>
                  Object.keys(features).length <= 20,
                {
                  message:
                    "Máximo de 20 banners com elementos.",
                },
              )
              .nullable(),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          /*
           * Isolamento por loja: cada chave tem de
           * apontar para um ficheiro da própria loja.
           */
          const featureKeys = Object.keys(
            input.bannerFeatures ?? {},
          );

          if (
            featureKeys.some(
              (key) =>
                !key.startsWith(
                  `stores/${input.storeId}/branding/`,
                ),
            )
          ) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message:
                "Ficheiro não pertence à loja selecionada.",
            });
          }

          const store =
            await updateStoreBannerSettings({
              storeId: input.storeId,
              bannerFeatures:
                input.bannerFeatures ?? {},
            });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            bannerFeatures:
              store.bannerFeatures ?? {},
          };
        }),

      setBannerTexts: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            bannerTexts: z
              .array(
                z.object({
                  title: z.string().max(120).optional(),
                  subtitle: z.string().max(200).optional(),
                }),
              )
              .max(10)
              .nullable(),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          const store =
            await updateStoreBannerSettings({
              storeId: input.storeId,
              bannerTexts: input.bannerTexts,
            });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            bannerTexts: store.bannerTexts ?? [],
          };
        }),

      /* ========================================================
         MODELO DOS CARTÕES DE PRODUTO (tema Nova)
         "1".."5" — ver BrandingPage / ProductCard.
         ======================================================== */

      setProductCardModel: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            model: z
              .enum(["1", "2", "3", "4", "5"])
              .nullable(),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          const store =
            await updateStoreProductCardModel(
              input.storeId,
              input.model,
            );

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            productCardModel:
              store.productCardModel ?? null,
          };
        }),
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
        .query(async ({ ctx, input }) => {
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
        }),

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
        .mutation(async ({ ctx, input }) => {
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
        }),
    }),

    /* ========================================================
       THEMES
       ======================================================== */

    theme: router({
      set: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            themeKey: themeInput,
          }),
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          /*
           * A restrição de plano aplica-se apenas à
           * ativação do tema: lojas no plano Free só
           * podem ativar o tema Nova. Ver/preview
           * continua livre para todos os temas.
           */
          const currentStore =
            await getStoreWithPlanUsage(
              input.storeId,
            );

          if (!currentStore) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          if (
            !canStoreActivateTheme(
              currentStore.store.planKey,
              input.themeKey,
            )
          ) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message:
                "O tema selecionado requer um plano pago. Faça upgrade do plano para desbloquear.",
            });
          }

          const store = await updateStoreTheme(
            input.storeId,
            input.themeKey,
          );

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            store,
          };
        }),
    }),

    /* ========================================================
       CHECKOUT
       ======================================================== */

    checkout: router({
      updateWhatsApp: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            whatsapp: whatsappInput,
          }),
        )
        .mutation(async ({ ctx, input }) => {
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
              message: "Loja não encontrada.",
            });
          }

          return store;
        }),
    }),

    /* ========================================================
       STORE APPLICATION
       ======================================================== */

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

            /*
             * IMPORTANTE:
             * username foi removido.
             *
             * O nome pessoal do utilizador NÃO é usado
             * como endereço da loja.
             */

            storeName: z
              .string()
              .trim()
              .min(2)
              .max(120),

            /*
             * O endereço público da loja vem do nome da loja.
             *
             * Exemplos:
             * "Moda Fashion" -> "moda-fashion"
             * "Moda" -> "moda"
             */
            storeSlug: storeSlugInput,

            phone: z
              .string()
              .trim()
              .min(7)
              .max(40),

            /*
             * Telefone alternativo foi removido.
             */

            whatsapp: optionalText(40),

            country: z
              .string()
              .trim()
              .min(2)
              .max(80),

            province: optionalText(100),

            district: optionalText(100),

            neighborhood: optionalText(120),

            notes: optionalText(5000),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          /*
           * Fluxo HOMSTEG:
           * a loja só é criada depois de o utilizador
           * validar o OTP enviado por email.
           *
           * O gate é verificado diretamente na tabela do
           * Better Auth, fonte da verdade para emailVerified.
           */

          const authUser =
            await getBetterAuthUserById(
              ctx.user.openId,
            );

          if (!authUser?.emailVerified) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message:
                "Confirma o teu email com o código enviado antes de continuar.",
            });
          }

          try {
            /*
             * A loja é criada usando:
             *
             * storeName -> nome público da loja
             * storeSlug -> endereço público da loja
             *
             * O fullName pertence ao utilizador e não
             * participa na criação do domínio/slug.
             */

            const store =
              await createStoreForUser({
                userId: ctx.user.id,
                name: input.storeName,
                slug: input.storeSlug,
                whatsapp:
                  input.whatsapp || undefined,
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
        }),
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
      .query(async ({ ctx, input }) => {
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
            message: "Loja não encontrada.",
          });
        }

        return summary;
      }),
  }),

  /* ==========================================================
     STORAGE / CLOUDFLARE R2
     ========================================================== */

  storage: router({
    /*
     * URL assinada para exibir um asset de branding
     * (logo/banner) da própria loja. A chave tem de
     * pertencer à loja — isolamento entre lojas.
     */
    createImageUrl: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          key: brandingKeyInput,
        }),
      )
      .query(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin",
          ),
        );

        if (
          !input.key.startsWith(
            `stores/${input.storeId}/branding/`,
          )
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Ficheiro não pertence à loja selecionada.",
          });
        }

        const imageUrl =
          await createStoreDownloadUrl(
            input.key,
          );

        return { imageUrl };
      }),

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
      .mutation(async ({ ctx, input }) => {
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
            contentType: input.contentType,
          });

        const imageUrl =
          await createStoreDownloadUrl(
            upload.key,
          );

        return {
          key: upload.key,
          uploadUrl: upload.uploadUrl,
          imageUrl,
        };
      }),
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
      .query(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin",
          ),
        );

        return listProducts(input.storeId);
      }),

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

          /*
           * Categoria do produto: deve ser uma das
           * categorias reais da loja. Vazio/null =
           * Sem categoria.
           */
          category: z
            .string()
            .trim()
            .max(80)
            .optional(),

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
      .mutation(async ({ ctx, input }) => {
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
           sem aprovação manual do admin, o limite não aumenta.
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
          storePlan.productsUsed >= limit
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Limite de produtos do plano atual atingido. Peça um upgrade de plano ao administrador.",
          });
        }        const productImagePrefix =
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

        /*
         * A categoria tem de existir na loja.
         * Vazio ou ausente = Sem categoria (null).
         */
        let category: string | null = null;

        if (input.category && input.category.trim()) {
          const requestedCategory = input.category.trim();

          const storeCategoriesList =
            await listStoreCategories(
              input.storeId,
            );

          const match = storeCategoriesList.find(
            (category) =>
              category.name.localeCompare(
                requestedCategory,
                "pt",
                { sensitivity: "accent" },
              ) === 0,
          );

          if (!match) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Categoria inválida. Cria a categoria na loja antes de a usar.",
            });
          }

          category = match.name;
        }

        return insertProduct({
          storeId: input.storeId,
          name: input.name,
          slug: input.slug,
          description: input.description,
          priceMzn: input.priceMzn,
          compareAtPriceMzn:
            input.compareAtPriceMzn,
          stock: input.stock,
          category,
          imageUrl: input.imageUrl,
          imageKeys: input.imageKeys,
          options: input.options,
          status: "draft",
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          productId: z
            .number()
            .int()
            .positive(),

          name: z.string().trim().min(2).max(180).optional(),

          description: z.string().trim().max(5000).nullable().optional(),

          priceMzn: z.number().int().positive().optional(),

          compareAtPriceMzn: z.number().int().positive().nullable().optional(),

          stock: z.number().int().nonnegative().optional(),

          category: z.string().trim().max(80).nullable().optional(),

          imageUrl: z.string().url().nullable().optional(),

          imageKeys: z
            .array(z.string().trim().min(1).max(1024))
            .max(12)
            .optional(),

          options: z
            .array(
              z.object({
                name: z.string().trim().min(1).max(80),
                values: z.array(z.string().trim().min(1).max(120)).min(1).max(100),
              }),
            )
            .max(10)
            .optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin",
          ),
        );

        const updates: Partial<InsertProduct> = {};

        if (input.name !== undefined) updates.name = input.name;
        if (input.description !== undefined) updates.description = input.description;
        if (input.priceMzn !== undefined) updates.priceMzn = input.priceMzn;
        if (input.compareAtPriceMzn !== undefined) updates.compareAtPriceMzn = input.compareAtPriceMzn;
        if (input.stock !== undefined) updates.stock = input.stock;
        if (input.category !== undefined) updates.category = input.category;
        if (input.imageUrl !== undefined) updates.imageUrl = input.imageUrl;
        if (input.imageKeys !== undefined) updates.imageKeys = input.imageKeys;
        if (input.options !== undefined) updates.options = input.options;

        /*
         * A categoria, quando definida, tem de existir
         * nas categorias reais da loja.
         */
        if (updates.category) {
          const storeCategoriesList =
            await listStoreCategories(input.storeId);

          const match = storeCategoriesList.find(
            (category) =>
              category.name.localeCompare(
                updates.category as string,
                "pt",
                { sensitivity: "accent" },
              ) === 0,
          );

          if (!match) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Categoria inválida. Cria a categoria na loja antes de a usar.",
            });
          }

          updates.category = match.name;
        }

        const updated = await updateProduct(
          input.storeId,
          input.productId,
          updates,
        );

        if (!updated) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produto não encontrado.",
          });
        }

        return updated;
      }),

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
      .mutation(async ({ ctx, input }) => {
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
      }),
  }),

  /* ==========================================================
     STORE CATEGORIES

     Categorias reais criadas pelo utilizador.
     Única fonte do selector de categoria nos produtos.
     ========================================================== */

  categories: router({
    list: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,
        }),
      )
      .query(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin",
          ),
        );

        return listStoreCategories(
          input.storeId,
        );
      }),

    create: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          name: z
            .string()
            .trim()
            .min(1)
            .max(80),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin",
          ),
        );

        const existing =
          await listStoreCategories(
            input.storeId,
          );

        /*
         * Nome único por loja, case-insensitive.
         */
        const duplicate = existing.find(
          (category) =>
            category.name.localeCompare(
              input.name,
              "pt",
              { sensitivity: "accent" },
            ) === 0,
        );

        if (duplicate) {
          return duplicate;
        }

        return insertStoreCategory({
          storeId: input.storeId,
          name: input.name,
        });
      }),

    rename: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          categoryId: z
            .string()
            .trim()
            .min(1)
            .max(64),

          name: z
            .string()
            .trim()
            .min(1)
            .max(80),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin",
          ),
        );

        const existing =
          await listStoreCategories(
            input.storeId,
          );

        const duplicate = existing.find(
          (category) =>
            category.id !== input.categoryId &&
            category.name.localeCompare(
              input.name,
              "pt",
              { sensitivity: "accent" },
            ) === 0,
        );

        if (duplicate) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "Já existe uma categoria com esse nome.",
          });
        }

        try {
          return await renameStoreCategory({
            storeId: input.storeId,
            categoryId: input.categoryId,
            name: input.name,
          });
        } catch (error) {
          if (
            error instanceof Error &&
            error.message ===
              "STORE_CATEGORY_NOT_FOUND"
          ) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message:
                "Categoria não encontrada.",
            });
          }

          throw error;
        }
      }),
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
        .mutation(async ({ input }) => {
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
        }),
    }),

    /* ========================================================
       PLANS
       ======================================================== */

    plans: router({
      list: adminProcedure.query(
        () => getAdminPlans(),
      ),

      /**
       * Visão geral: cada loja, plano atual,
       * limite, produtos usados, WhatsApp do proprietário,
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
       * antes de ser aplicado à loja.
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

            assignedPlanKey:
              planKeyInput.optional(),

            adminNotes:
              optionalText(2000),
          }),
        )
        .mutation(async ({ input }) => {
          try {
            const result =
              await reviewPlanRequest({
                requestId: input.requestId,
                decision: input.decision,
                assignedPlanKey:
                  input.assignedPlanKey ??
                  null,
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
              request: result.request,
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
        }),

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
        .mutation(async ({ input }) => {
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
        }),

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
        .mutation(async ({ input }) => {
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
        }),
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
        .mutation(async ({ input }) => {
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
        }),

      suspend: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          }),
        )
        .mutation(async ({ input }) => {
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
        }),

      delete: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          }),
        )
        .mutation(async ({ input }) => {
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
        }),
    }),
  }),
});

/* ============================================================
   APP ROUTER TYPE
   ============================================================ */

export type AppRouter = typeof appRouter;