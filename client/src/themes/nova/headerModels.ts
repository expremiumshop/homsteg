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

export const HEADER_MODELS = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
] as const;

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
  ...HEADER_MODELS,
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
  "4header": "4",
  "5header": "5",
  "6header": "6",
  "7header": "7",
  "8header": "8",
  "9header": "9",
  "10header": "10",
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
  "4": "4header",
  "5": "5header",
  "6": "6header",
  "7": "7header",
  "8": "8header",
  "9": "9header",
  "10": "10header",
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
    case "4":
      return "Faixa de anúncio";
    case "5":
      return "Editorial";
    case "6":
      return "Compacto com categorias";
    case "7":
      return "Marca centrada";
    case "8":
      return "Colorido";
    case "9":
      return "Pesquisa destacada";
    case "10":
      return "Com navegação superior";
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
    case "4":
      return "Anúncio promocional acima da marca e pesquisa.";
    case "5":
      return "Marca editorial com serifas e pesquisa discreta.";
    case "6":
      return "Cabeçalho compacto com atalhos de categorias.";
    case "7":
      return "Marca centrada com ações laterais.";
    case "8":
      return "Cabeçalho colorido com pesquisa em destaque.";
    case "9":
      return "Pesquisa ampla como elemento principal.";
    case "10":
      return "Marca e links de navegação numa barra superior.";
  }
}
