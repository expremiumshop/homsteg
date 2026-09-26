import { useEffect } from "react";

/**
 * ============================================================
 * FONTES DO TEMA CHAZUCA
 * ============================================================
 *
 * A Chazuca usa Space Grotesk em títulos e texto corrido.
 * O app carrega globalmente apenas DM Sans e Space Grotesk,
 * mas este hook garante a folha de estilo do Google Fonts em
 * qualquer rota direta do tema (protegido por id no <head>),
 * seguindo o mesmo padrão da Caliza e da Essenza.
 *
 * Deve ser chamado no Storefront e em cada página autónoma do
 * tema (produto, carrinho, checkout, mensagens e conta).
 */

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap";

const LINK_ID = "chazuca-theme-fonts";

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
