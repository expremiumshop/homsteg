import { useState } from "react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

/**
 * Ícones oficiais (SVG inline) — Google multicolor e Apple
 * monocromático. Sem dependências externas.
 */
function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.16 7.16 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.79-.06 2.09-.8 3.24-.77 1.41.11 2.48.66 3.18 1.66-2.93 1.76-2.42 5.62.46 6.71-.63 1.65-1.44 3.28-1.96 3.57ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

type SocialProvider = "google" | "apple";

type ProviderInfo = {
  label: string;
  icon: () => React.ReactNode;
  buttonClassName: string;
  ariaLabel: string;
};

const PROVIDER_INFO: Record<SocialProvider, ProviderInfo> = {
  google: {
    label: "Continuar com Google",
    icon: GoogleIcon,
    ariaLabel: "Continuar com Google",
    buttonClassName:
      "flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-black transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
  },
  apple: {
    label: "Continuar com Apple",
    icon: AppleIcon,
    ariaLabel: "Continuar com Apple",
    buttonClassName:
      "flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-black transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
  },
};

const PROVIDER_ORDER: SocialProvider[] = ["google", "apple"];

/**
 * Botões de login social do Better Auth.
 *
 * A lista de providers vem do servidor (query tRPC
 * auth.socialProviders): um botão só aparece quando o
 * provider está configurado no backend. O botão apenas
 * redireciona para o Google/Apple; a sessão é criada pelo
 * callback do Better Auth e o utilizador aterra em
 * /login/social/callback, que o encaminha como o login
 * manual (loja existente → /app, senão → criar-loja).
 */
export function SocialAuthButtons({
  onErrorRedirect,
}: {
  onErrorRedirect?: () => void;
}) {
  const socialQuery = trpc.auth.socialProviders.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const [pendingProvider, setPendingProvider] =
    useState<SocialProvider | null>(null);

  const available = socialQuery.data;

  async function handleSocialSignIn(provider: SocialProvider) {
    if (pendingProvider) {
      return;
    }

    setPendingProvider(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/login/social/callback",
        /*
         * Sem query embutida: o Better Auth acrescenta o
         * código de erro (ex.: ?error=invalid_code) a este
         * URL — um "?error=1" aqui gerava um parâmetro
         * "error" duplicado no redirect.
         */
        errorCallbackURL: "/login/social/callback",
      });

      if (result?.error) {
        console.error(
          "[SocialAuth] Better Auth error:",
          result.error,
        );

        toast.error(
          result.error.message ||
            `Não foi possível iniciar a autenticação com ${provider === "google" ? "o Google" : "a Apple"}.`,
        );

        setPendingProvider(null);

        onErrorRedirect?.();

        return;
      }

      /*
       * Sucesso: o plugin de redirect do cliente Better Auth
       * navega automaticamente para o consentimento do
       * provider (result.data.redirect === true). Não há
       * mais nada a fazer aqui.
       */
    } catch (error: unknown) {
      console.error("[SocialAuth] Erro inesperado:", error);

      toast.error(
        "Não foi possível iniciar a autenticação social. Tenta novamente.",
      );

      setPendingProvider(null);

      onErrorRedirect?.();
    }
  }

  /*
   * Enquanto a query carrega, não renderiza nada — evita
   * flash de botões que vão desaparecer.
   */
  if (!available) {
    return null;
  }

  const enabledProviders = PROVIDER_ORDER.filter(
    provider => available[provider],
  );

  if (enabledProviders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {enabledProviders.map(provider => {
        const info = PROVIDER_INFO[provider];

        const isPending = pendingProvider === provider;

        const Icon = info.icon;

        return (
          <button
            key={provider}
            type="button"
            onClick={() => handleSocialSignIn(provider)}
            disabled={pendingProvider !== null}
            aria-label={info.ariaLabel}
            className={info.buttonClassName}
          >
            {isPending ? (
              <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            ) : (
              <Icon />
            )}

            {info.label}
          </button>
        );
      })}
    </div>
  );
}
