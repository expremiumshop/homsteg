import { useEffect, useRef } from "react";

import { Store } from "lucide-react";

import { toast } from "sonner";

import { useLocation } from "wouter";
import HomstegLogo from "@/components/HomstegLogo";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

/**
 * Página de aterragem do callback social.
 *
 * O Better Auth cria a sessão sozinho em
 * /api/auth/callback/{google,apple} e redireciona para o
 * callbackURL indicado no início do fluxo — esta página.
 *
 * Aqui apenas replicamos o encaminhamento pós-login do Login
 * manual: loja existente → /app?storeId=..., senão →
 * /criar-loja/negocio. Nada de lógica de sessão própria.
 */
export default function SocialAuthCallback() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const hasError = new URLSearchParams(
    window.location.search,
  ).get("error");

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;

    if (hasError) {
      toast.error(
        "A autenticação social não foi concluída. Tenta novamente.",
      );

      setLocation("/login");

      return;
    }

    async function routeAfterSocialLogin() {
      try {
        await authClient.getSession();

        await Promise.all([
          utils.auth.me.invalidate(),
          utils.stores.mine.invalidate(),
        ]);

        const stores = await utils.stores.mine.fetch();

        if (stores.length > 0) {
          const firstItem = stores[0];

          const firstStore =
            "store" in firstItem
              ? firstItem.store
              : firstItem;

          if (firstStore?.id) {
            window.location.assign(
              `/app?storeId=${encodeURIComponent(firstStore.id)}`,
            );

            return;
          }
        }

        window.location.assign("/criar-loja/negocio");
      } catch (error: unknown) {
        console.error(
          "[SocialAuthCallback] Erro ao encaminhar após login social:",
          error,
        );

        toast.error(
          "A autenticação foi concluída, mas não foi possível carregar a tua loja.",
        );

        window.location.assign("/app");
      }
    }

    void routeAfterSocialLogin();
  }, [hasError, setLocation, utils]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div
        aria-busy="true"
        className="flex flex-col items-center gap-4"
      >
        <HomstegLogo size={48} iconOnly />

        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500" />

        <p className="text-sm text-slate-500">
          A concluir a autenticação...
        </p>
      </div>
    </div>
  );
}
