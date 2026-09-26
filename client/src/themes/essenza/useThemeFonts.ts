import { useEffect } from "react";

/**
 * ============================================================
 * FONTES DO TEMA ESSENZA
 * ============================================================
 *
 * A Essenza usa Playfair Display (títulos serifados) e Inter
 * (texto corrido). O app carrega globalmente apenas DM Sans e
 * Space Grotesk, por isso este hook injeta a folha de estilo
 * do Google Fonts uma única vez (protegido por id no <head>),
 * espelhando o comportamento do antigo ThemeStyleScope da _kit.
 *
 * Deve ser chamado no Storefront e em cada página autónoma do
 * tema (produto, carrinho, checkout, mensagens e conta), para
 * que a fonte esteja presente em qualquer rota direta.
 */

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap";

const LINK_ID = "essenza-theme-fonts";

export function useThemeFonts() {
  useEffect(() => {
    if (document.getElementById(LINK_ID)) {
      return;
    }

    const link = document.createElement("link");

    link.id = LINK_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;

    document.head.appendChild(link);
  }, []);
}

export default useThemeFonts;
