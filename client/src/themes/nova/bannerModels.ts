/**
 * Modelos de banner do carrossel (tema Nova).
 *
 * 1 — Atual/Compacto (design e comportamento atuais);
 * 2 — Grande (área maior, título + subtítulo + área de conteúdo);
 * 3 — Duplo (duas áreas visuais/conteúdo no mesmo slide);
 * 4 — Split (duas metades lado a lado no mesmo slide);
 * 5 — Overlay (texto em destaque sobre a imagem).
 *
 * Sem dependências de React: partilhado entre o
 * dashboard (seletor/inputs) e o storefront.
 */

export const BANNER_MODELS = [
  "1",
  "2",
  "3",
  "4",
  "5",
] as const;

export type BannerModel = (typeof BANNER_MODELS)[number];

export function isBannerModel(
  value: unknown,
): value is BannerModel {
  return (
    typeof value === "string" &&
    (BANNER_MODELS as readonly string[]).includes(value)
  );
}

export const DEFAULT_BANNER_MODEL: BannerModel = "1";

/**
 * Normaliza o valor guardado na loja para um
 * modelo válido. null/undefined/inválido → "1".
 */
export function normalizeBannerModel(
  value: string | null | undefined,
): BannerModel {
  return isBannerModel(value) ? value : DEFAULT_BANNER_MODEL;
}

export type BannerText = {
  title?: string;
  subtitle?: string;
};

/**
 * Slide normalizado do carrossel: imagem + textos.
 * A ordem é [legado (bannerKey), ...bannerKeys].
 */
export type BannerSlide = BannerText & {
  url: string;
};

export function getBannerModelLabel(
  model: BannerModel,
): string {
  switch (model) {
    case "1":
      return "Atual (compacto)";
    case "2":
      return "Grande";
    case "3":
      return "Duplo";
    case "4":
      return "Split";
    case "5":
      return "Overlay";
  }
}

export function getBannerModelDescription(
  model: BannerModel,
): string {
  switch (model) {
    case "1":
      return "Design atual do carrossel, sem alterações.";
    case "2":
      return "Área maior com título, subtítulo e conteúdo.";
    case "3":
      return "Duas áreas visuais no mesmo slide.";
    case "4":
      return "Duas metades lado a lado (imagem + texto).";
    case "5":
      return "Título e subtítulo em destaque sobre a imagem.";
  }
}

/**
 * Modelos que exibem texto. Usado pelo dashboard para
 * mostrar/ocultar os inputs de título/subtítulo.
 */
export function bannerModelUsesText(
  model: BannerModel,
): boolean {
  return model !== "1";
}

/* ============================================================
   ELEMENTOS OPCIONAIS POR BANNER

   Cada banner individual pode ter — independentemente do
   modelo da loja — botão, texto, animação e contagem
   decrescente. Guardados por CHAVE R2 do banner, para
   sobreviverem a adições/remoções e reordenações.
   ============================================================ */

export const BANNER_BUTTON_POSITIONS = [
  "bottom-left",
  "bottom-right",
  "top-left",
  "top-right",
  "center",
] as const;

export type BannerButtonPosition =
  (typeof BANNER_BUTTON_POSITIONS)[number];

export const BANNER_TEXT_POSITIONS = [
  "top-left",
  "top-center",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

export type BannerTextPosition =
  (typeof BANNER_TEXT_POSITIONS)[number];

export const BANNER_ANIMATIONS = [
  "none",
  "fade",
  "zoom",
  "slide-up",
  "slide-left",
] as const;

export type BannerAnimation =
  (typeof BANNER_ANIMATIONS)[number];

export type BannerButtonFeature = {
  enabled: boolean;
  label?: string;
  /** "product" | "link" — destino do clique. */
  target?: "product" | "link";
  /** Slug do produto (target=product) ou URL (target=link). */
  destination?: string;
  position?: BannerButtonPosition;
};

export type BannerTextFeature = {
  enabled: boolean;
  text?: string;
  position?: BannerTextPosition;
};

export type BannerAnimationFeature = {
  enabled: boolean;
  type?: BannerAnimation;
};

export type BannerCountdownFeature = {
  enabled: boolean;
  /** Data/hora ISO alvo da contagem. */
  endsAt?: string;
};

/* ============================================================
   PUBLICAÇÃO POR BANNER (rascunho/publicado)

   O estado de publicação vive no mesmo mapa
   bannerFeatures, por chave R2. Ausência do registo
   OU do campo = publicado (banners antigos, sem
   estado guardado, continuam visíveis na loja).
   ============================================================ */

export type BannerFeatureSet = {
  /** false = rascunho (não aparece na loja). */
  published?: boolean;
  button?: BannerButtonFeature;
  text?: BannerTextFeature;
  animation?: BannerAnimationFeature;
  countdown?: BannerCountdownFeature;
};

/** Mapa chave R2 do banner → elementos configurados. */
export type BannerFeatureMap = Record<string, BannerFeatureSet>;

/**
 * Um banner está publicado quando não existe estado
 * guardado para ele (banners antigos) ou quando
 * published !== false.
 */
export function isBannerPublished(
  features?: BannerFeatureSet,
): boolean {
  return features?.published !== false;
}

/**
 * Novo banner adicionado: começa sempre como
 * Rascunho (só aparece na loja após Publicar).
 */
export function makeDraftBannerFeatures(): BannerFeatureSet {
  return { published: false };
}

/**
 * Animações CSS leves aplicadas ao slide ativo.
 * keyframes definidos no componente do carrossel.
 */
export const BANNER_ANIMATION_CLASSES: Record<
  BannerAnimation,
  string
> = {
  none: "",
  fade: "nova-banner-anim-fade",
  zoom: "nova-banner-anim-zoom",
  "slide-up": "nova-banner-anim-slide-up",
  "slide-left": "nova-banner-anim-slide-left",
};
