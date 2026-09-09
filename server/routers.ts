import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { archiveProduct, getStoresForUser, insertProduct, listProducts, userHasStoreAccess } from "./db";

const storeInput = z.string().trim().min(3).max(64);

function requireStoreAccess(hasAccess: boolean) {
  if (!hasAccess) throw new TRPCError({ code: "FORBIDDEN", message: "Não tem acesso a esta loja." });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  stores: router({
    mine: protectedProcedure.query(({ ctx }) => getStoresForUser(ctx.user.id, ctx.user.role === "admin")),
  }),
  products: router({
    list: protectedProcedure.input(z.object({ storeId: storeInput })).query(async ({ ctx, input }) => {
      requireStoreAccess(await userHasStoreAccess(ctx.user.id, input.storeId, ctx.user.role === "admin"));
      return listProducts(input.storeId);
    }),
    create: protectedProcedure.input(z.object({ storeId: storeInput, name: z.string().trim().min(2).max(180), slug: z.string().trim().min(2).max(180), description: z.string().max(5000).optional(), priceMzn: z.number().int().nonnegative(), stock: z.number().int().nonnegative().default(0), category: z.string().trim().min(2).max(80).default("General"), imageUrl: z.string().url().optional() })).mutation(async ({ ctx, input }) => {
      requireStoreAccess(await userHasStoreAccess(ctx.user.id, input.storeId, ctx.user.role === "admin"));
      return insertProduct({ ...input, status: "draft" });
    }),
    archive: protectedProcedure.input(z.object({ storeId: storeInput, productId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      requireStoreAccess(await userHasStoreAccess(ctx.user.id, input.storeId, ctx.user.role === "admin"));
      return archiveProduct(input.storeId, input.productId);
    }),
  }),
});

export type AppRouter = typeof appRouter;
