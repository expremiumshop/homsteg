import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { products } from "../drizzle/schema";
import {
  PRODUCT_VARIANTS_MAX,
  alignProductVariants,
  productCreateInput,
  productUpdateInput,
} from "./routers";

const projectRoot = path.resolve(import.meta.dirname, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(projectRoot, relativePath), "utf8");
}

/** Colapsa espaços/quebras de linha num único espaço. */
function normalizeSource(source: string): string {
  return source.replace(/\s+/g, " ");
}

/** Payload mínimo e válido para criar um produto. */
const validCreatePayload = {
  storeId: "store-a",
  name: "Camiseta",
  slug: "camiseta-12345678",
  priceMzn: 1500,
  stock: 10,
};

const sizeOption = { name: "Tamanho", values: ["S", "M", "L"] };
const colorOption = { name: "Cor", values: ["Preto", "Branco"] };

const validVariants = [
  {
    values: { Tamanho: "M", Cor: "Preto" },
    priceMzn: 1800,
    stock: 5,
    sku: "CAM-M-PRE",
  },
  {
    values: { Tamanho: "S", Cor: "Branco" },
    priceMzn: null,
    stock: null,
    sku: null,
  },
];

/* ============================================================
   CONTRATO ZOD — variantes com preço/stock/SKU próprios
   ============================================================ */

describe("HOMSTEG — contrato de variantes (preço/stock/SKU)", () => {
  it("a criação arranca sem variantes (default vazio)", () => {
    const parsed = productCreateInput.parse({ ...validCreatePayload });

    expect(parsed.variants).toEqual([]);
  });

  it("persiste preço, stock e SKU por variante na criação", () => {
    const parsed = productCreateInput.parse({
      ...validCreatePayload,
      options: [sizeOption, colorOption],
      variants: validVariants,
    });

    expect(parsed.variants).toEqual(validVariants);
    expect(parsed.variants[0].priceMzn).toBe(1800);
    expect(parsed.variants[0].stock).toBe(5);
    expect(parsed.variants[0].sku).toBe("CAM-M-PRE");
  });

  it("persiste preço, stock e SKU por variante na edição", () => {
    const parsed = productUpdateInput.parse({
      storeId: "store-a",
      productId: 1,
      options: [sizeOption],
      variants: [
        { values: { Tamanho: "M" }, priceMzn: 2000, stock: 3, sku: "CAM-M" },
      ],
    });

    expect(parsed.variants).toHaveLength(1);
    expect(parsed.variants?.[0].priceMzn).toBe(2000);
    expect(parsed.variants?.[0].stock).toBe(3);
    expect(parsed.variants?.[0].sku).toBe("CAM-M");
  });

  it("recusa preço ou stock de variante negativos ou não inteiros", () => {
    expect(
      productCreateInput.safeParse({
        ...validCreatePayload,
        options: [sizeOption],
        variants: [{ values: { Tamanho: "M" }, priceMzn: -1 }],
      }).success,
    ).toBe(false);

    expect(
      productCreateInput.safeParse({
        ...validCreatePayload,
        options: [sizeOption],
        variants: [{ values: { Tamanho: "M" }, stock: 2.5 }],
      }).success,
    ).toBe(false);
  });

  it("recusa uma variante sem valores de opção", () => {
    expect(
      productCreateInput.safeParse({
        ...validCreatePayload,
        options: [sizeOption],
        variants: [{ values: {} }],
      }).success,
    ).toBe(false);

    expect(
      productCreateInput.safeParse({
        ...validCreatePayload,
        options: [sizeOption],
        variants: [{ values: { "": "M" } }],
      }).success,
    ).toBe(false);
  });

  it(`recusa mais de ${PRODUCT_VARIANTS_MAX} variantes`, () => {
    const tooMany = Array.from({ length: PRODUCT_VARIANTS_MAX + 1 }, (_, i) => ({
      values: { Tamanho: `v${i}` },
    }));

    expect(
      productCreateInput.safeParse({
        ...validCreatePayload,
        options: [{ name: "Tamanho", values: tooMany.map(v => v.values.Tamanho) }],
        variants: tooMany,
      }).success,
    ).toBe(false);
  });
});

