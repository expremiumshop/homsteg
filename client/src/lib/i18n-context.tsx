/*
 * Ligação do i18n ao React (storefront público).
 *
 * O módulo puro está em client/src/lib/i18n.ts; aqui apenas se
 * injeta o idioma/moeda da loja e se expõem `t` e `formatMoney`
 * às componentes.
 *
 * O valor predefinido é pt/MZN: uma componente do tema usada
 * fora do storefront real (previews em /themes/*, testes,
 * Storybook) continua a funcionar e mostra português, em vez de
 * rebentar por falta de provider.
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";

import {
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  formatMoney as formatMoneyValue,
  normalizeCurrency,
  normalizeLanguage,
  translate,
  type Currency,
  type Language,
  type TranslationKey,
} from "./i18n";

export type I18nValue = {
  /** Idioma efetivo da loja, já normalizado. */
  language: Language;

  /** Moeda efetiva da loja, já normalizada. */
  currency: Currency;

  /** Traduz uma chave do catálogo. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;

  /** Preço formatado com a moeda da loja, ex.: "1.250 MZN". */
  formatMoney: (value: number | null | undefined) => string;
};

const I18nContext = createContext<I18nValue>({
  language: DEFAULT_LANGUAGE,
  currency: DEFAULT_CURRENCY,

  t: key => translate(DEFAULT_LANGUAGE, key),

  formatMoney: value =>
    formatMoneyValue(value, DEFAULT_CURRENCY, DEFAULT_LANGUAGE),
});

export function I18nProvider({
  language,
  currency,
  children,
}: {
  language?: string | null;
  currency?: string | null;
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(() => {
    const normalizedLanguage = normalizeLanguage(language);

    const normalizedCurrency = normalizeCurrency(currency);

    return {
      language: normalizedLanguage,
      currency: normalizedCurrency,

      t: (key, vars) => translate(normalizedLanguage, key, vars),

      formatMoney: value =>
        formatMoneyValue(value, normalizedCurrency, normalizedLanguage),
    };
  }, [language, currency]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
