import { createAuthClient } from "better-auth/react";

import { emailOTPClient } from "better-auth/client/plugins";

/*
 * Em produção o frontend e a API são servidos na mesma origem
 * (https://www.homsteg.com), pelo que o cliente de auth usa sempre
 * window.location.origin. Isto elimina pedidos cross-origin (CORS)
 * para domínios antigos (ex.: *.vercel.app) baked no bundle.
 * Em desenvolvimento mantém-se o override via VITE_BETTER_AUTH_URL.
 */
const authBaseUrl =
  (typeof window !== "undefined" &&
  import.meta.env.PROD
    ? window.location.origin
    : undefined) ||
  import.meta.env.VITE_BETTER_AUTH_URL ||
  (typeof window === "undefined"
    ? "http://localhost:3000"
    : window.location.origin);

export const authClient = createAuthClient({
  baseURL: authBaseUrl,

  fetchOptions: {
    credentials: "include",
  },

  plugins: [emailOTPClient()],
});

export type AuthSession =
  typeof authClient.$Infer.Session;
