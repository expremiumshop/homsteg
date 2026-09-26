import { createAuthClient } from "better-auth/react";

import { emailOTPClient } from "better-auth/client/plugins";

const authBaseUrl =
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
