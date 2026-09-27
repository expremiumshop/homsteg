import "dotenv/config";

import { betterAuth } from "better-auth";

import { emailOTP } from "better-auth/plugins/email-otp";

import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";

import * as authSchema from "../drizzle/auth-schema.js";
import { syncBetterAuthUser } from "./db.js";
import { sendLoginOtpEmail } from "./email.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não está configurada.");
}

const secret = process.env.BETTER_AUTH_SECRET;

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET não está configurada.");
}

/*
 * Domínio oficial de produção. Frontend e API são servidos
 * na mesma origem (https://www.homsteg.com), pelo que o Better
 * Auth nunca deve receber pedidos de origens cruzadas.
 */
const OFFICIAL_PRODUCTION_URL = "https://www.homsteg.com";

const baseURL =
  process.env.BETTER_AUTH_URL ||
  (process.env.NODE_ENV === "production"
    ? OFFICIAL_PRODUCTION_URL
    : "http://localhost:3000");

/*
 * Origens autorizadas a chamar /api/auth/*. A lista é explícita:
 * nenhum wildcard, nenhum "Access-Control-Allow-Origin: *".
 * - www.homsteg.com: domínio oficial de produção.
 * - homsteg.com: apex, caso sirva tráfego diretamente.
 * - baseURL: o valor efetivamente configurado (env ou VERCEL_URL).
 */
const trustedOrigins = Array.from(
  new Set(
    [
      OFFICIAL_PRODUCTION_URL,
      "https://homsteg.com",
      baseURL,
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : null,
      "http://localhost:3000",
    ].filter(
      (origin): origin is string => Boolean(origin),
    ),
  ),
);

const pool = new Pool({
  connectionString: databaseUrl,
});

const authDb = drizzle(pool);

/**
 * Lê diretamente o utilizador Better Auth (tabela `user`).
 * É a fonte da verdade para `emailVerified`, usada como gate
 * do fluxo HOMSTEG (só continua quem validar o OTP).
 */
export async function getBetterAuthUserById(
  userId: string,
) {
  const result = await authDb
    .select()
    .from(authSchema.user)
    .where(eq(authSchema.user.id, userId))
    .limit(1);

  return result[0] ?? null;
}

export const auth = betterAuth({
  appName: "HOMSTEG",

  secret,

  baseURL,

  trustedOrigins,

  database: drizzleAdapter(authDb, {
    provider: "pg",
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  /*
   * Fluxo HOMSTEG: depois de criar a conta é enviado um OTP
   * por email (via Resend). Só continua quem o validar.
   *
   * - OTP de 6 dígitos, válido durante 5 minutos.
   * - Máximo de 3 tentativas de verificação.
   * - A verificação é single-use: um código já utilizado,
   *   expirado ou esgotado em tentativas é rejeitado.
   */
  plugins: [
    emailOTP({
      otpLength: 6,

      expiresIn: 5 * 60,

      allowedAttempts: 3,

      storeOTP: "encrypted",

      sendVerificationOTP: async ({ email, otp }) => {
        await sendLoginOtpEmail(email, otp);
      },
    }),
  ],

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
