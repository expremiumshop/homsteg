import type {
  CreateExpressContextOptions,
} from "@trpc/server/adapters/express";

import { fromNodeHeaders } from "better-auth/node";

import type { User } from "../../drizzle/schema";

import { auth } from "../auth";
import { getUserByOpenId } from "../db";

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
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(opts.req.headers),
    });

    if (session?.user?.id) {
      user =
        (await getUserByOpenId(session.user.id)) ?? null;
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