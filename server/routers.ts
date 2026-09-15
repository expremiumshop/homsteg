import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { COOKIE_NAME } from "@shared/const";

import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "./_core/trpc";
import {
  archiveProduct,
  createCredentialsUser,
  createStoreForUser,
  getAdminPlans,
  getAdminUsers,
  getPublicStoreBySlug,
  getStoresForUser,
  getUserByEmail,
  insertProduct,
  listProducts,
  listPublicProducts,
  updateStoreTheme,
  userHasStoreAccess,
  verifyUserPassword,
} from "./db";

const storeIdInput = z.string().trim().min(3).max(64);
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
  z.string().trim().max(max).optional().or(z.literal(""));
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

function requireStoreAccess(hasAccess: boolean) {
  if (!hasAccess) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Não tem acesso a esta loja.",
    });
  }
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    // The context maps the authenticated Clerk account to its Neon user row.
    me: publicProcedure.query(({ ctx }) => ctx.user),

    // Retained for existing credentials accounts. Clerk authentication for
    // protected procedures is handled in createContext.
    register: publicProcedure
      .input(
        z.object({
          email: z.string().trim().toLowerCase().email("Digite um e-mail válido."),
          password: z
            .string()
            .min(8, "A palavra-passe deve ter pelo menos 8 caracteres.")
            .max(128, "A palavra-passe é demasiado longa."),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (await getUserByEmail(input.email)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Este e-mail já está registado.",
          });
        }

        const user = await createCredentialsUser(input.email, input.password);
        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Não foi possível criar a conta.",
          });
        }

        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name ?? user.email ?? "",
          expiresInMs: 1000 * 60 * 60 * 24 * 365,
        });
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...getSessionCookieOptions(ctx.req),
          maxAge: 1000 * 60 * 60 * 24 * 365,
        });

        return { success: true, user };
      }),

    login: publicProcedure
      .input(
        z.object({
          email: z.string().trim().toLowerCase().email("Digite um e-mail válido."),
          password: z.string().min(1),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const user = await verifyUserPassword(input.email, input.password);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "E-mail ou palavra-passe incorretos.",
          });
        }

        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name ?? user.email ?? "",
          expiresInMs: 1000 * 60 * 60 * 24 * 365,
        });
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...getSessionCookieOptions(ctx.req),
          maxAge: 1000 * 60 * 60 * 24 * 365,
        });

        return { success: true, user };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, {
        ...getSessionCookieOptions(ctx.req),
        maxAge: -1,
      });
      return { success: true } as const;
    }),
  }),

  stores: router({
    mine: protectedProcedure.query(({ ctx }) =>
      getStoresForUser(ctx.user.id, ctx.user.role === "admin"),
    ),

    bySlug: publicProcedure
      .input(z.object({ slug: storeSlugInput }))
      .query(async ({ input }) => {
        const store = await getPublicStoreBySlug(input.slug);
        if (!store) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Loja não encontrada." });
        }
        return { store, products: await listPublicProducts(store.id) };
      }),

    theme: router({
      set: protectedProcedure
        .input(z.object({ storeId: storeIdInput, themeKey: themeInput }))
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(ctx.user.id, input.storeId, ctx.user.role === "admin"),
          );
          const store = await updateStoreTheme(input.storeId, input.themeKey);
          if (!store) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Loja não encontrada." });
          }
          return { success: true, store };
        }),
    }),

    application: router({
      create: protectedProcedure
        .input(
          z.object({
            businessTypes: z.array(z.string().trim().min(1).max(100)).min(1),
            fullName: z.string().trim().min(3).max(160),
            username: z
              .string()
              .trim()
              .min(3)
              .max(80)
              .regex(/^[a-zA-Z0-9._-]+$/, "O nome de utilizador contém caracteres inválidos."),
            storeName: z.string().trim().min(2).max(120),
            storeSlug: storeSlugInput,
            phone: z.string().trim().min(7).max(40),
            alternativePhone: optionalText(40),
            whatsapp: optionalText(40),
            country: z.string().trim().min(2).max(80),
            province: optionalText(100),
            district: optionalText(100),
            neighborhood: optionalText(120),
            notes: optionalText(5_000),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          try {
            const store = await createStoreForUser({
            userId: ctx.user.id,
              name: input.storeName,
              slug: input.storeSlug,
            });

            return { success: true, store };
          } catch (error) {
            if (
              error instanceof Error &&
              error.message === "STORE_SLUG_ALREADY_EXISTS"
            ) {
              throw new TRPCError({
                code: "CONFLICT",
                message: "Já existe uma loja com este endereço.",
              });
            }

            throw error;
          }
        }),
    }),
  }),

  products: router({
    list: protectedProcedure
      .input(z.object({ storeId: storeIdInput }))
      .query(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(ctx.user.id, input.storeId, ctx.user.role === "admin"),
        );
        return listProducts(input.storeId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,
          name: z.string().trim().min(2).max(180),
          slug: z.string().trim().min(2).max(180),
          description: z.string().max(5_000).optional(),
          priceMzn: z.number().int().nonnegative(),
          stock: z.number().int().nonnegative().default(0),
          category: z.string().trim().min(2).max(80).default("General"),
          imageUrl: z.string().url().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(ctx.user.id, input.storeId, ctx.user.role === "admin"),
        );
        return insertProduct({ ...input, status: "draft" });
      }),

    archive: protectedProcedure
      .input(z.object({ storeId: storeIdInput, productId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(ctx.user.id, input.storeId, ctx.user.role === "admin"),
        );
        await archiveProduct(input.storeId, input.productId);
        return { success: true } as const;
      }),
  }),

  admin: router({
    users: router({
      // Clerk verifies the request in createContext; adminProcedure authorizes
      // the matching Neon user through users.role before this query executes.
      list: adminProcedure.query(() => getAdminUsers()),
    }),

    plans: router({
      list: adminProcedure.query(() => getAdminPlans()),
    }),
  }),
});

export type AppRouter = typeof appRouter;
