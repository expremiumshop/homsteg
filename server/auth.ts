import "dotenv/config";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as authSchema from "../drizzle/auth-schema.js";
import { syncBetterAuthUser } from "./db.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não está configurada.");
}

const secret = process.env.BETTER_AUTH_SECRET;

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET não está configurada.");
}

const baseURL =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const pool = new Pool({
  connectionString: databaseUrl,
});

const authDb = drizzle(pool);

export const auth = betterAuth({
  appName: "HOMSTEG",
  secret,
  baseURL,

  database: drizzleAdapter(authDb, {
    provider: "pg",
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await syncBetterAuthUser({
            userId: String(user.id),
            email: user.email,
            name: user.name,
          });
        },
      },

      update: {
        after: async (user) => {
          await syncBetterAuthUser({
            userId: String(user.id),
            email: user.email,
            name: user.name,
          });
        },
      },
    },
  },
});