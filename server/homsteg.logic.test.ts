import { describe, expect, it } from "vitest";
import { assertTenantAccess, canCreateProduct, canUseFeature, sanitizeStoreId } from "../shared/homsteg";

describe("HOMSTEG plan entitlements", () => {
  it("enforces the Free product limit", () => {
    expect(canCreateProduct("free", 9)).toBe(true);
    expect(canCreateProduct("free", 10)).toBe(false);
  });

  it("keeps advanced features behind the correct plan", () => {
    expect(canUseFeature("starter", "advanced_analytics")).toBe(false);
    expect(canUseFeature("business", "advanced_analytics")).toBe(true);
    expect(canUseFeature("pro", "marketing")).toBe(true);
  });
});

describe("HOMSTEG tenant boundary", () => {
  it("allows a merchant to access only a store they belong to", () => {
    expect(assertTenantAccess({ role: "merchant", memberStoreIds: ["store-a"], storeId: "store-a" })).toBe(true);
    expect(() => assertTenantAccess({ role: "merchant", memberStoreIds: ["store-a"], storeId: "store-b" })).toThrow("TENANT_ACCESS_DENIED");
  });

  it("allows admin access through the controlled admin path", () => {
    expect(assertTenantAccess({ role: "admin", memberStoreIds: [], storeId: "store-b" })).toBe(true);
  });

  it("rejects malformed store ids before they reach a query", () => {
    expect(sanitizeStoreId("store-a")).toBe("store-a");
    expect(() => sanitizeStoreId("x")).toThrow("INVALID_STORE_ID");
    expect(() => sanitizeStoreId(undefined)).toThrow("INVALID_STORE_ID");
  });
});
