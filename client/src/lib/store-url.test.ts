import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getPublicStoreUrl,
  getStoreHostname,
  getStorePath,
  getStoreUrlLabel,
  isDevEnvironment,
  STORE_BASE_DOMAIN,
} from "./store-url";

function stubWindow(hostname: string) {
  vi.stubGlobal("window", {
    location: { hostname },
  } as unknown as Window & typeof globalThis);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("store-url", () => {
  it("keeps the production subdomain format", () => {
    stubWindow("homsteg.com");

    expect(STORE_BASE_DOMAIN).toBe("homsteg.com");
    expect(getStoreHostname("moda")).toBe("moda.homsteg.com");
    expect(getStoreHostname("modernfashion")).toBe(
      "modernfashion.homsteg.com",
    );
    expect(getPublicStoreUrl("fashionatefashion")).toBe(
      "https://fashionatefashion.homsteg.com",
    );
  });

  it("uses /store/:slug in development/localhost", () => {
    stubWindow("localhost");

    expect(isDevEnvironment()).toBe(true);
    expect(getPublicStoreUrl("moda")).toBe("/store/moda");
    expect(getStoreUrlLabel("moda")).toBe("/store/moda");
  });

  it("treats 127.0.0.1 as development", () => {
    stubWindow("127.0.0.1");

    expect(isDevEnvironment()).toBe(true);
    expect(getPublicStoreUrl("moda")).toBe("/store/moda");
  });

  it("treats non-localhost hosts as production", () => {
    stubWindow("homsteg.com");

    expect(isDevEnvironment()).toBe(false);
    expect(getPublicStoreUrl("moda")).toBe(
      "https://moda.homsteg.com",
    );
    expect(getStoreUrlLabel("moda")).toBe("moda.homsteg.com");
  });

  it("falls back to production outside the browser", () => {
    vi.stubGlobal("window", undefined);

    // Non-browser (SSR/build): DEV=false → production behavior.
    expect(isDevEnvironment()).toBe(false);
    expect(getPublicStoreUrl("moda")).toBe(
      "https://moda.homsteg.com",
    );
  });

  it("keeps the internal path route unchanged", () => {
    expect(getStorePath("moda")).toBe("/store/moda");
  });

  it("builds consistent labels and urls in each environment", () => {
    stubWindow("localhost");
    expect(getStoreUrlLabel("moda")).toBe(getPublicStoreUrl("moda"));

    stubWindow("homsteg.com");
    expect(getStoreUrlLabel("moda")).toBe("moda.homsteg.com");
    expect(getPublicStoreUrl("moda")).toBe(
      "https://moda.homsteg.com",
    );
  });
});
