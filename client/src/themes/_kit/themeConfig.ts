/**
 * ============================================================
 * TOKENS DE TEMA — base da biblioteca partilhada (_kit)
 * ============================================================
 *
 * Cada tema novo (market, essenza, caliza, chazuca) define um
 * ThemeConfig com a sua identidade visual. A _kit consome estes
 * tokens para gerar a mesma estrutura/funcionalidade da Nova com
 * identidades visuais distintas.
 *
 * Cores chegam ao CSS via style inline no wrapper do tema
 * (ver ThemeStyleScope), como variáveis --tk-*.
 */

export type ThemeFontKey =
  | "sans" // DM Sans (padrão do app)
  | "grotesk" // Space Grotesk
  | "serif" // Playfair Display (títulos) + Inter (texto)
  | "inter"; // Inter

export interface ThemeConfig {
  /** chave usada no backend (z.enum) e no dashboard */
  key: string;
  /** nome de apresentação */
  name: string;

  /* ---------- Cores base ---------- */
  bg: string;
  surface: string;
  text: string;
  textMuted: string;

  /* ---------- Marca ---------- */
  primary: string;
  primaryContrast: string;
  accent: string;
  accentContrast: string;

  /* ---------- Bordas / raios ---------- */
  border: string;
  radius: string;

  /* ---------- Header ---------- */
  headerBg: string;
  headerText: string;

  /* ---------- Footer ---------- */
  footerBg: string;
  footerText: string;

  /* ---------- Tipografia ---------- */
  font: ThemeFontKey;

  /* ---------- Estilo dos cartões ---------- */
  cardStyle: "rounded" | "soft" | "sharp" | "pill";
}

/* ============================================================
 * MARKET — "Ideal para lojas com grande variedade de produtos."
 * Limpo, comercial, verde-esmeralda.
 * ============================================================ */
export const marketTheme: ThemeConfig = {
  key: "market",
  name: "Market",
  bg: "#f8fafb",
  surface: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  primary: "#059669",
  primaryContrast: "#ffffff",
  accent: "#f59e0b",
  accentContrast: "#1f2937",
  border: "#e2e8f0",
  radius: "0.875rem",
  headerBg: "#ffffff",
  headerText: "#0f172a",
  footerBg: "#0b3d2e",
  footerText: "#ecfdf5",
  font: "sans",
  cardStyle: "rounded",
};

/* ============================================================
 * ESSENZA — "Design minimalista, elegante e focado nos produtos."
 * Branco, preto, muito espaço, serifa nos títulos.
 * ============================================================ */
export const essenzaTheme: ThemeConfig = {
  key: "essenza",
  name: "Essenza",
  bg: "#fafafa",
  surface: "#ffffff",
  text: "#111111",
  textMuted: "#71717a",
  primary: "#111111",
  primaryContrast: "#ffffff",
  accent: "#a16207",
  accentContrast: "#ffffff",
  border: "#e4e4e7",
  radius: "0.25rem",
  headerBg: "#ffffff",
  headerText: "#111111",
  footerBg: "#111111",
  footerText: "#fafafa",
  font: "serif",
  cardStyle: "sharp",
};

/* ============================================================
 * CALIZA — "Visual sofisticado para marcas modernas e criativas."
 * Pedra/calcário, terracota, serifa elegante.
 * ============================================================ */
export const calizaTheme: ThemeConfig = {
  key: "caliza",
  name: "Caliza",
  bg: "#f5f1ea",
  surface: "#fffdf9",
  text: "#292524",
  textMuted: "#78716c",
  primary: "#c2410c",
  primaryContrast: "#fffdf9",
  accent: "#0f766e",
  accentContrast: "#ffffff",
  border: "#e0d8cc",
  radius: "0.5rem",
  headerBg: "#f5f1ea",
  headerText: "#292524",
  footerBg: "#292524",
  footerText: "#f5f1ea",
  font: "serif",
  cardStyle: "soft",
};

/* ============================================================
 * CHAZUCA — "Um tema criativo, forte e versátil."
 * Roxo vibrante, contraste alto, cantos marcados.
 * ============================================================ */
export const chazucaTheme: ThemeConfig = {
  key: "chazuca",
  name: "Chazuca",
  bg: "#faf5ff",
  surface: "#ffffff",
  text: "#1e1b4b",
  textMuted: "#6d28d9",
  primary: "#7c3aed",
  primaryContrast: "#ffffff",
  accent: "#ec4899",
  accentContrast: "#ffffff",
  border: "#e9d5ff",
  radius: "1rem",
  headerBg: "#4c1d95",
  headerText: "#f5f3ff",
  footerBg: "#1e1b4b",
  footerText: "#ede9fe",
  font: "grotesk",
  cardStyle: "pill",
};

export const kitThemes: Record<string, ThemeConfig> = {
  market: marketTheme,
  essenza: essenzaTheme,
  caliza: calizaTheme,
  chazuca: chazucaTheme,
};

/* ============================================================
 * FONTES GOOGLE POR TEMA
 * ============================================================ */
export const themeFontImport: Record<ThemeFontKey, string> = {
  sans: "",
  grotesk:
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap",
  serif:
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap",
  inter:
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
};

/** família para títulos (serif → Playfair, grotesk → Space Grotesk) */
export function headingFontFamily(font: ThemeFontKey): string {
  if (font === "serif") return "'Playfair Display', Georgia, serif";
  if (font === "grotesk") return "'Space Grotesk', system-ui, sans-serif";
  return "'DM Sans', system-ui, sans-serif";
}

/** família para texto corrido */
export function bodyFontFamily(font: ThemeFontKey): string {
  if (font === "serif") return "'Inter', system-ui, sans-serif";
  if (font === "grotesk") return "'Space Grotesk', system-ui, sans-serif";
  return "'DM Sans', system-ui, sans-serif";
}

/** raio de canto por estilo de cartão */
export function cardRadius(style: ThemeConfig["cardStyle"]): string {
  switch (style) {
    case "sharp":
      return "2px";
    case "pill":
      return "1.25rem";
    case "soft":
      return "0.75rem";
    default:
      return "0.875rem";
  }
}

/* ============================================================
 * TOKENS CSS — injetados como style inline no root do tema
 * ============================================================ */
export function themeCssVars(t: ThemeConfig): Record<string, string> {
  return {
    "--tk-bg": t.bg,
    "--tk-surface": t.surface,
    "--tk-text": t.text,
    "--tk-muted": t.textMuted,
    "--tk-primary": t.primary,
    "--tk-primary-contrast": t.primaryContrast,
    "--tk-accent": t.accent,
    "--tk-accent-contrast": t.accentContrast,
    "--tk-border": t.border,
    "--tk-radius": t.radius,
    "--tk-header-bg": t.headerBg,
    "--tk-header-text": t.headerText,
    "--tk-footer-bg": t.footerBg,
    "--tk-footer-text": t.footerText,
    "--tk-card-radius": cardRadius(t.cardStyle),
    "--tk-font-body": bodyFontFamily(t.font),
    "--tk-font-heading": headingFontFamily(t.font),
  };
}
