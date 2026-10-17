import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  MARKET_CATEGORIES,
  MARKET_CATALOG,
  getMarketModelNumbers,
  getStockPackExtra,
} from "../shared/market-catalog";

import type { MarketCatalogCategory } from "../shared/market-catalog";

import {
  BANNER_MODELS,
  BANNER_PURCHASE_TO_MODEL,
} from "../client/src/themes/nova/bannerModels";
import {
  MODEL_PURCHASE_TO_CARD,
  PRODUCT_CARD_MODELS,
} from "../client/src/themes/nova/productCardModels";
import {
  NAV_BUTTON_MODELS,
  NAV_PURCHASE_TO_BUTTON,
} from "../client/src/themes/nova/navButtonModels";
import {
  HEADER_MODELS,
  HEADER_PURCHASE_TO_MODEL,
} from "../client/src/themes/nova/headerModels";
import {
  FOOTER_MODELS,
  FOOTER_PURCHASE_TO_MODEL,
} from "../client/src/themes/nova/footerModels";
import {
  CATEGORY_CARD_MODELS,
  CATEGORY_PURCHASE_TO_MODEL,
} from "../client/src/themes/nova/categoryCardModels";
import { MARKET_VARIANTS } from "../client/src/components/dashboard/market/registry";

/**
 * Fluxo Market → Personalizar Loja:
 * cada modelo comprado no Market (store_market_features)
 * tem de ficar disponível na secção correspondente da
 * Personalização. Estes testes garantem que TODA a
 * entrada do catálogo tem um mapa de desbloqueio, por
 * categoria — e que os mapas não apontam para nada
 * fora do catálogo.
 */
describe("Market → Personalizar Loja (mapeamento de compras)", () => {
  const PURCHASE_MAPS: Record<string, Record<string, string>> = {
    banner: BANNER_PURCHASE_TO_MODEL,
    product_card: MODEL_PURCHASE_TO_CARD,
    nav_button: NAV_PURCHASE_TO_BUTTON,
    header: HEADER_PURCHASE_TO_MODEL,
    footer: FOOTER_PURCHASE_TO_MODEL,
    category_card: CATEGORY_PURCHASE_TO_MODEL,
  };

  it("mantém pelo menos 10 opções por categoria sem alterar Stock", () => {
    const expectedCounts = {
      header: 10,
      banner: 10,
      category_card: 10,
      product_card: 10,
      nav_button: 10,
      footer: 10,
      stock: 8,
    } as const;

    for (const [category, expectedCount] of Object.entries(
      expectedCounts,
    )) {
      expect(
        MARKET_CATALOG.filter((entry) => entry.category === category),
      ).toHaveLength(expectedCount);
    }
  });

  it("cada featureKey tem um componente de preview próprio", () => {
    const components = MARKET_VARIANTS.map(
      (variant) => variant.Component,
    );

    expect(new Set(components).size).toBe(components.length);
  });

  it("todas as categorias de modelos têm mapa de desbloqueio", () => {
    const modelCategories = MARKET_CATEGORIES.filter(
      (category) => category !== "stock",
    );

    for (const category of modelCategories) {
      expect(
        PURCHASE_MAPS[category],
        `Categoria "${category}" sem mapa de desbloqueio`,
      ).toBeDefined();
    }
  });

  it("todo featureKey do catálogo (não-estoque) desbloqueia um modelo na sua categoria", () => {
    for (const entry of MARKET_CATALOG) {
      if (entry.category === "stock") {
        /* Pacotes de estoque: capacidade, não modelo. */
        expect(getStockPackExtra(entry.featureKey)).not.toBeNull();
        continue;
      }

      const map = PURCHASE_MAPS[entry.category];

      expect(
        map?.[entry.featureKey],
        `"${entry.featureKey}" (${entry.category}) não aparece na Personalizar Loja`,
      ).toBeDefined();
    }
  });

  it("os mapas não contêm featureKeys fora do catálogo", () => {
    const catalogKeys = new Set(
      MARKET_CATALOG.map((entry) => entry.featureKey),
    );

    for (const map of Object.values(PURCHASE_MAPS)) {
      for (const featureKey of Object.keys(map)) {
        expect(
          catalogKeys.has(featureKey),
          `"${featureKey}" existe no mapa mas não no catálogo`,
        ).toBe(true);
      }
    }
  });

  it("nenhum modelo aponta para featureKeys de outra categoria", () => {
    const categoryByKey = new Map(
      MARKET_CATALOG.map((entry) => [
        entry.featureKey,
        entry.category,
      ]),
    );

    for (const [category, map] of Object.entries(
      PURCHASE_MAPS,
    )) {
      for (const featureKey of Object.keys(map)) {
        expect(categoryByKey.get(featureKey)).toBe(
          category,
        );
      }
    }
  });
});

