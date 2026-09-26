import { trpc } from "@/lib/trpc";

export function useStorePlan(
  storeId: string | null | undefined,
) {
  const planQuery =
    trpc.stores.plan.current.useQuery(
      { storeId: storeId ?? "" },
      {
        enabled: Boolean(storeId),
        retry: false,
        refetchOnWindowFocus: true,
      },
    );

  const planKey =
    planQuery.data?.store.planKey ?? "free";

  const productsUsed =
    planQuery.data?.productsUsed ?? 0;

  return {
    planQuery,
    planKey,
    productsUsed,
    latestRequest:
      planQuery.data?.latestRequest ?? null,
  };
}
