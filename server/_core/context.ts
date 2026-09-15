import type {
  CreateExpressContextOptions,
} from "@trpc/server/adapters/express";

import { getAuth } from "@clerk/express";

import type { User } from "../../drizzle_old/schema";

import {
  getOrCreateClerkUser,
  getUserByOpenId,
} from "../db";

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
    const { userId } = getAuth(
      opts.req,
    );

    if (userId) {
      /*
       * Garante que o utilizador Clerk
       * esteja sincronizado com o Neon.
       */
      await getOrCreateClerkUser(
        userId,
      );

      /*
       * Lê novamente o registo atual
       * diretamente do Neon.
       *
       * O ?? null é importante porque
       * getUserByOpenId pode devolver
       * undefined.
       */
      user =
        (await getUserByOpenId(
          userId,
        )) ?? null;
    }
  } catch (error) {
    console.error(
      "[Auth] Failed to authenticate Clerk user:",
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