import { describe, expect, it } from "vitest";

import {
  MARKET_CATEGORIES,
  MARKET_CATALOG,
  getStockPackExtra,
} from "../shared/market-catalog";

import { BANNER_PURCHASE_TO_MODEL } from "../client/src/themes/nova/bannerModels";
import { MODEL_PURCHASE_TO_CARD } from "../client/src/themes/nova/productCardModels";
import { NAV_PURCHASE_TO_BUTTON } from "../client/src/themes/nova/navButtonModels";
import { HEADER_PURCHASE_TO_MODEL } from "../client/src/themes/nova/headerModels";
import { FOOTER_PURCHASE_TO_MODEL } from "../client/src/themes/nova/footerModels";
import { CATEGORY_PURCHASE_TO_MODEL } from "../client/src/themes/nova/categoryCardModels";

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
