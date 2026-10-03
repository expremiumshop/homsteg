/**
 * Modelos de Footer (tema Nova).
 *
 * 1 — Clássico: footer atual da loja (Footer.tsx);
 * 2 — Escuro: fundo escuro com newsletter e links;
 * 3 — Minimal: uma linha com marca, links e copyright.
 *
 * Sem dependências de React: partilhado entre o
 * dashboard (seletor) e o storefront (renderização).
 */

export const FOOTER_MODELS = ["1", "2", "3"] as const;

export type FooterModel = (typeof FOOTER_MODELS)[number];

/**
 * Modelos vendidos no Market como footers isolados
 * (1footer–3footer) e desbloqueados por compra.
 *
 * Na "Personalizar Loja", quando a loja fornece a lista
 * de desbloqueios, APENAS estes modelos podem aparecer —
 * e só os efetivamente comprados. Sem compras, a secção
 * fica vazia.
 */
export const FOOTER_UNLOCKABLE_MODELS = [
  "1",
  "2",
  "3",
] as const;

/**
 * Mapa featureKey Market → modelo de footer.
 * As compras no Market guardam featureKeys ("1footer"…
 * "3footer"); a Personalização consome o modelo ("1"…"3")
 * através deste mapa.
 */
export const FOOTER_PURCHASE_TO_MODEL: Record<
  string,
  FooterModel
> = {
  "1footer": "1",
  "2footer": "2",
  "3footer": "3",
};

/**
 * Mapa inverso: modelo de footer → featureKey Market.
 */
export const FOOTER_TO_MARKET_FEATURE: Record<
  FooterModel,
  string
> = {
  "1": "1footer",
  "2": "2footer",
  "3": "3footer",
};

export function isFooterModel(
  value: unknown,
): value is FooterModel {
  return (
    typeof value === "string" &&
    (FOOTER_MODELS as readonly string[]).includes(value)
  );
}

export const DEFAULT_FOOTER_MODEL: FooterModel = "1";

/**
 * Normaliza o valor guardado na loja para um modelo
 * válido. null/undefined/inválido → "1".
 */
export function normalizeFooterModel(
  value: string | null | undefined,
): FooterModel {
  return isFooterModel(value) ? value : DEFAULT_FOOTER_MODEL;
}

export function getFooterModelLabel(
  model: FooterModel,
): string {
  switch (model) {
    case "1":
      return "Clássico";
    case "2":
      return "Escuro";
    case "3":
      return "Minimal";
  }
}

export function getFooterModelDescription(
  model: FooterModel,
): string {
  switch (model) {
    case "1":
      return "Footer atual da loja: colunas, redes e pagamentos.";
    case "2":
      return "Fundo escuro com newsletter e links em duas colunas.";
    case "3":
      return "Uma linha: marca, links e copyright.";
  }
}
