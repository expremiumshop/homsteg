export const HOMSTEG_PLANS = {
  free: { name: "Free", productLimit: 10, features: ["basic_checkout", "homsteg_domain"] },
  starter: { name: "Starter", productLimit: 100, features: ["basic_checkout", "homsteg_domain", "discounts", "basic_analytics"] },
  business: { name: "Business", productLimit: 1000, features: ["basic_checkout", "homsteg_domain", "custom_domain", "discounts", "basic_analytics", "advanced_analytics", "staff"] },
  pro: { name: "Pro", productLimit: 5000, features: ["basic_checkout", "homsteg_domain", "custom_domain", "discounts", "basic_analytics", "advanced_analytics", "staff", "marketing"] },
  enterprise: { name: "Enterprise", productLimit: Number.POSITIVE_INFINITY, features: ["basic_checkout", "homsteg_domain", "custom_domain", "discounts", "basic_analytics", "advanced_analytics", "staff", "marketing", "priority_support"] },
} as const;

export type PlanKey = keyof typeof HOMSTEG_PLANS;
export type FeatureKey = typeof HOMSTEG_PLANS[PlanKey]["features"][number];

export function canCreateProduct(plan: PlanKey, currentProductCount: number) {
  return currentProductCount < HOMSTEG_PLANS[plan].productLimit;
}

export function canUseFeature(plan: PlanKey, feature: FeatureKey) {
  return (HOMSTEG_PLANS[plan].features as readonly string[]).includes(feature);
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
