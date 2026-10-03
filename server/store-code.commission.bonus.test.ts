import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  STORE_CODE_LENGTH,
  generateStoreCode,
  isValidStoreCodeFormat,
  normalizeStoreCode,
} from "./store-code";
import { STORE_INITIAL_CREDIT } from "./db";
import { stores } from "../drizzle/schema";

const projectRoot = path.resolve(import.meta.dirname, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(
    path.join(projectRoot, relativePath),
    "utf8",
  );
}

describe("HOMSTEG — código da loja, comissão e bônus", () => {
  it("gera códigos com 8 caracteres no alfabeto sem ambíguos", () => {
    const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

    for (let i = 0; i < 50; i++) {
      const code = generateStoreCode();

      expect(code).toHaveLength(STORE_CODE_LENGTH);
      expect(STORE_CODE_LENGTH).toBe(8);

      for (const char of code) {
        expect(alphabet).toContain(char);
      }
    }
  });

  it("não gera caracteres ambíguos (0/O/1/I/L)", () => {
    for (let i = 0; i < 100; i++) {
      const code = generateStoreCode();

      expect(code).not.toMatch(/[0O1IL]/);
    }
  });

  it("códigos gerados em série são (praticamente sempre) distintos", () => {
    const codes = new Set(
      Array.from({ length: 200 }, () => generateStoreCode()),
    );

    /* 32^8 combinações — 200 códigos iguais seria falha
       criptográfica grave, não coincidência. */
    expect(codes.size).toBeGreaterThan(195);
  });

  it("normaliza e valida códigos introduzidos", () => {
    expect(normalizeStoreCode(" h7k2m9pq ")).toBe("H7K2M9PQ");
    expect(normalizeStoreCode("H7K2-M9PQ")).toBe("H7K2M9PQ");
    expect(normalizeStoreCode("h7k2.m9pq")).toBe("H7K2M9PQ");

    expect(isValidStoreCodeFormat("H7K2M9PQ")).toBe(true);
    expect(isValidStoreCodeFormat("h7k2m9pq")).toBe(true);
    expect(isValidStoreCodeFormat("H7K2M9P")).toBe(false);
    expect(isValidStoreCodeFormat("H7K2M9P0")).toBe(false);
    expect(isValidStoreCodeFormat("")).toBe(false);
  });

  it("o schema define commissionCredit e bonusCredit com default 0", () => {
    for (const column of [
      stores.commissionCredit,
      stores.bonusCredit,
    ]) {
      const config = (column as unknown as {
        config?: { default?: unknown };
      }).config;

      expect(config?.default).toBe(0);
    }
  });

  it("toda nova loja recebe código exclusivo automaticamente (fluxos de criação)", () => {
    const dbSource = readRepoFile("server/db.ts");

    /* Os dois fluxos de criação chamam ensureStoreCode
       FORA da transação (evita deadlock com o pool). */
    const createStoreMatches =
      dbSource.match(/const storeCode = await ensureStoreCode\(/g) ??
      [];

    expect(createStoreMatches.length).toBe(2);

    /* Nenhuma atribuição de código dentro de transação. */
    const transactionBodies =
      dbSource.split("db.transaction(async (tx) => {").slice(1);

    for (const body of transactionBodies) {
      const bodyUntilClose =
        body.split("});")[0] ?? body;

      expect(bodyUntilClose).not.toContain(
        "ensureStoreCode(",
      );
    }
  });

  it("a migração 0023 existe e é idempotente (IF NOT EXISTS)", () => {
    const journal = JSON.parse(
      readRepoFile("drizzle/meta/_journal.json"),
    ) as { entries: Array<{ idx: number; tag: string }> };

    const entry = journal.entries.find(
      (e) => e.tag === "0023_store_code_commission_bonus",
    );

    expect(entry?.idx).toBe(23);

    const migrationSql = readRepoFile(
      "drizzle/0023_store_code_commission_bonus.sql",
    );

    expect(migrationSql).toContain(
      'ADD COLUMN IF NOT EXISTS "commissionCredit" integer NOT NULL DEFAULT 0',
    );
    expect(migrationSql).toContain(
      'ADD COLUMN IF NOT EXISTS "bonusCredit" integer NOT NULL DEFAULT 0',
    );
    expect(migrationSql).toContain(
      'ADD COLUMN IF NOT EXISTS "storeCode" varchar(16)',
    );
    expect(migrationSql).toContain(
      'CREATE UNIQUE INDEX IF NOT EXISTS "stores_store_code_unique"',
    );

    /* Não destrutiva. */
    expect(migrationSql).not.toMatch(
      /\b(DROP|DELETE|TRUNCATE)\b/i,
    );
  });

  it("o índice único do código está declarado no schema", () => {
    const schema = readRepoFile("drizzle/schema.ts");

    expect(schema).toContain(
      'uniqueIndex("stores_store_code_unique")',
    );
  });

  it("a conta completa de créditos mostra as informações e o botão copiar", () => {
    /*
     * A conta completa vive em CreditsPage.tsx — o
     * painel principal (PlanUsageCard) mostra apenas o
     * Crédito atual e o atalho "Gerenciar crédito".
     */
    const card = readRepoFile(
      "client/src/components/dashboard/plan/CreditsPage.tsx",
    );

    expect(card).toContain("Crédito atual");
    expect(card).toContain("Comissão acumulada");
    expect(card).toContain("Bônus acumulado");
    expect(card).toContain("Código da loja");
    expect(card).toContain("Copiar código");

    /* Saldos sempre em créditos, nunca moeda — em
       código executável (comentários que proíbem o uso
       não contam). */
    const executable = card
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1");

    expect(executable).not.toMatch(/\bMZM\b/);
    expect(executable).not.toMatch(/\bMZN\b/);
    expect(executable).not.toMatch(/\bMT\b/);

    /* O código do cartão lê dos campos do servidor. */
    expect(card).toContain("commissionCredit");
    expect(card).toContain("bonusCredit");
    expect(card).toContain("storeCode");
  });

  it("o painel principal mostra apenas o Crédito atual + botão Gerenciar crédito", () => {
    const card = readRepoFile(
      "client/src/components/dashboard/plan/PlanUsageCard.tsx",
    );

    expect(card).toContain("Crédito atual");
    expect(card).toContain(
      "Saldo disponível para utilizar no Market.",
    );
    expect(card).toContain("Gerenciar crédito");
    expect(card).toContain("/app/credits");

    /* O painel principal NÃO mostra comissão, bônus,
       código da loja nem código promocional — tudo isso
       vive na conta completa (CreditsPage). */
    expect(card).not.toContain("Comissão");
    expect(card).not.toContain("Bônus");
    expect(card).not.toContain("Código da loja");
    expect(card).not.toContain("promoCode");
  });

  it("o saldo inicial de 100.000 créditos não é alterado", () => {
    expect(STORE_INITIAL_CREDIT).toBe(100_000);
  });
});
