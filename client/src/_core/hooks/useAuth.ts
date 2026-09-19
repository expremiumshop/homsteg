import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

import {
  useCallback,
  useEffect,
  useMemo,
} from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(
  options?: UseAuthOptions,
) {
  const {
    redirectOnUnauthenticated = false,
    redirectPath,
  } = options ?? {};

  const utils = trpc.useUtils();

  const meQuery =
    trpc.auth.me.useQuery(undefined, {
      retry: false,
      refetchOnWindowFocus: false,
    });

  const sessionQuery =
    authClient.useSession();

  const logout = useCallback(
    async () => {
      try {
        const result =
          await authClient.signOut();

        if (result.error) {
          throw new Error(
            result.error.message ||
              "Não foi possível terminar a sessão.",
          );
        }
      } finally {
        try {
          sessionStorage.removeItem(
            "manus-cookie",
          );
        } catch {
          // Ignora erros de sessionStorage.
        }

        utils.auth.me.setData(
          undefined,
          null,
        );

        await utils.auth.me.invalidate();
      }
    },
    [utils],
  );

  const state = useMemo(() => {
    const betterAuthSession =
      sessionQuery.data;

    const user =
      meQuery.data ?? null;

    const isSessionLoading =
      sessionQuery.isPending;

    const isAuthenticated =
      Boolean(
        betterAuthSession?.user &&
          user,
      );

    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(user),
    );

    return {
      user,
      loading:
        meQuery.isLoading ||
        isSessionLoading,
      error:
        meQuery.error ??
        sessionQuery.error ??
        null,
      isAuthenticated,
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    sessionQuery.data,
    sessionQuery.error,
    sessionQuery.isPending,
  ]);

  useEffect(() => {
    if (
      !redirectOnUnauthenticated
    ) {
      return;
    }

    if (state.loading) {
      return;
    }

    if (state.user) {
      return;
    }

    if (
      state.isAuthenticated
    ) {
      return;
    }

    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    if (
      redirectPath &&
      window.location.pathname ===
        redirectPath
    ) {
      return;
    }

    if (redirectPath) {
      window.location.assign(
        redirectPath,
      );
      return;
    }

    window.location.assign(
      "/login",
    );
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    state.loading,
    state.user,
    state.isAuthenticated,
  ]);

  return {
    ...state,

    refresh: () =>
      meQuery.refetch(),

    logout,
  };
}