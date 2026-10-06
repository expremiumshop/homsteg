import type { ComponentType } from "react";
import { Store } from "lucide-react";

import type {
  MarketCatalogCategory,
  MarketCatalogEntry,
} from "@shared/market-catalog";
import {
  MARKET_CATALOG,
  MARKET_CATEGORY_LABELS,
} from "@shared/market-catalog";

import Header1 from "./components/header/1header/page";
import Header2 from "./components/header/2header/page";
import Header3 from "./components/header/3header/page";

import Banner1 from "./components/banner/1banner/page";
import Banner2 from "./components/banner/2banner/page";
import Banner3 from "./components/banner/3banner/page";
import Banner4 from "./components/banner/4banner/page";
import Banner5 from "./components/banner/5banner/page";
import Banner6 from "./components/banner/6banner/page";
import Banner7 from "./components/banner/7banner/page";
import Banner8 from "./components/banner/8banner/page";
import Banner9 from "./components/banner/9banner/page";
import Banner10 from "./components/banner/10banner/page";

import Category1 from "./components/category-card/1category/page";
import Category2 from "./components/category-card/2category/page";
import Category3 from "./components/category-card/3category/page";

import Product1 from "./components/product-card/1product/page";
import Product2 from "./components/product-card/2product/page";
import Product3 from "./components/product-card/3product/page";
import Product4 from "./components/product-card/4product/page";
import Product5 from "./components/product-card/5product/page";
import Product6 from "./components/product-card/6product/page";
import Product7 from "./components/product-card/7product/page";
import Product8 from "./components/product-card/8product/page";

import NavButton1 from "./components/nav-button/1navbutton/page";
import NavButton2 from "./components/nav-button/2navbutton/page";
import NavButton3 from "./components/nav-button/3navbutton/page";
import NavButton4 from "./components/nav-button/4navbutton/page";
import NavButton5 from "./components/nav-button/5navbutton/page";

import Footer1 from "./components/footer/1footer/page";
import Footer2 from "./components/footer/2footer/page";
import Footer3 from "./components/footer/3footer/page";

import Stock1 from "./components/stock/1stock/page";
import Stock2 from "./components/stock/2stock/page";
import Stock3 from "./components/stock/3stock/page";
import Stock4 from "./components/stock/4stock/page";
import Stock5 from "./components/stock/5stock/page";
import Stock6 from "./components/stock/6stock/page";
import Stock7 from "./components/stock/7stock/page";
import Stock8 from "./components/stock/8stock/page";

/* =========================================================
   Tipos partilhados do módulo MARKET (isolado)
   ========================================================= */

/**
 * Funcionalidade Market: o que se vende no Market
 * (personalização da loja), com dados comerciais vindos
 * sempre da base de dados.
 */
export type MarketFeature = {
  featureKey: string;
  name: string;
  description: string;
  category: MarketCatalogCategory;
  priceCredits: number;
  status: "active" | "inactive";
  sortOrder?: number;
};

export type MarketCategory = {
  slug: string;
  name: string;
  imageUrl?: string | null;
};

export type MarketSectionKind = MarketCatalogCategory;

/* =========================================================
   Configuração passada a cada variante
   ========================================================= */

export type MarketSectionConfig = {
  feature: MarketFeature;
  category: MarketCategory;
};

/** Props aceites por qualquer variante do módulo Market. */
export type MarketVariantProps = {
  config?: MarketSectionConfig;
  feature?: MarketFeature;
  category?: MarketCategory;

  /*
   * Dados demo para os previews do Market — o cliente
   * vê o modelo com conteúdo realista (imagem incluída)
   * antes de comprar. Nunca usados na loja real.
   */
  product?: MarketDemoProduct;
  banner?: MarketDemoBanner;
};

/*
 * Tipos estruturais dos dados demo. As variantes definem
 * os seus tipos locais compatíveis; aqui servem apenas
 * para a página do Market passar os dados de forma
 * type-checked (sem casts).
 */
export type MarketDemoProduct = {
  slug?: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  featured?: boolean;
  storeName?: string;
  image?: string | null;
  imageUrl?: string | null;
  category?: string | null;
};

export type MarketDemoBanner = {
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
};

/* =========================================================
   Mapa featureKey → componente (estrutura isolada)
   ========================================================= */

/**
 * Os componentes de produto usam um tipo local de demo
 * (price/name/imageUrl). Fazemos o cast uma única vez,
 * aqui, para manter os ficheiros das variantes isolados
 * do tipo comercial (MarketFeature, com priceCredits).
 */
const MARKET_COMPONENTS: Record<
  string,
  ComponentType<MarketVariantProps>
