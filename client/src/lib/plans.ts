export type ClientPlanKey =
  | "free"
  | "starter"
  | "business"
  | "professional"
  | "enterprise";

export const CLIENT_PLANS: Record<
  ClientPlanKey,
  { name: string; limit: number | null }
> = {
  free: { name: "Free", limit: 50 },
  starter: { name: "Starter", limit: 580 },
  business: { name: "Business", limit: 2450 },
  professional: { name: "Professional", limit: 5850 },
  enterprise: { name: "Enterprise", limit: null },
};

export function isClientPlanKey(
  value: unknown,
): value is ClientPlanKey {
  return (
    typeof value === "string" &&
    value in CLIENT_PLANS
  );
}

/**
 * "Free Plan", "Starter Plan", ... conforme pedido.
 */
export function getPlanDisplayName(
  planKey: string | null | undefined,
) {
  if (!isClientPlanKey(planKey)) {
    return "Free Plan";
  }

  return `${CLIENT_PLANS[planKey].name} Plan`;
}

/** Limite de produtos; null = ilimitado. */
export function getPlanProductLimit(
  planKey: string | null | undefined,
): number | null {
  if (!isClientPlanKey(planKey)) {
    return CLIENT_PLANS.free.limit;
  }

  return CLIENT_PLANS[planKey].limit;
}

export function getPlanProductLimitLabel(
  planKey: string | null | undefined,
) {
  const limit = getPlanProductLimit(planKey);

  if (limit === null) {
    return "Produtos ilimitados";
  }

  return `${limit.toLocaleString("pt-PT")} produtos`;
}

export function formatPlanUsage(
  used: number,
  planKey: string | null | undefined,
) {
  const limit = getPlanProductLimit(planKey);

  if (limit === null) {
    return `${used.toLocaleString("pt-PT")} / ilimitado`;
  }

  return `${used.toLocaleString("pt-PT")} / ${limit.toLocaleString("pt-PT")}`;
}
