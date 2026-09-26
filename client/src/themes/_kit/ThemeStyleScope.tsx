/**
 * ============================================================
 * THEME STYLE SCOPE
 * ============================================================
 *
 * Injeta as variáveis CSS (--tk-*) do tema ativo e a fonte
 * Google correspondente. Envolvido por todas as páginas de um
 * tema para que a _kit inteira herde a identidade visual.
 */

import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  themeCssVars,
  themeFontImport,
  type ThemeConfig,
} from "./themeConfig";

interface ThemeStyleScopeProps {
  theme: ThemeConfig;
  children: ReactNode;
}

export function ThemeStyleScope({
  theme,
  children,
}: ThemeStyleScopeProps) {
  const href = themeFontImport[theme.font];

  useEffect(() => {
    if (!href) return;

    const id = `tk-font-${theme.key}`;
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, [href, theme.key]);

  const style = themeCssVars(theme) as unknown as CSSProperties;
  return (
    <div
      data-theme={theme.key}
      style={style}
      className="tk-root min-h-screen"
    >
      <style>{`
        .tk-root {
          background: var(--tk-bg);
          color: var(--tk-text);
          font-family: var(--tk-font-body);
        }
        .tk-root h1, .tk-root h2, .tk-root h3 {
          font-family: var(--tk-font-heading);
        }
      `}</style>
      {children}
    </div>
  );
}

export default ThemeStyleScope;
