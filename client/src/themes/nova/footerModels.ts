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

export const FOOTER_MODELS = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
] as const;

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
  ...FOOTER_MODELS,
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
  "4footer": "4",
  "5footer": "5",
  "6footer": "6",
  "7footer": "7",
  "8footer": "8",
  "9footer": "9",
  "10footer": "10",
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
  "4": "4footer",
  "5": "5footer",
  "6": "6footer",
  "7": "7footer",
  "8": "8footer",
  "9": "9footer",
  "10": "10footer",
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
    case "4":
      return "Faixa de contacto";
    case "5":
      return "Editorial";
    case "6":
      return "Duas colunas";
    case "7":
      return "Centralizado";
    case "8":
      return "Verde natural";
    case "9":
      return "Faixa compacta";
    case "10":
      return "Cartão de marca";
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
    case "4":
      return "Faixa de contacto com ações rápidas.";
    case "5":
      return "Identidade editorial com marca e links em destaque.";
    case "6":
      return "Duas colunas simples para loja e apoio.";
    case "7":
      return "Marca e links alinhados ao centro.";
    case "8":
      return "Fundo verde com assinatura clara.";
    case "9":
      return "Faixa compacta com redes sociais e copyright.";
    case "10":
      return "Cartão de marca com contactos e atalhos.";
  }
}
