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

const configuredBaseURL = process.env.BETTER_AUTH_URL?.trim();

/*
 * URL de recurso usada quando o host do pedido não está na
 * allowlist (ou não é resolvível). Mantém o comportamento
 * anterior: BETTER_AUTH_URL em dev, domínio oficial em produção.
 */
const fallbackBaseURL = (
  configuredBaseURL ||
  (process.env.NODE_ENV === "production"
    ? OFFICIAL_PRODUCTION_URL
    : "http://localhost:3000")
).replace(/\/+$/, "");

/**
 * Extrai o host de BETTER_AUTH_URL (ex.: "localhost:3000").
 * Ignora valores inválidos em vez de rebentar o arranque.
 */
function getConfiguredHost(url: string | undefined) {
  if (!url) {
    return null;
  }

  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

/*
 * Hosts autorizados a servir o fluxo Better Auth.
 *
 * O OAuth (Google) tem de começar e terminar SEMPRE na mesma
 * origem onde a app está aberta: o `redirect_uri` enviado ao
 * provider e o cookie `better-auth.state` são emitidos para essa
 * origem. Se a app for aberta em `http://127.0.0.1:3000` mas o
 * baseURL estiver fixo em `http://localhost:3000`, o pedido de
 * início fica cross-origin e o `state` deixa de ser preservado
 * (state_not_found / state_mismatch no callback).
 *
 * Com uma baseURL dinâmica, o Better Auth resolve a origem a
 * partir do Host do pedido (validado contra esta allowlist), pelo
 * que o fluxo fica sempre same-origin — em localhost, 127.0.0.1,
 * domínios oficiais e previews da Vercel.
 */
const baseURLHosts = Array.from(
  new Set(
    [
      "www.homsteg.com",
      "homsteg.com",
      "localhost:3000",
      "127.0.0.1:3000",
      getConfiguredHost(configuredBaseURL),
      process.env.VERCEL_URL || null,
    ].filter((host): host is string => Boolean(host)),
  ),
);

const baseURL = {
  allowedHosts: baseURLHosts,
  protocol: "auto" as const,
  fallback: fallbackBaseURL,
};

/*
 * Origens autorizadas a chamar /api/auth/*. A lista é explícita:
 * nenhum wildcard, nenhum "Access-Control-Allow-Origin: *".
 * (A baseURL dinâmica já acrescenta os `allowedHosts`; aqui
 * mantêm-se as origens oficiais e as de desenvolvimento.)
 */
const trustedOrigins = Array.from(
  new Set(
    [
      OFFICIAL_PRODUCTION_URL,
      "https://homsteg.com",
      fallbackBaseURL,
      configuredBaseURL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : null,
    ].filter(
      (origin): origin is string => Boolean(origin),
    ),
  ),
);

/*
 * Login social (Better Auth socialProviders).
 *
 * As credenciais vêm SEMPRE de variáveis de ambiente — nunca
 * hardcoded. Um provider só fica ativo quando TODAS as
 * credenciais dele estão definidas:
 *
 * - Google:
 *     GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET
 *     (Google Cloud Console → OAuth 2.0 Client ID, tipo Web.
 *      Redirect URI a registar: {baseURL}/api/auth/callback/google)
 *
 * - Apple:
 *     APPLE_CLIENT_ID (o "Services ID") e APPLE_CLIENT_SECRET
 *     (client secret JWT ES256 assinado com a Sign In with Apple
 *      key; válido no máximo 6 meses — tem de ser regenerado)
 *     APPLE_APP_BUNDLE_IDENTIFIER (opcional — usado como audience
 *      na validação do id_token)
 *     (Apple Developer → Sign in with Apple.
 *      Return URL a registar: {baseURL}/api/auth/callback/apple)
 *
 * Enquanto as credenciais não existirem, o provider é omitido:
 * o Better Auth não o registra e o frontend esconde o botão
 * correspondente (auth.socialProviders no tRPC).
 */
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

const appleClientId = process.env.APPLE_CLIENT_ID?.trim();
const appleClientSecret = process.env.APPLE_CLIENT_SECRET?.trim();
const appleAppBundleIdentifier =
  process.env.APPLE_APP_BUNDLE_IDENTIFIER?.trim();

const isGoogleSocialConfigured = Boolean(
  googleClientId && googleClientSecret,
);

const isAppleSocialConfigured = Boolean(
  appleClientId && appleClientSecret,
);

/**
 * Providers sociais ativos (dependem apenas das env).
 * O router tRPC expõe esta lista ao frontend para
 * mostrar/esconder os botões de login social.
 */
export const activeSocialProviders = {
  google: isGoogleSocialConfigured,
  apple: isAppleSocialConfigured,
} as const;

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
   * Login social "Continuar com Google" / "Continuar com Apple".
   * Cada provider só é registrado quando as respetivas
   * credenciais existem (ver bloco acima). Sem credenciais,
   * o objeto fica vazio — comportamento idêntico ao de hoje.
   */
  socialProviders: {
    ...(isGoogleSocialConfigured && googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),

    ...(isAppleSocialConfigured && appleClientId && appleClientSecret
      ? {
          apple: {
            clientId: appleClientId,
            clientSecret: appleClientSecret,
            ...(appleAppBundleIdentifier
              ? { appBundleIdentifier: appleAppBundleIdentifier }
              : {}),
          },
        }
      : {}),
  },

  /*
   * Página de aterragem para falhas do callback OAuth
   * (state_not_found, state_mismatch, invalid_code, ...
   * — Google/Apple). Em vez da página de erro crua do
   * Better Auth, o utilizador volta ao /login via
   * /login/social/callback com um toast. NÃO afeta o login
   * email/palavra-passe, que devolve erros em JSON.
   */
  onAPIError: {
    errorURL: "/login/social/callback",
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
