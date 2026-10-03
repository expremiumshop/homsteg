import type {
  CreateExpressContextOptions,
} from "@trpc/server/adapters/express";

import { fromNodeHeaders } from "better-auth/node";

import type { User } from "../../drizzle/schema.js";

import { auth } from "../auth.js";

import { resolveBetterAuthBusinessUser } from "../db.js";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/*
 * Cookie de sessão do Better Auth (com e sem prefixo __Secure-).
 * Usado para detetar pedidos anónimos sem tocar na base de dados.
 */
const SESSION_COOKIE_RE =
  /(?:^|;\s*)(?:__Secure-)?better-auth\.session_token=/;

export async function createContext(
  opts: CreateExpressContextOptions,
): Promise<TrpcContext> {
  let user: User | null = null;

  /*
   * Atalho de desempenho: pedidos SEM cookie de sessão nem
   * header Authorization (ex.: lojas públicas, Market público)
   * nunca têm utilizador. Saltar auth.api.getSession evita
   * 2-3 consultas à base de dados por pedido anónimo — a
   * rota mais pesada da plataforma (storefront) não paga
   * nada por sessões que não existem.
   */
  const hasCredentials =
    SESSION_COOKIE_RE.test(opts.req.headers.cookie ?? "") ||
    Boolean(opts.req.headers.authorization);

  if (!hasCredentials) {
    return {
      req: opts.req,
      res: opts.res,
      user: null,
    };
  }

  try {
    const session =
      await auth.api.getSession({
        headers: fromNodeHeaders(
          opts.req.headers,
        ),
      });

    if (session?.user?.id) {
      user = await resolveBetterAuthBusinessUser({
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      });
    }
  } catch (error) {
    console.error(
      "[Auth] Failed to authenticate Better Auth user:",
      error,
    );

    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
