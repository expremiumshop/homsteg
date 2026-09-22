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

export async function createContext(
  opts: CreateExpressContextOptions,
): Promise<TrpcContext> {
  let user: User | null = null;

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
