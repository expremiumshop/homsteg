import { describe, expect, it } from "vitest";

import {
  MAX_VARIANT_ROWS,
  buildVariantPayload,
  buildVariantRows,
  validateVariantDetails,
  variantDetailsFromStored,
  variantSignature,
} from "./variantMatrix";

const sizeOption = { name: "Tamanho", values: ["S", "M"] };
const colorOption = { name: "Cor", values: ["Preto", "Branco"] };

describe("HOMSTEG — matriz de variantes", () => {
  it("gera o produto cartesiano das opções válidas", () => {
    const { rows, truncated } = buildVariantRows([sizeOption, colorOption]);

    expect(truncated).toBe(false);
    expect(rows).toHaveLength(4);
    expect(rows.map(row => row.label)).toContain("Tamanho: M · Cor: Preto");
    expect(
      rows.find(row => row.signature === variantSignature({
        Tamanho: "M",
        Cor: "Preto",
      }))?.values,
    ).toEqual({ Tamanho: "M", Cor: "Preto" });
  });

  it("ignora opções sem nome ou sem valores", () => {
    const { rows } = buildVariantRows([
      { name: "", values: ["X"] },
      { name: "Tamanho", values: ["", "  ", "M"] },
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0].values).toEqual({ Tamanho: "M" });
  });

  it("sem opções não há variantes", () => {
    expect(buildVariantRows([]).rows).toEqual([]);
  });

  it("limita a matriz a MAX_VARIANT_ROWS e sinaliza truncamento", () => {
    const big = {
      name: "Tam",
      values: Array.from({ length: 15 }, (_, i) => `v${i}`),
    };

    const { rows, truncated } = buildVariantRows([big, big]);

    expect(truncated).toBe(true);
    expect(rows).toHaveLength(MAX_VARIANT_ROWS);
  });

  it("a assinatura é estável independentemente da ordem", () => {
    expect(variantSignature({ A: "1", B: "2" })).toBe(
      variantSignature({ B: "2", A: "1" }),
    );
  });
});

describe("HOMSTEG — recuperação dos detalhes guardados", () => {
  it("mapeia price/stock/sku para a assinatura da combinação", () => {
    const details = variantDetailsFromStored([
      {
        values: { Tamanho: "M", Cor: "Preto" },
        priceMzn: 1800,
        stock: 5,
        sku: "CAM-M-PRE",
      },
    ]);

    expect(
      details[variantSignature({ Tamanho: "M", Cor: "Preto" })],
    ).toEqual({ price: "1800", stock: "5", sku: "CAM-M-PRE" });
  });

  it("campos nulos viram texto vazio (herda do produto)", () => {
    const details = variantDetailsFromStored([
      { values: { Tamanho: "S" }, priceMzn: null, stock: null, sku: null },
    ]);

    expect(details[variantSignature({ Tamanho: "S" })]).toEqual({
      price: "",
      stock: "",
      sku: "",
    });
  });

  it("sem variantes guardadas devolve mapa vazio", () => {
    expect(variantDetailsFromStored(null)).toEqual({});
    expect(variantDetailsFromStored(undefined)).toEqual({});
  });
});

describe("HOMSTEG — validação e payload de variantes", () => {
  const rows = buildVariantRows([sizeOption]).rows;

  it("aceita detalhes vazios e números válidos", () => {
    expect(
      validateVariantDetails(rows, {
        [rows[0].signature]: { price: "1500", stock: "3", sku: "X" },
      }),
    ).toBeNull();

    expect(validateVariantDetails(rows, {})).toBeNull();
  });

  it("rejeita preço ou stock negativos/não numéricos", () => {
    expect(
      validateVariantDetails(rows, {
        [rows[0].signature]: { price: "-1", stock: "", sku: "" },
      }),
    ).toMatch(/Preço inválido/);

    expect(
      validateVariantDetails(rows, {
        [rows[1].signature]: { price: "", stock: "abc", sku: "" },
      }),
    ).toMatch(/Stock inválido/);
  });

  it("rejeita SKU com mais de 80 caracteres", () => {
    expect(
      validateVariantDetails(rows, {
        [rows[0].signature]: { price: "", stock: "", sku: "x".repeat(81) },
      }),
    ).toMatch(/SKU demasiado longo/);
  });

  it("só envia combinações com pelo menos um valor próprio", () => {
    const payload = buildVariantPayload(rows, {
      [rows[0].signature]: { price: "1800", stock: "", sku: "" },
      [rows[1].signature]: { price: "", stock: "", sku: "" },
    });

    expect(payload).toHaveLength(1);
    expect(payload[0]).toEqual({
      values: rows[0].values,
      priceMzn: 1800,
      stock: null,
      sku: null,
    });
  });

  it("arredonda preço/stock e mantém SKU vazio como null", () => {
    const payload = buildVariantPayload(rows, {
      [rows[0].signature]: { price: "1500.6", stock: "2.4", sku: "  ABC  " },
    });

    expect(payload[0].priceMzn).toBe(1501);
    expect(payload[0].stock).toBe(2);
    expect(payload[0].sku).toBe("ABC");
  });

  it("sem detalhes preenchidos o payload fica vazio", () => {
    expect(buildVariantPayload(rows, {})).toEqual([]);
  });
});
