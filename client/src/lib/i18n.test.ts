/*
 * Guarda do i18n do storefront público.
 *
 * Estas garantias evitam as duas falhas que este módulo existe
 * para impedir:
 *  - uma loja com idioma inválido na base de dados ficar SEM
 *    catálogo (normalização cai sempre para "pt");
 *  - uma chave ficar por traduzir e aparecer crua na loja
 *    (paridade PT/EN verificada aqui, além do tipo
 *    Record<TranslationKey, string> no tsc).
 */
import { describe, expect, it } from "vitest";

import {
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
  TRANSLATION_KEYS,
  formatAmount,
  formatMoney,
  normalizeCurrency,
  normalizeLanguage,
  translate,
} from "./i18n";
import type { Language } from "./i18n";

describe("normalizeLanguage", () => {
  it("aceita os idiomas suportados, com caixa e espaços irrelevantes", () => {
    expect(normalizeLanguage("pt")).toBe("pt");
    expect(normalizeLanguage("en")).toBe("en");
    expect(normalizeLanguage("PT")).toBe("pt");
    expect(normalizeLanguage("  EN  ")).toBe("en");
  });

  it("cai para o predefinido em valores ausentes ou desconhecidos", () => {
    for (const value of [undefined, null, "", "   ", "fr", "pt-BR", "0"]) {
      expect(normalizeLanguage(value)).toBe(DEFAULT_LANGUAGE);
    }
  });

  it("nunca devolve nada fora da lista suportada", () => {
    for (const value of ["", "de", "PT-PT", "xx", "en "]) {
      expect(SUPPORTED_LANGUAGES).toContain(normalizeLanguage(value));
    }
  });
});

describe("normalizeCurrency", () => {
  it("aceita as moedas suportadas, com caixa e espaços irrelevantes", () => {
    expect(normalizeCurrency("MZN")).toBe("MZN");
    expect(normalizeCurrency("mzn")).toBe("MZN");
    expect(normalizeCurrency(" zar ")).toBe("ZAR");
    expect(normalizeCurrency("usd")).toBe("USD");
  });

  it("cai para o predefinido em valores ausentes ou desconhecidos", () => {
    for (const value of [undefined, null, "", "BRL", "EUR", "MT"]) {
      expect(normalizeCurrency(value)).toBe(DEFAULT_CURRENCY);
    }
  });

  it("nunca devolve nada fora da lista suportada", () => {
    for (const value of ["", "brl", "eur", "mtn"]) {
      expect(SUPPORTED_CURRENCIES).toContain(normalizeCurrency(value));
    }
  });
});

describe("catálogo de traduções", () => {
  it("o EN cobre todas as chaves do PT e nenhuma está vazia", () => {
    for (const key of TRANSLATION_KEYS) {
      const translated = translate("en", key);

      expect(translated.trim().length).toBeGreaterThan(0);

      /* Uma chave em falta devolveria a própria chave. */
      expect(translated).not.toBe(key);
    }
  });

  it("o PT devolve o texto que a loja já mostra hoje", () => {
    expect(translate("pt", "nav.cart")).toBe("Carrinho");
    expect(translate("pt", "cart.checkout")).toBe("Finalizar compra");
    expect(translate("pt", "checkout.backToStore")).toBe("Voltar para loja");
  });

  it("o EN traduz de facto (não repete o PT) nas chaves de interface", () => {
    expect(translate("en", "nav.cart")).toBe("Cart");
    expect(translate("en", "cart.checkout")).toBe("Checkout");
    expect(translate("en", "cart.empty")).toBe("Your cart is empty");
  });

  it("um idioma desconhecido usa o catálogo PT em vez de falhar", () => {
    for (const language of ["fr", "", "xx-YY"]) {
      expect(translate(language, "nav.cart")).toBe(translate("pt", "nav.cart"));
    }
  });

  it("interpola variáveis {nome} e preserva marcadores sem valor", () => {
    const key = TRANSLATION_KEYS[0];

    expect(translate("pt", key, { nome: "Ana" })).toBe(translate("pt", key));
    expect(translate("en", key, { inexistente: 1 })).toBe(translate("en", key));
  });

  it("cada idioma suportado tem um catálogo utilizável", () => {
    for (const language of SUPPORTED_LANGUAGES) {
      for (const key of TRANSLATION_KEYS) {
        expect(translate(language as Language, key).length).toBeGreaterThan(0);
      }
    }
  });
});

describe("formatação de preços", () => {
  it("agrupa milhares de forma determinística por idioma", () => {
    expect(formatAmount(1250, "pt")).toBe("1.250");
    expect(formatAmount(1250, "en")).toBe("1,250");
    expect(formatAmount(1234567, "pt")).toBe("1.234.567");
    expect(formatAmount(1234567, "en")).toBe("1,234,567");
  });

  it("não inventa casas decimais em preços inteiros", () => {
    expect(formatAmount(999, "pt")).toBe("999");
    expect(formatAmount(0, "pt")).toBe("0");
  });

  it("trata valores ausentes como zero", () => {
    expect(formatAmount(null, "pt")).toBe("0");
    expect(formatAmount(undefined, "en")).toBe("0");
  });

  it("junta o código da moeda da loja", () => {
    expect(formatMoney(1250, "MZN", "pt")).toBe("1.250 MZN");
    expect(formatMoney(1250, "USD", "en")).toBe("1,250 USD");
  });

  it("normaliza a moeda desconhecida na formatação", () => {
    expect(formatMoney(100, "BRL", "pt")).toBe("100 MZN");
    expect(formatMoney(100, null, "pt")).toBe("100 MZN");
  });
});
