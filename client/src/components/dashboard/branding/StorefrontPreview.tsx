import NovaStorefront, {
  type NovaStorefrontOverrides,
} from "@/themes/nova/Storefront";

export type StorePreviewDevice = "desktop" | "mobile";

/*
 * ============================================================
 * PRÉ-VISUALIZAÇÃO DA LOJA (Personalizar Loja)
 * ============================================================
 * Renderiza a storefront REAL do HOMSTEG — o mesmo tema Nova
 * e exatamente os mesmos componentes da loja pública — dentro
 * de uma moldura de dispositivo (desktop/mobile).
 *
 * Modo PC (proporção 16:10):
 *   viewport simulado de 1536×960, à escala (usando transform
 *   com scaleX puro: a altura do conteúdo cresce
 *   proporcionalmente, por isso nenhum layout anda).
 *   Largura efetiva do conteúdo: 1024px de viewport real
 *   para não esmagar as grelhas; a moldura exterior mostra a
 *   proporção do ecrã.
 *
 * Modo Telefone (moldura completa):
 *   moldura escurecida com status bar (hora, sinal, wifi,
 *   bateria), notch + píldora e viewport de 390×844 lockup
 *   (largura lógica de iPhone). Conteúdo a 370px de largura.
 *
 * Os overrides permitem que alterações ainda não publicadas
 * (modelos escolhidos, logo/banner acabados de carregar,
 * elementos de banner por guardar) apareçam imediatamente na
 * pré-visualização, antes de o servidor confirmar.
 *
 * `contain: paint` torna a área com scroll o contentor dos
 * elementos `position: fixed` da storefront (barra de
 * navegação inferior, cabeçalho), em vez da janela do painel.
 * ============================================================
 */

/**
 * Viewport de referência do dispositivo, em px lógicos.
 * desktop = ecrã comum 16:10; mobile = iPhone lógico 390×844.
 */
const PREVIEW_VIEWPORT = {
  desktop: { width: 1536, height: 960 },
  mobile: { width: 390, height: 844 },
} as const;

/**
 * Largura real (px) da área com scroll. Em desktop a loja
 * renderiza a 1024px (não esmaga grelhas de 4+ colunas); no
 * telemóvel, a 370px, à largura útil dentro da moldura.
 *
 * A escala de apresentação (transform) ajusta a altura da
 * moldura, nunca a largura do conteúdo: por isso o layout da
 * storefront é sempre idêntico ao real.
 */
const CONTENT_WIDTH = {
  desktop: 1024,
  mobile: 370,
} as const;

/**
 * Altura da área com scroll (px): a largura do conteúdo × a
 * proporção do dispositivo. Com o transform scaleX, o
 * conteúdo é pintado a essa mesma escala, pelo que a parte
 * visível corresponde exatamente ao viewport de referência.
 */
function getScrollAreaHeight(device: StorePreviewDevice) {
  const viewport = PREVIEW_VIEWPORT[device];

  return Math.round(
    (CONTENT_WIDTH[device] * viewport.height) / viewport.width,
  );
}

export default function StorefrontPreview({
  storeId,
  device,
  overrides,
}: {
  storeId: string;
  device: StorePreviewDevice;
  overrides?: NovaStorefrontOverrides;
}) {
  const isMobile = device === "mobile";

  const contentWidth = CONTENT_WIDTH[device];
  const scrollAreaHeight = getScrollAreaHeight(device);

  /*
   * Escala horizontal de apresentação: o conteúdo é desenhado
   * à largura `contentWidth` dentro da moldura (que ocupa o
   * espaço disponível) e depois estreita até caber.
   */
  const frameWidth = isMobile ? contentWidth + 20 : contentWidth;

  return (
    <div className={isMobile ? "mx-auto w-full max-w-[390px]" : "w-full"}>
      <div
        className={
          isMobile
            ? "overflow-hidden rounded-[2.25rem] border-[10px] border-[#111713] bg-[#111713] shadow-xl"
            : "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        }
        style={{ width: frameWidth }}
      >
        {/* Barra de janela (apenas desktop) */}
        {!isMobile && (
          <div
            className="flex items-center gap-2 border-b border-gray-200 bg-[#f7f8f5] px-3"
            style={{ height: 36 }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />

            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />

            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

            <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-gray-400">
              Pré-visualização da loja
            </span>
          </div>
        )}

        {/* Status bar + notch (apenas telemóvel) */}
        {isMobile && (
          <div className="relative">
            <div className="flex h-7 items-center justify-between bg-[#111713] px-4 text-[10px] font-semibold text-white">
              <span>9:41</span>

              <span className="flex items-center gap-1">
                {/* Sinal */}
                <svg viewBox="0 0 16 12" className="h-2.5 w-3 fill-current">
                  <rect x="0" y="8" width="3" height="4" rx="0.5" />
                  <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
                  <rect x="9" y="3" width="3" height="9" rx="0.5" />
                  <rect x="13" y="0.5" width="3" height="11.5" rx="0.5" />
                </svg>

                {/* Wi-Fi */}
                <svg viewBox="0 0 16 12" className="h-2.5 w-3 fill-current">
                  <path d="M8 10.5a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z" />
                  <path d="M8 6.8c1.4 0 2.7.55 3.65 1.45l1.05-1.05A6.65 6.65 0 0 0 8 5.3a6.65 6.65 0 0 0-4.7 1.9l1.05 1.05A5.15 5.15 0 0 1 8 6.8Z" />
                  <path d="M8 1.5c2.9 0 5.55 1.2 7.4 3.15L16.5 3.5A9.6 9.6 0 0 0 8 0a9.6 9.6 0 0 0-8.5 3.5l1.1 1.15A10.1 10.1 0 0 1 8 1.5Z" />
                </svg>

                {/* Bateria */}
                <svg viewBox="0 0 25 12" className="h-2.5 w-4 fill-current">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="21"
                    height="11"
                    rx="3"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.5"
                  />
                  <rect x="2" y="2" width="16" height="8" rx="2" />
                  <path d="M23 4v4c1-.3 1.7-1 1.7-2S24 4.3 23 4Z" />
                </svg>
              </span>
            </div>

            {/* Notch / Dynamic Island */}
            <div className="pointer-events-none absolute left-1/2 top-1.5 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
          </div>
        )}

        <div
          className="relative overflow-y-auto overflow-x-hidden overscroll-contain bg-slate-50"
          style={{
            height: scrollAreaHeight,
            width: contentWidth,
            contain: "paint",
          }}
          onClickCapture={(event) => {
            /*
             * Na pré-visualização os links da storefront não
             * podem navegar o painel; o clique é absorvido e a
             * página fica sempre na Personalizar Loja.
             */
            const target = event.target as HTMLElement;

            if (target.closest("a")) {
              event.preventDefault();
            }
          }}
          onSubmitCapture={(event) => {
            /*
             * A pesquisa do cabeçalho navega por código
             * (wouter); na pré-visualização a submissão é
             * absorvida para não sair do painel.
             */
            event.preventDefault();
          }}
        >
          <NovaStorefront
            mode="store"
            storeId={storeId}
            preview
            headerVariant={isMobile ? "mobile" : "desktop"}
            overrides={overrides}
          />
        </div>

        {/* Barra/gesto inferior (apenas telemóvel) */}
        {isMobile && (
          <div className="flex h-6 items-center justify-center bg-[#111713]">
            <span className="h-1 w-28 rounded-full bg-white/60" />
          </div>
        )}
      </div>
    </div>
  );
}
