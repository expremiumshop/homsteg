/* ============================================================
   HOMSTEG — MARKET CATALOG (partilhado)
   ============================================================
   Fonte da ESTRUTURA do módulo Market.

   O que se vende no Market são FUNCIONALIDADES de
   personalização (headers, banners, cartões, rodapés) —
   nunca produtos físicos.

   Este ficheiro define apenas:
   - as categorias de funcionalidades permitidas;
   - que funcionalidades existem, o seu featureKey e
     a ordenação dentro da categoria.

   NÃO contém preços. O conteúdo comercial (nome, preço em
   créditos, descrição e status) vive exclusivamente na
   tabela `market_features` no banco de dados, e é
   administrável pelo painel Admin sem tocar em código.
   ============================================================ */

/** Categorias de funcionalidades do Market. */
export const MARKET_CATEGORIES = [
  "header",
  "banner",
  "category_card",
  "product_card",
  "nav_button",
  "footer",
  "stock",
] as const;

export type MarketCatalogCategory =
  (typeof MARKET_CATEGORIES)[number];

/** Rótulos legíveis das categorias. */
export const MARKET_CATEGORY_LABELS: Record<
  MarketCatalogCategory,
  string
> = {
  header: "Header",
  banner: "Banner",
  category_card: "Category Card",
  product_card: "Product Card",
  nav_button: "Botões de Navegação",
  footer: "Footer",
  stock: "Estoque",
};

/* ============================================================
   CAPACIDADE DE ESTOQUE (produtos por loja)

   Toda loja nova começa com 50 produtos grátis.
   Capacidade adicional vive exclusivamente no Market,
   na categoria "stock": cada pacote comprado
   (store_market_features) soma os seus produtos extras
   à capacidade total da loja.

   Os preços dos pacotes vivem na base de dados
   (market_features), administráveis pelo Admin —
   nunca hardcoded no cliente.
   ============================================================ */

/** Produtos grátis de toda loja nova. */
export const FREE_STOCK_CAPACITY = 50;

/**
 * Pacotes de capacidade extra do Market:
 * featureKey → produtos adicionais.
 */
export const STOCK_PACKS: Record<string, number> = {
  "1stock": 60,
  "2stock": 100,
  "3stock": 200,
  "4stock": 300,
  "5stock": 500,
  "6stock": 1_000,
  "7stock": 5_000,
  "8stock": 15_000,
};

/**
 * Produtos extra de um pacote de estoque
 * (null se o featureKey não for um pacote).
 */
export function getStockPackExtra(
  featureKey: string,
): number | null {
  return STOCK_PACKS[featureKey] ?? null;
}

/**
 * Capacidade total de produtos de uma loja:
 * 50 grátis + soma dos pacotes comprados.
 * (Função pura — partilhada entre server e cliente.)
 */
export function computeStockCapacity(
  purchasedFeatureKeys: string[],
): number {
  let capacity = FREE_STOCK_CAPACITY;

  for (const featureKey of purchasedFeatureKeys) {
    capacity += getStockPackExtra(featureKey) ?? 0;
  }

  return capacity;
}

/**
 * Verifica se a loja pode adicionar mais produtos.
 * (Função pura — testada em server/stock-capacity.logic.test.ts.)
 */
export function canAddProducts(
  capacity: number,
  used: number,
  count = 1,
): boolean {
  return used + count <= capacity;
}

/**
 * Uma funcionalidade estrutural do Market
 * (sem dados comerciais).
 */
export type MarketCatalogEntry = {
  /**
   * Referência ao código isolado da funcionalidade
   * (ex.: "1header"). É a chave comercial.
   */
  featureKey: string;
  category: MarketCatalogCategory;
  /** Ordenação dentro da categoria. */
  sortOrder: number;
};

/**
 * Catálogo estrutural do Market.
 *
 * Cada entrada corresponde a uma pasta
 * client/src/components/dashboard/market/components/
 *   <categoria>/<featureKey>/page.tsx
 *
 * Para publicar uma nova funcionalidade:
 * 1. crie a pasta e o page.tsx isolado (código);
 * 2. registe-a AQUI (estrutura);
 * 3. o Admin cria a funcionalidade no painel
 *    (nome, preço em créditos, descrição, status) —
 *    ou aguarda o seed automático para a editar.
 */
