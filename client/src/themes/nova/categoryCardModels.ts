/**
 * Modelos de Category Card — Seções (tema Nova).
 *
 * 1 — Imagem: cartão com imagem de fundo e nome
 *     sobreposto;
 * 2 — Ícone: cartão compacto com ícone e contagem;
 * 3 — Borda: cartão claro com borda e seta lateral.
 *
 * Sem dependências de React: partilhado entre o
 * dashboard (seletor) e o storefront (renderização).
 */

export const CATEGORY_CARD_MODELS = [
  "1",
  "2",
  "3",
] as const;

export type CategoryCardModel =
  (typeof CATEGORY_CARD_MODELS)[number];

/**
 * Modelos vendidos no Market como cartões de categoria
 * isolados (1category–3category) e desbloqueados por
 * compra.
 *
 * Na "Personalizar Loja", quando a loja fornece a lista
 * de desbloqueios, APENAS estes modelos podem aparecer —
 * e só os efetivamente comprados. Sem compras, a secção
 * fica vazia.
 */
export const CATEGORY_CARD_UNLOCKABLE_MODELS = [
  "1",
  "2",
  "3",
] as const;

/**
 * Mapa featureKey Market → modelo de cartão de categoria.
 * As compras no Market guardam featureKeys ("1category"…
 * "3category"); a Personalização consome o modelo
 * ("1"…"3") através deste mapa.
 */
export const CATEGORY_PURCHASE_TO_MODEL: Record<
  string,
  CategoryCardModel
> = {
  "1category": "1",
  "2category": "2",
  "3category": "3",
};

/**
 * Mapa inverso: modelo de cartão de categoria →
 * featureKey Market.
 */
export const CATEGORY_TO_MARKET_FEATURE: Record<
  CategoryCardModel,
  string
> = {
  "1": "1category",
  "2": "2category",
  "3": "3category",
};

export function isCategoryCardModel(
  value: unknown,
): value is CategoryCardModel {
  return (
    typeof value === "string" &&
    (CATEGORY_CARD_MODELS as readonly string[]).includes(
      value,
    )
  );
}

export const DEFAULT_CATEGORY_CARD_MODEL: CategoryCardModel =
  "1";

/**
 * Normaliza o valor guardado na loja para um modelo
 * válido. null/undefined/inválido → "1".
 */
export function normalizeCategoryCardModel(
  value: string | null | undefined,
): CategoryCardModel {
  return isCategoryCardModel(value)
    ? value
    : DEFAULT_CATEGORY_CARD_MODEL;
}

export function getCategoryCardModelLabel(
  model: CategoryCardModel,
): string {
  switch (model) {
    case "1":
      return "Imagem";
    case "2":
      return "Ícone";
    case "3":
      return "Borda";
  }
}

export function getCategoryCardModelDescription(
  model: CategoryCardModel,
): string {
  switch (model) {
    case "1":
      return "Cartão com imagem de fundo e nome sobreposto.";
    case "2":
      return "Cartão compacto com ícone e contagem.";
    case "3":
      return "Cartão claro com borda e seta lateral.";
  }
}
