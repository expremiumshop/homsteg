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
] as const;

export type ProductCardModel =
  (typeof PRODUCT_CARD_MODELS)[number];

/**
 * Modelos vendidos no Market como cartões isolados
 * (4product–8product) e desbloqueados por compra.
 *
 * Na "Personalizar Loja", quando a loja fornece a lista
 * de desbloqueios, APENAS estes modelos podem aparecer —
 * e só os efetivamente comprados. Sem compras, a secção
 * fica vazia.
 */
export const PRODUCT_CARD_UNLOCKABLE_MODELS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
] as const;

/**
 * Mapa featureKey Market → modelo de cartão.
 * As compras no Market guardam featureKeys ("4product"…
 * "8product", "1product"–"3product"); a Personalização
 * consome o modelo ("1"…"8") através deste mapa.
 */
export const MODEL_PURCHASE_TO_CARD: Record<
  string,
  ProductCardModel
> = {
  "4product": "1",
  "5product": "2",
  "6product": "3",
  "7product": "4",
  "8product": "5",
  "1product": "6",
  "2product": "7",
  "3product": "8",
};

/**
 * Mapa inverso: modelo de cartão → featureKey Market.
 */
export const MODEL_TO_MARKET_FEATURE: Record<
  ProductCardModel,
  string
> = {
  "1": "4product",
  "2": "5product",
  "3": "6product",
  "4": "7product",
  "5": "8product",
  "6": "1product",
  "7": "2product",
  "8": "3product",
};

export function isProductCardModel(
  value: unknown,
): value is ProductCardModel {
  return (
    typeof value === "string" &&
    (PRODUCT_CARD_MODELS as readonly string[]).includes(value)
  );
}

export const DEFAULT_PRODUCT_CARD_MODEL: ProductCardModel = "1";

/**
 * Normaliza o valor guardado na loja para um modelo
 * válido. null/undefined/valor inválido → "1".
 */
export function normalizeProductCardModel(
  value: string | null | undefined,
): ProductCardModel {
  return isProductCardModel(value)
    ? value
    : DEFAULT_PRODUCT_CARD_MODEL;
}

export function getProductCardModelLabel(
  model: ProductCardModel,
): string {
  switch (model) {
    case "1":
      return "Clássico";
    case "2":
      return "Imagem";
    case "3":
      return "Preço";
    case "4":
      return "Nome";
    case "5":
      return "Completo";
    case "6":
      return "Elevado";
    case "7":
      return "Compacto";
    case "8":
      return "Horizontal";
  }
}

export function getProductCardModelDescription(
  model: ProductCardModel,
): string {
  switch (model) {
    case "1":
      return "Estilo atual da loja: imagem, nome, loja e preço.";
    case "2":
      return "Minimalista: apenas a imagem do produto.";
    case "3":
      return "Imagem com o preço por baixo.";
    case "4":
      return "Imagem com o nome do produto por baixo.";
    case "5":
      return "Imagem, nome, preço e botão Comprar.";
    case "6":
      return "Sombra suave, categoria, preço e botão circular.";
    case "7":
      return "Quadrado, com nome e preço em destaque.";
    case "8":
      return "Linha com imagem à esquerda e seta à direita.";
  }
}
