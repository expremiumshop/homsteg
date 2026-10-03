import { trpc } from "@/lib/trpc";

/**
 * Leitura do estado da loja para o dashboard.
 *
 * A plataforma é 100% gratuita: sem planos,
 * mensalidades ou upgrades. Devolve o saldo de
 * crédito da loja (usado apenas no Market) e a
 * contagem de produtos.
 */
export function useStorePlan(
  storeId: string | null | undefined,
) {
  const usageQuery =
    trpc.stores.usage.current.useQuery(
      { storeId: storeId ?? "" },
      {
        enabled: Boolean(storeId),
        retry: false,
        refetchOnWindowFocus: true,
      },
    );

  /*
   * Créditos da loja — unidade interna da
   * plataforma, usados apenas no Market.
   * NULL/sem dados = 0.
   */
  const creditMzn =
    usageQuery.data?.store.creditMzn ?? 0;

  const productsUsed =
    usageQuery.data?.productsUsed ?? 0;

  return {
    usageQuery,
    creditMzn,
    productsUsed,
  };
}
