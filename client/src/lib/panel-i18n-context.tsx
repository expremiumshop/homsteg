/*
 * Ligação do i18n do PAINEL ao React.
 *
 * Módulo puro em client/src/lib/panel-i18n.ts. Aqui apenas se
 * lê/grava a preferência do dispositivo e se expõe `t` +
 * `setLanguage` às componentes do /app.
 *
 * NÃO partilha estado com o i18n da loja
 * (client/src/lib/i18n-context.tsx): idiomas diferentes para
 * painel e loja são esperados, não um erro.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_PANEL_LANGUAGE,
  normalizePanelLanguage,
  panelTranslate,
  readPanelLanguage,
  writePanelLanguage,
  type PanelLanguage,
  type PanelTranslationKey,
} from "./panel-i18n";

export type PanelI18nValue = {
  /** Idioma efetivo do painel, já normalizado. */
  language: PanelLanguage;

  /** Altera o idioma do painel e guarda-o neste dispositivo. */
  setLanguage: (value: PanelLanguage | string) => void;

  /** Traduz uma chave do catálogo do painel. */
  t: (
    key: PanelTranslationKey,
    vars?: Record<string, string | number>
  ) => string;
};

const PanelI18nContext = createContext<PanelI18nValue>({
  language: DEFAULT_PANEL_LANGUAGE,

  setLanguage: () => undefined,

  t: key => panelTranslate(DEFAULT_PANEL_LANGUAGE, key),
});

export function PanelI18nProvider({
  children,
}: {
  children: ReactNode;
}) {
  /*
   * Estado inicial lido UMA vez do localStorage; as alterações
   * posteriores ficam em memória + persistência. O provider só
   * existe na árvore do painel, por isso a loja pública nunca
   * é afetada.
   */
  const [language, setLanguageState] = useState<PanelLanguage>(
    () => readPanelLanguage()
  );

  const setLanguage = useCallback(
    (value: PanelLanguage | string) => {
      setLanguageState(writePanelLanguage(value));
    },
    []
  );

  const value = useMemo<PanelI18nValue>(
    () => ({
      language,
      setLanguage,
      t: (key, vars) => panelTranslate(language, key, vars),
    }),
    [language, setLanguage]
  );

  return (
    <PanelI18nContext.Provider value={value}>
      {children}
    </PanelI18nContext.Provider>
  );
}

export function usePanelI18n(): PanelI18nValue {
  return useContext(PanelI18nContext);
}

/** Alias legível para os sites que só precisam de traduzir. */
export function usePanelT(): PanelI18nValue["t"] {
  return usePanelI18n().t;
}

export { normalizePanelLanguage };
export type { PanelLanguage, PanelTranslationKey };