> = {
  "1header": Header1,
  "2header": Header2,
  "3header": Header3,

  "1banner": Banner1,
  "2banner": Banner2,
  "3banner": Banner3,
  "4banner": Banner4,
  "5banner": Banner5 as unknown as ComponentType<MarketVariantProps>,
  "6banner": Banner6 as unknown as ComponentType<MarketVariantProps>,
  "7banner": Banner7 as unknown as ComponentType<MarketVariantProps>,
  "8banner": Banner8 as unknown as ComponentType<MarketVariantProps>,
  "9banner": Banner9 as unknown as ComponentType<MarketVariantProps>,
  "10banner": Banner10 as unknown as ComponentType<MarketVariantProps>,

  "1category": Category1,
  "2category": Category2,
  "3category": Category3,

  "1product": Product1 as unknown as ComponentType<MarketVariantProps>,
  "2product": Product2 as unknown as ComponentType<MarketVariantProps>,
  "3product": Product3 as unknown as ComponentType<MarketVariantProps>,
  "4product": Product4 as unknown as ComponentType<MarketVariantProps>,
  "5product": Product5 as unknown as ComponentType<MarketVariantProps>,
  "6product": Product6 as unknown as ComponentType<MarketVariantProps>,
  "7product": Product7 as unknown as ComponentType<MarketVariantProps>,
  "8product": Product8 as unknown as ComponentType<MarketVariantProps>,

  "1navbutton": NavButton1 as unknown as ComponentType<MarketVariantProps>,
  "2navbutton": NavButton2 as unknown as ComponentType<MarketVariantProps>,
  "3navbutton": NavButton3 as unknown as ComponentType<MarketVariantProps>,
  "4navbutton": NavButton4 as unknown as ComponentType<MarketVariantProps>,
  "5navbutton": NavButton5 as unknown as ComponentType<MarketVariantProps>,

  "1footer": Footer1,
  "2footer": Footer2,
  "3footer": Footer3,

  "1stock": Stock1 as unknown as ComponentType<MarketVariantProps>,
  "2stock": Stock2 as unknown as ComponentType<MarketVariantProps>,
  "3stock": Stock3 as unknown as ComponentType<MarketVariantProps>,
  "4stock": Stock4 as unknown as ComponentType<MarketVariantProps>,
  "5stock": Stock5 as unknown as ComponentType<MarketVariantProps>,
  "6stock": Stock6 as unknown as ComponentType<MarketVariantProps>,
  "7stock": Stock7 as unknown as ComponentType<MarketVariantProps>,
  "8stock": Stock8 as unknown as ComponentType<MarketVariantProps>,
};

/**
 * Entrada de funcionalidade: a estrutura vem do catálogo
 * partilhado (shared/market-catalog.ts); o componente
 * é resolvido pelo featureKey. Sem dados comerciais aqui.
 */
export type MarketVariantEntry = {
  featureKey: string;
  category: MarketSectionKind;
  sortOrder: number;
  Component: ComponentType<MarketVariantProps>;
};

function toEntry(
  entry: MarketCatalogEntry,
): MarketVariantEntry | null {
  const Component =
    MARKET_COMPONENTS[entry.featureKey];

  if (!Component) {
    return null;
  }

  return {
    featureKey: entry.featureKey,
    category: entry.category,
    sortOrder: entry.sortOrder,
    Component,
  };
}

/**
 * Catálogo estrutural do Market, resolvido com os
 * componentes isolados. A lista comercial (preços,
 * status) chega da base de dados via market.features.
 */
export const MARKET_VARIANTS: MarketVariantEntry[] =
  MARKET_CATALOG.map(toEntry).filter(
    (entry): entry is MarketVariantEntry =>
      entry !== null,
  );

export const MARKET_SECTION_LABELS: Record<
  MarketSectionKind,
  string
> = { ...MARKET_CATEGORY_LABELS };

export const MARKET_SECTION_ORDER: MarketSectionKind[] = [
  "header",
  "banner",
  "category_card",
  "product_card",
  "nav_button",
  "footer",
  "stock",
];

export function getMarketVariants(
  kind: MarketSectionKind,
): MarketVariantEntry[] {
  return MARKET_VARIANTS.filter(
    (entry) => entry.category === kind,
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function findMarketVariant(
  featureKey: string | null | undefined,
): MarketVariantEntry | null {
  if (!featureKey) return null;

  return (
    MARKET_VARIANTS.find(
      (entry) => entry.featureKey === featureKey,
    ) ?? null
  );
}

/** Ícone usado nos pontos de entrada (menu, branding). */
export const MARKET_ENTRY_ICON = Store;
