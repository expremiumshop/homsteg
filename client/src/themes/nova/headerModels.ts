/**
 * Modelos de Header (tema Nova).
 *
 * 1 — Clássico: header atual da loja (Header.tsx);
 * 2 — Minimal: barra única com logo à esquerda e
 *     pesquisa/ações à direita;
 * 3 — Escuro: barra escura com marca e pesquisa
 *     centradas.
 *
 * Sem dependências de React: partilhado entre o
 * dashboard (seletor) e o storefront (renderização).
 */

export const HEADER_MODELS = ["1", "2", "3"] as const;

export type HeaderModel = (typeof HEADER_MODELS)[number];

/**
 * Modelos vendidos no Market como headers isolados
 * (1header–3header) e desbloqueados por compra.
 *
 * Na "Personalizar Loja", quando a loja fornece a lista
 * de desbloqueios, APENAS estes modelos podem aparecer —
 * e só os efetivamente comprados. Sem compras, a secção
 * fica vazia.
 */
export const HEADER_UNLOCKABLE_MODELS = [
  "1",
  "2",
  "3",
] as const;

/**
 * Mapa featureKey Market → modelo de header.
 * As compras no Market guardam featureKeys ("1header"…
 * "3header"); a Personalização consome o modelo ("1"…"3")
 * através deste mapa.
 */
export const HEADER_PURCHASE_TO_MODEL: Record<
  string,
  HeaderModel
> = {
  "1header": "1",
  "2header": "2",
  "3header": "3",
};

/**
 * Mapa inverso: modelo de header → featureKey Market.
 */
export const HEADER_TO_MARKET_FEATURE: Record<
  HeaderModel,
  string
> = {
  "1": "1header",
  "2": "2header",
  "3": "3header",
};

export function isHeaderModel(
  value: unknown,
): value is HeaderModel {
  return (
    typeof value === "string" &&
    (HEADER_MODELS as readonly string[]).includes(value)
  );
}

export const DEFAULT_HEADER_MODEL: HeaderModel = "1";

/**
 * Normaliza o valor guardado na loja para um modelo
 * válido. null/undefined/inválido → "1".
 */
export function normalizeHeaderModel(
  value: string | null | undefined,
): HeaderModel {
  return isHeaderModel(value) ? value : DEFAULT_HEADER_MODEL;
}

export function getHeaderModelLabel(
  model: HeaderModel,
): string {
  switch (model) {
    case "1":
      return "Clássico";
    case "2":
      return "Minimal";
    case "3":
      return "Escuro";
  }
}

export function getHeaderModelDescription(
  model: HeaderModel,
): string {
  switch (model) {
    case "1":
      return "Header atual da loja: topbar, pesquisa e categorias.";
    case "2":
      return "Barra única: logo à esquerda, pesquisa e ações à direita.";
    case "3":
      return "Barra escura com marca e pesquisa centradas.";
  }
}
