import { describe, expect, it } from "vitest";
import {
  addOneMonth,
  assertTenantAccess,
  canCreateProduct,
  canUseFeature,
  getSubscriptionStatus,
  getProductLimit,
  isPaidPlan,
  sanitizeStoreId,
} from "../shared/homsteg";

describe("HOMSTEG plan entitlements", () => {
  it("enforces the Free product limit of 50", () => {
    expect(getProductLimit("free")).toBe(50);
    expect(canCreateProduct("free", 49)).toBe(true);
    expect(canCreateProduct("free", 50)).toBe(false);
  });

  it("matches the published plan limits", () => {
    expect(getProductLimit("starter")).toBe(580);
    expect(getProductLimit("business")).toBe(2450);
    expect(getProductLimit("professional")).toBe(5850);
    expect(getProductLimit("enterprise")).toBe(-1);
  });

  it("keeps advanced features behind the correct plan", () => {
    expect(canUseFeature("starter", "advanced_analytics")).toBe(false);
    expect(canUseFeature("business", "advanced_analytics")).toBe(true);
    expect(canUseFeature("professional", "marketing")).toBe(true);
    expect(canUseFeature("enterprise", "priority_support")).toBe(true);
  });
});

describe("HOMSTEG subscription period", () => {
  it("adds exactly one calendar month with end-of-month clamping", () => {
    expect(addOneMonth(new Date(Date.UTC(2026, 0, 15)))).toEqual(new Date(Date.UTC(2026, 1, 15)));
    expect(addOneMonth(new Date(Date.UTC(2026, 0, 31)))).toEqual(new Date(Date.UTC(2026, 1, 28)));
    expect(addOneMonth(new Date(Date.UTC(2026, 11, 3)))).toEqual(new Date(Date.UTC(2027, 0, 3)));
  });

  it("treats only non-free plans as paid", () => {
    expect(isPaidPlan("free")).toBe(false);
    expect(isPaidPlan("starter")).toBe(true);
    expect(isPaidPlan("enterprise")).toBe(true);
  });

  it("classifies the subscription status for admin alerts", () => {
    const now = new Date(Date.UTC(2026, 5, 15));

    expect(getSubscriptionStatus({ planKey: "free", paidUntil: null, now })).toBe("free");
    expect(getSubscriptionStatus({ planKey: "starter", paidUntil: null, now })).toBe("expired");
    expect(getSubscriptionStatus({ planKey: "starter", paidUntil: new Date(Date.UTC(2026, 6, 15)), now })).toBe("active");
    expect(getSubscriptionStatus({ planKey: "starter", paidUntil: new Date(Date.UTC(2026, 5, 19)), now })).toBe("expiring");
    expect(getSubscriptionStatus({ planKey: "starter", paidUntil: new Date(Date.UTC(2026, 5, 14)), now })).toBe("expired");
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
