/*
 * Guarda da INDEPENDÊNCIA entre o idioma do painel e o da loja.
 *
 * Estas garantias cobrem exatamente o requisito:
 *   Loja: Português / Painel: English  ✅
 *   Loja: English   / Painel: Português ✅
 * — trocar uma preferência nunca altera a outra.
 *
 * O ambiente dos testes é "node" (vitest.config.ts), por isso
 * o window.localStorage é registado à mão no início do ficheiro.
 */
import { describe, expect, it } from "vitest";

import {
  DEFAULT_PANEL_LANGUAGE,
  PANEL_LANGUAGE_STORAGE_KEY,
  PANEL_TRANSLATION_KEYS,
  normalizePanelLanguage,
  panelTranslate,
  readPanelLanguage,
  writePanelLanguage,
} from "./panel-i18n";
import type { PanelLanguage } from "./panel-i18n";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  TRANSLATION_KEYS,
  normalizeLanguage,
  translate,
} from "./i18n";

/* localStorage falso (o módulo só precisa de get/setItem). */
const storage = new Map<string, string>();

(globalThis as { window?: unknown }).window = {
  localStorage: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
  },
};

describe("catálogo do painel", () => {
  it("o EN cobre todas as chaves do PT e nenhuma está vazia", () => {
    for (const key of PANEL_TRANSLATION_KEYS) {
      const translated = panelTranslate("en", key);

      expect(translated.trim().length).toBeGreaterThan(0);

      /* Uma chave em falta devolveria a própria chave. */
      expect(translated).not.toBe(key);
    }
  });

  it("o PT devolve os textos reais do painel", () => {
    expect(panelTranslate("pt", "nav.settings")).toBe(
      "Configurações"
    );
    expect(panelTranslate("pt", "set.sec.language")).toBe(
      "Idioma e moeda"
    );
    expect(panelTranslate("pt", "set.sec.panelLanguage")).toBe(
      "Idioma do painel"
    );
  });

  it("o EN traduz de facto as secções de idioma", () => {
    expect(panelTranslate("en", "nav.settings")).toBe(
      "Settings"
    );
    expect(panelTranslate("en", "set.sec.language")).toBe(
      "Language & currency"
    );
    expect(panelTranslate("en", "set.sec.panelLanguage")).toBe(
      "Panel language"
    );
  });
});

describe("normalizePanelLanguage", () => {
  it("aceita pt/en com caixa e espaços irrelevantes", () => {
    expect(normalizePanelLanguage("pt")).toBe("pt");
    expect(normalizePanelLanguage("EN")).toBe("en");
    expect(normalizePanelLanguage("  En  ")).toBe("en");
  });

  it("cai para o predefinido em valores desconhecidos", () => {
    for (const value of [undefined, null, "", "fr", "pt-BR"]) {
      expect(normalizePanelLanguage(value)).toBe(
        DEFAULT_PANEL_LANGUAGE
      );
    }
  });
});

describe("persistência do painel", () => {
  it("grava e lê a preferência na chave própria do painel", () => {
    storage.clear();

    expect(writePanelLanguage("en")).toBe("en");

    expect(
      storage.has(PANEL_LANGUAGE_STORAGE_KEY)
    ).toBe(true);

    expect(readPanelLanguage()).toBe("en");

    expect(writePanelLanguage("pt")).toBe("pt");

    expect(readPanelLanguage()).toBe("pt");
  });
});

describe("loja e painel são independentes", () => {
  it("os dois catálogos não partilham chaves nem armazenamento", () => {
    /* O painel guarda em localStorage; a loja guarda em
     * stores.language (base de dados). Nenhuma sobreposição. */
    expect(PANEL_LANGUAGE_STORAGE_KEY).not.toBe("language");

    expect(TRANSLATION_KEYS).not.toContain(
      "set.sec.panelLanguage" as never
    );

    expect(PANEL_TRANSLATION_KEYS).not.toContain(
      "nav.cart" as never
    );
  });

  it("combinar loja=pt/painel=en e loja=en/painel=pt resolve os dois textos", () => {
    const combos: {
      store: (typeof SUPPORTED_LANGUAGES)[number];
      panel: PanelLanguage;
    }[] = [
      { store: "pt", panel: "en" },
      { store: "en", panel: "pt" },
    ];

    for (const combo of combos) {
      /* Texto da loja segue SEMPRE o idioma da loja. */
      expect(translate(combo.store, "nav.cart")).toBe(
        combo.store === "pt" ? "Carrinho" : "Cart"
      );

      /* Texto do painel segue SEMPRE o idioma do painel. */
      expect(panelTranslate(combo.panel, "nav.settings")).toBe(
        combo.panel === "pt" ? "Configurações" : "Settings"
      );
    }
  });

  it("gravar o idioma do painel não muda o idioma predefinido da loja", () => {
    writePanelLanguage("en");

    expect(normalizeLanguage(undefined)).toBe(DEFAULT_LANGUAGE);

    expect(translate(undefined, "nav.cart")).toBe("Carrinho");

    writePanelLanguage("pt");

    expect(normalizeLanguage("xx")).toBe(DEFAULT_LANGUAGE);
  });
});
