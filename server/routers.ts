import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { systemRouter } from "./_core/systemRouter";

import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "./_core/trpc";

import {
  archiveProduct,
  createStoreForUser,
  getAdminPlans,
  getAdminUsers,
  getPublicStoreBySlug,
  getStoreDashboardSummary,
  getStoresForUser,
  insertProduct,
  listProducts,
  listPublicProducts,
  updateStoreTheme,
  userHasStoreAccess,
} from "./db";

import {
  createStoreDownloadUrl,
  createStoreUploadUrl,
} from "./r2";

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

export const appRouter = router({
  system: systemRouter,

  /* ============================================================
     AUTH
     ============================================================ */

  auth: router({
    /**
     * O Better Auth já trata:
     * - criação de conta
     * - login
     * - logout
     * - sessão
     *
     * Aqui mantemos apenas o endpoint público
     * para o restante do HOMSTEG obter o utilizador
     * de negócio associado à sessão Better Auth.
     */
    me: publicProcedure.query(
      ({ ctx }) => ctx.user,
    ),
  }),

  /* ============================================================
     STORES
     ============================================================ */

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

  /* ============================================================
     DASHBOARD
     ============================================================ */

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

  /* ============================================================
     STORAGE / CLOUDFLARE R2
     ============================================================ */

  /**
   * O frontend nunca recebe as credenciais do R2.
   *
   * Fluxo:
   *
   * 1. frontend pede uma URL de upload
   * 2. servidor verifica acesso à loja
   * 3. servidor cria URL assinada
   * 4. frontend envia a imagem directamente para R2
   * 5. servidor devolve a chave e URL assinada de leitura
   *
   * Os ficheiros ficam separados por loja:
   *
   * stores/<storeId>/products/<ficheiro>
   */
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
          /**
           * Nunca confiar apenas no storeId enviado
           * pelo browser.
           *
           * O servidor verifica se o utilizador
           * realmente pode utilizar esta loja.
           */
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin",
            ),
          );

          /**
           * Criar URL temporária para PUT.
           */
          const upload =
            await createStoreUploadUrl({
              storeId: input.storeId,
              folder: "products",
              fileName: input.fileName,
              contentType:
                input.contentType,
            });

          /**
           * Criar URL temporária para leitura.
           */
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

  /* ============================================================
     PRODUCTS
     ============================================================ */

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

          /**
           * Preço anterior / preço riscado.
           *
           * Exemplo:
           * priceMzn = 950
           * compareAtPriceMzn = 1200
           */
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
              z.string().trim().min(1).max(1024),
            )
            .max(12)
            .default([]),

          options: z
            .array(
              z.object({
                name: z.string().trim().min(1).max(80),
                values: z
                  .array(
                    z.string().trim().min(1).max(120),
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

          const productImagePrefix =
            `stores/${input.storeId}/products/`;

          if (
            input.imageKeys.some(
              (key) => !key.startsWith(productImagePrefix),
            )
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Imagem não pertence à loja selecionada.",
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
            stock: input.stock,
            category:
              input.category,
            imageUrl:
              input.imageUrl,
            imageKeys: input.imageKeys,
            options: input.options,
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

  /* ============================================================
     ADMIN
     ============================================================ */

  admin: router({
    users: router({
      list: adminProcedure.query(
        () => getAdminUsers(),
      ),
    }),

    plans: router({
      list: adminProcedure.query(
        () => getAdminPlans(),
      ),
    }),
  }),
});

export type AppRouter =
  typeof appRouter;
