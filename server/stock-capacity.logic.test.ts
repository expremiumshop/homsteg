import { describe, expect, it } from "vitest";

import {
  FREE_STOCK_CAPACITY,
  MARKET_CATEGORIES,
  MARKET_CATALOG,
  STOCK_PACKS,
  canAddProducts,
  computeStockCapacity,
  getStockPackExtra,
} from "../shared/market-catalog";

describe("HOMSTEG stock capacity (Estoque)", () => {
  it("toda loja nova começa com 50 produtos grátis", () => {
    expect(FREE_STOCK_CAPACITY).toBe(50);
    expect(computeStockCapacity([])).toBe(50);
  });

  it("pacotes do Market somam os produtos extras corretos", () => {
    expect(STOCK_PACKS).toEqual({
      "1stock": 60,
      "2stock": 100,
      "3stock": 200,
      "4stock": 300,
      "5stock": 500,
      "6stock": 1_000,
      "7stock": 5_000,
      "8stock": 15_000,
    });

    expect(computeStockCapacity(["1stock"])).toBe(110);
    expect(computeStockCapacity(["2stock"])).toBe(150);
    expect(computeStockCapacity(["3stock"])).toBe(250);
    expect(computeStockCapacity(["4stock"])).toBe(350);
    expect(computeStockCapacity(["5stock"])).toBe(550);
    expect(computeStockCapacity(["6stock"])).toBe(1_050);
    expect(computeStockCapacity(["7stock"])).toBe(5_050);
    expect(computeStockCapacity(["8stock"])).toBe(15_050);

    expect(
      computeStockCapacity([
        "1stock",
        "2stock",
        "3stock",
        "4stock",
        "5stock",
        "6stock",
        "7stock",
        "8stock",
      ]),
    ).toBe(22_210);
  });

  it("ignora featureKeys que não são pacotes de estoque", () => {
    expect(
      computeStockCapacity([
        "4product",
        "1banner",
        "2header",
      ]),
    ).toBe(50);

    expect(getStockPackExtra("4product")).toBeNull();
    expect(getStockPackExtra("2stock")).toBe(100);
  });

  it("permite criar produto só enquanto há capacidade livre", () => {
    expect(canAddProducts(50, 49, 1)).toBe(true);
    expect(canAddProducts(50, 50, 1)).toBe(false);
    expect(canAddProducts(110, 100, 10)).toBe(true);
    expect(canAddProducts(110, 101, 10)).toBe(false);
  });

  it("registra a categoria stock no catálogo estrutural", () => {
    expect(MARKET_CATEGORIES).toContain("stock");

    const stockEntries = MARKET_CATALOG.filter(
      (entry) => entry.category === "stock",
    );

    expect(
      stockEntries.map((entry) => entry.featureKey),
    ).toEqual([
      "1stock",
      "2stock",
      "3stock",
      "4stock",
      "5stock",
      "6stock",
      "7stock",
      "8stock",
    ]);

    expect(
      stockEntries.map((entry) => entry.sortOrder),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