/* ============================================================
   ALINHAMENTO AO SERVIDOR — variantes vs opções do produto
   ============================================================ */

describe("HOMSTEG — alignProductVariants (fonte de verdade no servidor)", () => {
  it("mantém as combinações válidas", () => {
    const aligned = alignProductVariants(
      [sizeOption, colorOption],
      validVariants,
    );

    expect(aligned).toEqual(validVariants);
  });

  it("descarta combinações órfãs (opção renomeada)", () => {
    const aligned = alignProductVariants(
      [{ name: "Talla", values: ["S", "M"] }],
      [{ values: { Tamanho: "M" }, priceMzn: 1000 }],
    );

    expect(aligned).toEqual([]);
  });

  it("descarta combinações com valores que já não existem", () => {
    const aligned = alignProductVariants(
      [sizeOption],
      [{ values: { Tamanho: "XL" } }, { values: { Tamanho: "M" } }],
    );

    expect(aligned).toEqual([{ values: { Tamanho: "M" } }]);
  });

  it("descarta combinações que não cobrem todas as opções", () => {
    const aligned = alignProductVariants(
      [sizeOption, colorOption],
      [{ values: { Tamanho: "M" } }],
    );

    expect(aligned).toEqual([]);
  });

  it("sem opções não há variantes", () => {
    expect(alignProductVariants([], validVariants)).toEqual([]);
  });

  it("ignora opções vazias (ainda a serem editadas no formulário)", () => {
    const aligned = alignProductVariants(
      [{ name: "", values: ["X"] }, sizeOption],
      [{ values: { Tamanho: "M" } }],
    );

    expect(aligned).toEqual([{ values: { Tamanho: "M" } }]);
  });
});

/* ============================================================
   LIGAÇÃO (wiring) — router, migração e painel
   ============================================================ */

describe("HOMSTEG — persistência de variantes (wiring)", () => {
  const routersSource = normalizeSource(
    readRepoFile("server/routers.ts"),
  );

  it("products.create alinha as variantes às opções enviadas", () => {
    expect(routersSource).toContain(
      "variants: alignProductVariants( input.options, input.variants )",
    );
  });

  it("products.update alinha as variantes às opções efetivas", () => {
    expect(routersSource).toContain(
      "updates.variants = alignProductVariants( effectiveOptions, input.variants )",
    );
  });

  it("os dois modais enviam variants no payload", () => {
    const newModal = normalizeSource(
      readRepoFile(
        "client/src/components/dashboard/products/NewProductModal.tsx",
      ),
    );
    const editModal = normalizeSource(
      readRepoFile(
        "client/src/components/dashboard/products/EditProductModal.tsx",
      ),
    );

    expect(newModal).toContain(
      "variants: buildVariantPayload( variantRows, variantDetails, )",
    );
    expect(editModal).toContain(
      "variants: buildVariantPayload( variantRows, variantDetails, )",
    );
  });

  it("o schema define products.variants com default vazio", () => {
    const column = products.variants as unknown as {
      config?: { default?: unknown };
    };

    expect(column).toBeDefined();
    expect(Array.isArray(column.config?.default)).toBe(true);
  });

  it("a migração 0028 existe, está no journal e é aditiva/não destrutiva", () => {
    const journal = JSON.parse(
      readRepoFile("drizzle/meta/_journal.json"),
    ) as { entries: Array<{ idx: number; tag: string }> };

    const entry = journal.entries.find(
      e => e.tag === "0028_product_variants",
    );

    expect(entry).toBeDefined();
    expect(entry?.idx).toBe(28);

    const migrationSql = readRepoFile("drizzle/0028_product_variants.sql");

    expect(migrationSql).toContain(
      `ADD COLUMN IF NOT EXISTS "variants" jsonb NOT NULL DEFAULT '[]'::jsonb;`,
    );

    /* Nenhuma operação destrutiva na migração. */
    expect(migrationSql).not.toMatch(/\b(DROP|DELETE|TRUNCATE)\b/i);
  });
});