/* ============================================================
   CONTRATO DOS MODELOS (fonte única de verdade)

   Bug corrigido: o Market vendia 4header–10header,
   4footer–10footer, 4category–10category e
   6navbutton–10navbutton, mas o backend só aceitava
   1–3 / 1–3 / 1–3 / 1–5. A loja comprava um modelo que
   a Personalizar Loja não conseguia guardar.

   Regra atual: o domínio de modelos é DERIVADO do
   MARKET_CATALOG (shared/market-catalog.ts) e consumido
   pelo router e pelo tema. Estes testes falham se os três
   voltarem a divergir.
   ============================================================ */

describe("HOMSTEG — contrato dos modelos do Market", () => {
  /** Modelos que o TEMA Nova consegue selecionar/renderizar. */
  const CLIENT_MODELS: Record<
    Exclude<MarketCatalogCategory, "stock">,
    readonly string[]
  > = {
    header: HEADER_MODELS,
    banner: BANNER_MODELS,
    category_card: CATEGORY_CARD_MODELS,
    product_card: PRODUCT_CARD_MODELS,
    nav_button: NAV_BUTTON_MODELS,
    footer: FOOTER_MODELS,
  };

  const routersSource = readFileSync(
    path.join(import.meta.dirname, "routers.ts"),
    "utf8",
  );

  it("cada categoria de modelos tem domínio derivado do catálogo", () => {
    for (const category of Object.keys(CLIENT_MODELS) as Array<
      keyof typeof CLIENT_MODELS
    >) {
      expect(
        getMarketModelNumbers(category).length,
        `"${category}" não tem modelos derivados do catálogo`,
      ).toBeGreaterThan(0);
    }
  });

  it("o router usa o domínio derivado (não volta a listas à mão)", () => {
    /*
     * Verificação de ligação (wiring) — não de formatação:
     * cada setter tem de construir o schema a partir do
     * helper derivado do catálogo.
     */
    for (const category of Object.keys(CLIENT_MODELS) as Array<
      keyof typeof CLIENT_MODELS
    >) {
      expect(
        routersSource,
        `server/routers.ts não deriva o domínio de "${category}" do catálogo`,
      ).toContain(`marketModelEnum("${category}")`);
    }
  });

  it("todos os modelos vendidos são selecionáveis no tema", () => {
    for (const [category, themeModels] of Object.entries(
      CLIENT_MODELS,
    )) {
      for (const model of getMarketModelNumbers(
        category as MarketCatalogCategory,
      )) {
        expect(
          themeModels as readonly string[],
          `modelo "${model}" vendido em ${category} não existe no tema`,
        ).toContain(model);
      }
    }
  });

  it("o tema não oferece modelos que o Market não vende", () => {
    for (const [category, themeModels] of Object.entries(
      CLIENT_MODELS,
    )) {
      const catalogModels = getMarketModelNumbers(
        category as MarketCatalogCategory,
      );

      for (const model of themeModels) {
        expect(
          catalogModels,
          `modelo "${model}" existe no tema mas não é vendido em ${category}`,
        ).toContain(model);
      }
    }
  });

  it("domínio do Market = domínio do tema (igualdade exata)", () => {
    for (const [category, themeModels] of Object.entries(
      CLIENT_MODELS,
    )) {
      expect(
        getMarketModelNumbers(
          category as MarketCatalogCategory,
        ),
        `domínio divergente em "${category}"`,
      ).toEqual([...themeModels]);
    }
  });

  it("regressão: modelos 4–10 das categorias antes limitadas são aceites", () => {
    for (const category of [
      "header",
      "footer",
      "category_card",
      "nav_button",
    ] as const) {
      const models = getMarketModelNumbers(category);

      for (const model of [
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
      ]) {
        expect(
          models,
          `${category} recusa o modelo "${model}" vendido no Market`,
        ).toContain(model);
      }
    }
  });

  it("featureKey fora do padrão não inventa um modelo", () => {
    const catalogKeys = MARKET_CATALOG.map(
      (entry) => entry.featureKey,
    );

    for (const key of catalogKeys) {
      expect(key).toMatch(/^\d+[a-z]+$/);
    }
  });
});
