export const HOMSTEG_PLANS = {
  free: { name: "Free", productLimit: 50, features: ["basic_checkout", "homsteg_domain"] },
  starter: { name: "Starter", productLimit: 580, features: ["basic_checkout", "homsteg_domain", "discounts", "basic_analytics"] },
  business: { name: "Business", productLimit: 2450, features: ["basic_checkout", "homsteg_domain", "custom_domain", "discounts", "basic_analytics", "advanced_analytics", "staff"] },
  professional: { name: "Professional", productLimit: 5850, features: ["basic_checkout", "homsteg_domain", "custom_domain", "discounts", "basic_analytics", "advanced_analytics", "store_owner", "staff", "marketing"] },
  enterprise: { name: "Enterprise", productLimit: Number.POSITIVE_INFINITY, features: ["basic_checkout", "homsteg_domain", "custom_domain", "discounts", "basic_analytics", "advanced_analytics", "staff", "marketing", "priority_support"] },
} as const;

export type PlanKey = keyof typeof HOMSTEG_PLANS;
export type FeatureKey = typeof HOMSTEG_PLANS[PlanKey]["features"][number];

export const PLAN_KEYS = Object.keys(HOMSTEG_PLANS) as PlanKey[];

export const PLAN_ORDER: PlanKey[] = [
  "free",
  "starter",
  "business",
  "professional",
  "enterprise",
];

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && value in HOMSTEG_PLANS;
}

export function getProductLimit(plan: PlanKey): number {
  const limit = HOMSTEG_PLANS[plan].productLimit;

  return Number.isFinite(limit) ? limit : -1;
}

/** -1 means unlimited (Enterprise). */
export function canCreateProduct(
  plan: PlanKey,
  currentProductCount: number,
) {
  return currentProductCount < getProductLimit(plan);
}

export function canUseFeature(plan: PlanKey, feature: FeatureKey) {
  return (HOMSTEG_PLANS[plan].features as readonly string[]).includes(feature);
}

/** "Free Plan", "Starter Plan", ... for owner-facing display. */
export function getPlanDisplayName(plan: PlanKey) {
  return `${HOMSTEG_PLANS[plan].name} Plan`;
}

export function getPlanProductLimitLabel(plan: PlanKey) {
  const limit = getProductLimit(plan);

  if (limit === -1) {
    return "Produtos ilimitados";
  }

  return `${limit.toLocaleString("pt-PT")} produtos`;
}

export function assertTenantAccess({ role, memberStoreIds, storeId }: { role: "admin" | "merchant"; memberStoreIds: string[]; storeId: string }) {
  if (role === "admin") return true;
  if (!memberStoreIds.includes(storeId)) throw new Error("TENANT_ACCESS_DENIED");
  return true;
}

export function sanitizeStoreId(storeId: unknown) {
  if (typeof storeId !== "string" || storeId.trim().length < 3 || storeId.length > 64) throw new Error("INVALID_STORE_ID");
  return storeId.trim();
}

/* ============================================================
   SUBSCRIPTION PERIOD
   ============================================================ */

/**
 * Acrescenta exatamente um mês calendário, com clamp
 * para o fim do mês (31/01 + 1 mês = 28/02).
 */
export function addOneMonth(date: Date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const targetYear =
    month === 11 ? year + 1 : year;
  const targetMonth =
    month === 11 ? 0 : month + 1;
  const daysInTargetMonth = new Date(
    Date.UTC(targetYear, targetMonth + 1, 0),
  ).getUTCDate();

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      Math.min(day, daysInTargetMonth),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  );
}

/** Planos pagos (tudo menos Free). */
export function isPaidPlan(plan: PlanKey) {
  return plan !== "free";
}

export type SubscriptionStatus =
  | "free"
  | "active"
  | "expiring"
  | "expired";

/**
 * Estado da subscrição mensal para alertas de admin:
 * - "free": plano Free, sem cobrança
 * - "active": pago, >7 dias para expirar
 * - "expiring": pago, <=7 dias para expirar
 * - "expired": prazo terminou, contacto via WhatsApp
 */
export function getSubscriptionStatus({
  planKey,
  paidUntil,
  now = new Date(),
}: {
  planKey: string;
  paidUntil: Date | string | null;
  now?: Date;
}): SubscriptionStatus {
  if (!isPlanKey(planKey) || !isPaidPlan(planKey)) {
    return "free";
  }

  if (!paidUntil) {
    return "expired";
  }

  const until =
    typeof paidUntil === "string"
      ? new Date(paidUntil)
      : paidUntil;

  if (Number.isNaN(until.getTime())) {
    return "expired";
  }

  const msLeft = until.getTime() - now.getTime();

  const day = 24 * 60 * 60 * 1000;

  if (msLeft <= 0) {
    return "expired";
  }

  if (msLeft <= 7 * day) {
    return "expiring";
  }

  return "active";
}
