import { describe, expect, it } from "vitest";
import { normalizeCustomDomain } from "./custom-domain.js";

describe("normalizeCustomDomain", () => {
  it("normalizes case and accepts www, apex, and nested subdomains", () => {
    expect(normalizeCustomDomain(" WWW.Example.COM ")).toBe("www.example.com");
    expect(normalizeCustomDomain("ExAmPlE.com")).toBe("example.com");
    expect(normalizeCustomDomain("shop.eu.example.com")).toBe(
      "shop.eu.example.com"
    );
  });

  it("rejects URLs, paths, spaces, malformed hosts, and reserved HOMSTEG hosts", () => {
    for (const value of [
      "https://example.com",
      "example.com/loja",
      "shop name.example.com",
      "-bad.example.com",
      "example..com",
      "localhost",
      "127.0.0.1",
      "www.homsteg.com",
      "store.vercel.app",
    ]) {
      expect(normalizeCustomDomain(value), value).toBeNull();
    }
  });

  it("converts internationalized hostnames to ASCII", () => {
    expect(normalizeCustomDomain("loja.例え.テスト")).toBe(
      "loja.xn--r8jz45g.xn--zckzah"
    );
  });
});
