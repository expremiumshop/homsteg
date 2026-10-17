import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { products } from "../drizzle/schema";
import {
  productCreateInput,
  productUpdateInput,
} from "./routers";

const projectRoot = path.resolve(import.meta.dirname, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(projectRoot, relativePath), "utf8");
}

/**
 * Colapsa espaços/quebras de linha num único espaço.
 *
 * Algumas asserções verificam a LIGAÇÃO de código (wiring)
 * que não pode ser executada sem base de dados. Comparar
 * texto normalizado evita que uma passagem do Prettier faça
 * falhar o teste sem o comportamento ter mudado.
 */
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

/* ============================================================
   CONTRATO ZOD (executável — sem base de dados)
   ============================================================ */

describe("HOMSTEG — contrato de criação de produto", () => {
  it("sem variantes: options nasce vazio e o estado por omissão é rascunho", () => {
    const parsed = productCreateInput.parse({
      ...validCreatePayload,
    });

    expect(parsed.options).toEqual([]);
    expect(parsed.status).toBe("draft");
    expect(parsed.featured).toBe(false);
  });

  it("com variantes: name/values são preservados", () => {
    const parsed = productCreateInput.parse({
      ...validCreatePayload,
      options: [
        { name: "Tamanho", values: ["S", "M", "L"] },
        { name: "Cor", values: ["Preto", "Branco"] },
      ],
    });

    expect(parsed.options).toEqual([
      { name: "Tamanho", values: ["S", "M", "L"] },
      { name: "Cor", values: ["Preto", "Branco"] },
    ]);
  });

  it("aceita publicação imediata (status 'active') e destaque", () => {
    const parsed = productCreateInput.parse({
      ...validCreatePayload,
      status: "active",
      featured: true,
    });

    expect(parsed.status).toBe("active");
    expect(parsed.featured).toBe(true);
  });

  it("recusa um estado inválido na criação (arquivo só na edição)", () => {
    const result = productCreateInput.safeParse({
      ...validCreatePayload,
      status: "archived",
    });

    expect(result.success).toBe(false);
  });

  it("recusa preço de variante sem nome ou sem valores", () => {
    expect(
      productCreateInput.safeParse({
        ...validCreatePayload,
        options: [{ name: "", values: ["S"] }],
      }).success,
    ).toBe(false);

    expect(
      productCreateInput.safeParse({
        ...validCreatePayload,
        options: [{ name: "Tamanho", values: [] }],
      }).success,
    ).toBe(false);
  });
});

describe("HOMSTEG — contrato de edição de produto", () => {
  it("publica, volta a rascunho e arquiva", () => {
    for (const status of ["draft", "active", "archived"] as const) {
      const parsed = productUpdateInput.parse({
        storeId: "store-a",
        productId: 1,
        status,
      });

      expect(parsed.status).toBe(status);
    }
  });

  it("persiste o destaque", () => {
    const parsed = productUpdateInput.parse({
      storeId: "store-a",
      productId: 1,
      featured: true,
    });

    expect(parsed.featured).toBe(true);
  });

  it("é parcial: não obriga a reenviar os restantes campos", () => {
    const parsed = productUpdateInput.parse({
      storeId: "store-a",
      productId: 7,
      status: "active",
    });

    expect(parsed.name).toBeUndefined();
    expect(parsed.priceMzn).toBeUndefined();
    expect(parsed.stock).toBeUndefined();
    expect(parsed.status).toBe("active");
  });

  it("recusa um estado inválido na edição", () => {
    const result = productUpdateInput.safeParse({
      storeId: "store-a",
      productId: 1,
      status: "published",
    });

    expect(result.success).toBe(false);
  });
});

/* ============================================================
   LIGAÇÃO (wiring) — persistência e acesso público
   ============================================================ */

describe("HOMSTEG — persistência do estado e do destaque", () => {
  const routersSource = normalizeSource(
    readRepoFile("server/routers.ts"),
  );

  it("products.create grava o estado ESCOLHIDO (nunca força 'draft')", () => {
    const insertSegment =
      routersSource.split("return insertProduct({")[1] ?? "";

    const block = insertSegment.slice(
      0,
      insertSegment.indexOf("});"),
    );

    expect(block).toContain("status: input.status");
    expect(block).toContain("featured: input.featured");
    expect(block).not.toContain('"draft"');
  });

  it("products.update liga status e featured ao patch enviado à base de dados", () => {
    expect(routersSource).toContain(
      "if (input.status !== undefined) updates.status = input.status;",
    );
    expect(routersSource).toContain(
      "if (input.featured !== undefined) updates.featured = input.featured;",
    );
  });

  it("os dois modais enviam status e featured no payload", () => {
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
      "options: productOptions, status, featured,",
    );
    expect(editModal).toContain(
      "options: productOptions, status, featured,",
    );
  });

  it("o schema define products.featured booleano, not null, default false", () => {
    const column = products.featured as unknown as {
      config?: { default?: unknown };
    };

    expect(column).toBeDefined();
    expect(column.config?.default).toBe(false);
  });

  it("a migração 0027 existe, está no journal e é aditiva/não destrutiva", () => {
    const journal = JSON.parse(
      readRepoFile("drizzle/meta/_journal.json"),
    ) as { entries: Array<{ idx: number; tag: string }> };

    const entry = journal.entries.find(
      (e) => e.tag === "0027_product_featured",
    );

    expect(entry).toBeDefined();
    expect(entry?.idx).toBe(27);

    const migrationSql = readRepoFile(
      "drizzle/0027_product_featured.sql",
    );

    expect(migrationSql).toContain(
      'ADD COLUMN IF NOT EXISTS "featured" boolean NOT NULL DEFAULT false;',
    );

    /* Nenhuma operação destrutiva na migração. */
    expect(migrationSql).not.toMatch(/\b(DROP|DELETE|TRUNCATE)\b/i);
  });
});

describe("HOMSTEG — acesso público (produtos publicados apenas)", () => {
  const dbSource = normalizeSource(readRepoFile("server/db.ts"));

  function functionBlock(name: string): string {
    const after = dbSource.split(`export async function ${name}`)[1] ?? "";

    const end = after.indexOf("export async function");

    return after.slice(0, end > 0 ? end : undefined);
  }

  it("listPublicProducts devolve apenas produtos com estado 'active'", () => {
    const block = functionBlock("listPublicProducts");

    expect(block).toContain('eq(products.status, "active")');
    expect(block).not.toContain('ne(products.status, "archived")');
  });

  it("o painel (listProducts) continua a devolver todos os estados", () => {
    const block = functionBlock("listProducts");

    expect(block).toContain("eq(products.storeId, storeId)");
    expect(block).not.toContain('eq(products.status, "active")');
  });
});
