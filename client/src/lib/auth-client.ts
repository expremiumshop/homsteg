import { createAuthClient } from "better-auth/react";

import { emailOTPClient } from "better-auth/client/plugins";

/*
 * O OAuth (Google) tem de começar e terminar na MESMA origem onde a
 * app está aberta: o `redirect_uri` e o cookie `better-auth.state`
 * são emitidos para essa origem. Se o cliente apontar para outro
 * host (ex.: app em http://127.0.0.1:3000 e baseURL em
 * http://localhost:3000), o pedido de início fica cross-origin e o
 * `state` não sobrevive até ao callback.
 *
 * Por isso, no browser, usamos SEMPRE window.location.origin — o
 * servidor Express serve a API e a SPA na mesma origem (prod e dev).
 * O VITE_BETTER_AUTH_URL fica apenas como fallback fora do browser
 * (SSR/scripts).
 */
const authBaseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : import.meta.env.VITE_BETTER_AUTH_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: authBaseUrl,

  fetchOptions: {
    credentials: "include",
  },

  plugins: [emailOTPClient()],
});

export type AuthSession =
  typeof authClient.$Infer.Session;
