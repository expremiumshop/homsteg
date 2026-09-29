/**
 * Modelos de cartão de produto (tema Nova).
 *
 * 1 — estilo atual da loja (imagem, nome, loja, preço);
 * 2 — minimalista: apenas a imagem;
 * 3 — imagem + preço;
 * 4 — imagem + nome;
 * 5 — imagem + nome + preço + botão Comprar (WhatsApp).
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
] as const;

export type ProductCardModel =
  (typeof PRODUCT_CARD_MODELS)[number];

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
  }
}
