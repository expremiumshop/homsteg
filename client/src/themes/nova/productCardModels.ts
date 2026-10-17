/**
 * Modelos de cartão de produto (tema Nova).
 *
 * 1 — estilo atual da loja (imagem, nome, loja, preço);
 * 2 — minimalista: apenas a imagem;
 * 3 — imagem + preço;
 * 4 — imagem + nome;
 * 5 — imagem + nome + preço + botão Comprar (WhatsApp);
 * 6 — Elevado (Market 1product): sombra suave, categoria,
 *     nome, preço em destaque e botão de compra circular;
 * 7 — Compacto (Market 2product): quadrado, nome e preço;
 * 8 — Horizontal (Market 3product): linha com imagem à
 *     esquerda, categoria, nome, preço e seta.
 *
 * Sem dependências de React: partilhado entre o
 * dashboard (seletor) e o storefront (renderização).
 */

export const PRODUCT_CARD_MODELS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
] as const;

export type ProductCardModel =
  (typeof PRODUCT_CARD_MODELS)[number];

/**
 * Alias para leitura de hint pelo seletor de modelo
 * (dashboard, visualização).
 */
export type ProductCardModelRead =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | null;

/**
 * Conversão de chave de compra (featureKey do MARKET) →
 * modelo de cartão de produto do Nova suportado.
 *
 * Fonte: featureKeys exposíveis pelaíndice de compra do MARKET
 * (distintos: elephant, notas, animals, etc.) → modelos de
 * cartão implementados no Nova (1..8).
 */
export const PRODUCT_CARD_UNLOCKABLE_MODELS = PRODUCT_CARD_MODELS;

export const MODEL_PURCHASE_TO_CARD: Record<string, ProductCardModel> = {
  "4product": "1",
  "5product": "2",
  "6product": "3",
  "7product": "4",
  "8product": "5",
  "1product": "6",
  "2product": "7",
  "3product": "8",
  "9product": "9",
  "10product": "10",
};

export const MODEL_TO_MARKET_FEATURE: Record<ProductCardModel, string> = {
  "1": "4product",
  "2": "5product",
  "3": "6product",
  "4": "7product",
  "5": "8product",
  "6": "1product",
  "7": "2product",
  "8": "3product",
  "9": "9product",
  "10": "10product",
};

export function isProductCardModel(value: unknown): value is ProductCardModel {
  return (
    typeof value === "string" &&
    (PRODUCT_CARD_MODELS as readonly string[]).includes(value)
  );
}

export const DEFAULT_PRODUCT_CARD_MODEL: ProductCardModel = "1";

export function getProductCardModelLabel(model: ProductCardModel): string {
  switch (model) {
    case "1": return "Clássico";
    case "2": return "Imagem";
    case "3": return "Preço";
    case "4": return "Nome";
    case "5": return "Completo";
    case "6": return "Elevado";
    case "7": return "Compacto";
    case "8": return "Horizontal";
    case "9": return "Campanha";
    case "10": return "Editorial";
  }
}

export function normalizeProductCardModel(
  model: string | null | undefined,
): ProductCardModel {
  return isProductCardModel(model) ? model : DEFAULT_PRODUCT_CARD_MODEL;
}