export const MARKET_CATALOG: MarketCatalogEntry[] = [
  // HEADER
  { featureKey: "1header", category: "header", sortOrder: 1 },
  { featureKey: "2header", category: "header", sortOrder: 2 },
  { featureKey: "3header", category: "header", sortOrder: 3 },

  // BANNER
  { featureKey: "1banner", category: "banner", sortOrder: 1 },
  { featureKey: "2banner", category: "banner", sortOrder: 2 },
  { featureKey: "3banner", category: "banner", sortOrder: 3 },
  { featureKey: "4banner", category: "banner", sortOrder: 4 },

  /*
   * Modelos 5–9: extraídos do sistema único de 5 modelos
   * do carrossel da "Personalizar Loja" (tema Nova).
   * Cada um vive isolado na sua pasta e é desbloqueado
   * por compra no Market (store_market_features).
   */
  { featureKey: "5banner", category: "banner", sortOrder: 5 },
  { featureKey: "6banner", category: "banner", sortOrder: 6 },
  { featureKey: "7banner", category: "banner", sortOrder: 7 },
  { featureKey: "8banner", category: "banner", sortOrder: 8 },
  { featureKey: "9banner", category: "banner", sortOrder: 9 },

  /*
   * Banner SIMPLES: o banner atual do sistema
   * (imagem única, sem carrossel). Na Personalização,
   * a compra deste modelo mostra a versão simples de
   * gestão: apenas 1 imagem, sem configurações
   * avançadas.
   */
  { featureKey: "10banner", category: "banner", sortOrder: 10 },

  // CATEGORY CARD
  { featureKey: "1category", category: "category_card", sortOrder: 1 },
  { featureKey: "2category", category: "category_card", sortOrder: 2 },
  { featureKey: "3category", category: "category_card", sortOrder: 3 },

  // PRODUCT CARD
  { featureKey: "1product", category: "product_card", sortOrder: 1 },
  { featureKey: "2product", category: "product_card", sortOrder: 2 },
  { featureKey: "3product", category: "product_card", sortOrder: 3 },

  /*
   * Modelos 4–8: extraídos do sistema único de 5 modelos
   * da "Personalizar Loja" (tema Nova). Cada um vive
   * isolado na sua pasta e é desbloqueado por compra no
   * Market (store_market_features).
   */
  { featureKey: "4product", category: "product_card", sortOrder: 4 },
  { featureKey: "5product", category: "product_card", sortOrder: 5 },
  { featureKey: "6product", category: "product_card", sortOrder: 6 },
  { featureKey: "7product", category: "product_card", sortOrder: 7 },
  { featureKey: "8product", category: "product_card", sortOrder: 8 },

  /*
   * Modelos 1–5: extraídos do botão de navegação
   * (BottomNavigation) do tema Nova — o estilo atual
   * da loja e 4 variações. Cada um vive isolado na sua
   * pasta e é desbloqueado por compra no Market
   * (store_market_features).
   */
  { featureKey: "1navbutton", category: "nav_button", sortOrder: 1 },
  { featureKey: "2navbutton", category: "nav_button", sortOrder: 2 },
  { featureKey: "3navbutton", category: "nav_button", sortOrder: 3 },
  { featureKey: "4navbutton", category: "nav_button", sortOrder: 4 },
  { featureKey: "5navbutton", category: "nav_button", sortOrder: 5 },

  // FOOTER
  { featureKey: "1footer", category: "footer", sortOrder: 1 },
  { featureKey: "2footer", category: "footer", sortOrder: 2 },
  { featureKey: "3footer", category: "footer", sortOrder: 3 },

  /*
   * ESTOQUE — pacotes de capacidade extra de produtos.
   * Toda loja começa com 50 produtos grátis (ver
   * FREE_STOCK_CAPACITY); cada pacote comprado soma
   * os seus produtos extras (STOCK_PACKS).
   */
  { featureKey: "1stock", category: "stock", sortOrder: 1 },
  { featureKey: "2stock", category: "stock", sortOrder: 2 },
  { featureKey: "3stock", category: "stock", sortOrder: 3 },
  { featureKey: "4stock", category: "stock", sortOrder: 4 },
  { featureKey: "5stock", category: "stock", sortOrder: 5 },
  { featureKey: "6stock", category: "stock", sortOrder: 6 },
  { featureKey: "7stock", category: "stock", sortOrder: 7 },
  { featureKey: "8stock", category: "stock", sortOrder: 8 },
];

/** Procura uma entrada estrutural pelo featureKey. */
export function findMarketCatalogEntry(
  featureKey: string,
): MarketCatalogEntry | undefined {
  return MARKET_CATALOG.find(
    (entry) => entry.featureKey === featureKey,
  );
}
