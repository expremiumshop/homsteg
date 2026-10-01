/**
 * Modelos de Botões de Navegação (tema Nova).
 *
 * 1 — Clássico: estilo atual da loja (BottomNavigation);
 * 2 — Pílula: barra flutuante em pílula compacta;
 * 3 — Ícones: apenas ícones, sem rótulos;
 * 4 — Preenchido: separadores com fundo por item;
 * 5 — Elevado: itens ativos elevados com sombra.
 *
 * Sem dependências de React: partilhado entre o
 * dashboard (seletor) e o storefront (renderização).
 */

export const NAV_BUTTON_MODELS = [
  "1",
  "2",
  "3",
  "4",
  "5",
] as const;

export type NavButtonModel =
  (typeof NAV_BUTTON_MODELS)[number];

/**
 * Modelos vendidos no Market como botões de navegação
 * isolados (1navbutton–5navbutton) e desbloqueados por
 * compra.
 *
 * Na "Personalizar Loja", quando a loja fornece a lista
 * de desbloqueios, APENAS estes modelos podem aparecer —
 * e só os efetivamente comprados. Sem compras, a secção
 * fica vazia.
 */
export const NAV_BUTTON_UNLOCKABLE_MODELS = [
  "1",
  "2",
  "3",
  "4",
  "5",
] as const;

/**
 * Mapa featureKey Market → modelo de botão.
 * As compras no Market guardam featureKeys ("1navbutton"…
 * "5navbutton"); a Personalização consome o modelo
 * ("1"…"5") através deste mapa.
 */
export const NAV_PURCHASE_TO_BUTTON: Record<
  string,
  NavButtonModel
> = {
  "1navbutton": "1",
  "2navbutton": "2",
  "3navbutton": "3",
  "4navbutton": "4",
  "5navbutton": "5",
};

/**
 * Mapa inverso: modelo de botão → featureKey Market.
 */
export const NAV_TO_MARKET_FEATURE: Record<
  NavButtonModel,
  string
> = {
  "1": "1navbutton",
  "2": "2navbutton",
  "3": "3navbutton",
  "4": "4navbutton",
  "5": "5navbutton",
};

export function isNavButtonModel(
  value: unknown,
): value is NavButtonModel {
  return (
    typeof value === "string" &&
    (NAV_BUTTON_MODELS as readonly string[]).includes(value)
  );
}

export const DEFAULT_NAV_BUTTON_MODEL: NavButtonModel = "1";

/**
 * Normaliza o valor guardado na loja para um modelo
 * válido. null/undefined/valor inválido → "1".
 */
export function normalizeNavButtonModel(
  value: string | null | undefined,
): NavButtonModel {
  return isNavButtonModel(value)
    ? value
    : DEFAULT_NAV_BUTTON_MODEL;
}

export function getNavButtonModelLabel(
  model: NavButtonModel,
): string {
  switch (model) {
    case "1":
      return "Clássico";
    case "2":
      return "Pílula";
    case "3":
      return "Ícones";
    case "4":
      return "Preenchido";
    case "5":
      return "Elevado";
  }
}

export function getNavButtonModelDescription(
  model: NavButtonModel,
): string {
  switch (model) {
    case "1":
      return "Estilo atual da loja: barra branca com ícones, rótulos e indicador.";
    case "2":
      return "Pílula compacta com rótulos por baixo dos ícones.";
    case "3":
      return "Apenas ícones centrados, sem rótulos.";
    case "4":
      return "Separadores com fundo preenchido no item ativo.";
    case "5":
      return "Item ativo elevado, com destaque e sombra.";
  }
}
