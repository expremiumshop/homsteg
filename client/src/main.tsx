import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";

import App from "./App";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { startLogin } from "./const";

import "./index.css";

/*
 * Defaults de desempenho:
 *
 * - staleTime 30s: navegar entre secções do dashboard não
 *   refaz as mesmas consultas — dados de menos de 30s são
 *   reutilizados (React Query continua a deduplicar chaves).
 * - refetchOnWindowFocus false: voltar ao tab não dispara
 *   rajadas de refetch; queries que querem frescura no foco
 *   mantêm refetchOnWindowFocus: true explícito, e polling
 *   (refetchInterval) fica intacto onde já existia.
 * - retry 1: falhas transitórias tentam uma vez, sem
 *   multiplicar pedidos.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;

  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  startLogin();
};

queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;

    redirectToLoginIfUnauthorized(error);

    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;

    redirectToLoginIfUnauthorized(error);

    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);