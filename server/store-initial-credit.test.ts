import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { STORE_INITIAL_CREDIT } from "./db";
import { stores } from "../drizzle/schema";
import {
  formatCreditAmount,
  formatCredits,
  formatStoreCredit,
} from "@/lib/plans";

const projectRoot = path.resolve(import.meta.dirname, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(
    path.join(projectRoot, relativePath),
    "utf8",
  );
}

/** Remove comentários /* … *​/ e // para validar só código executável. */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

describe("HOMSTEG — saldo inicial de 100.000 créditos", () => {
  it("toda loja nova nasce com 100.000 créditos (constante dos fluxos de criação)", () => {
    expect(STORE_INITIAL_CREDIT).toBe(100_000);
  });

  it("o schema define 100000 como default de stores.creditMzn", () => {
    const column = stores.creditMzn as unknown as {
      config?: { default?: unknown };
    };

    expect(column.config?.default).toBe(100000);
  });

  it("a migração 0021 existe, está no journal e define o default de 100.000", () => {
    const journal = JSON.parse(
      readRepoFile("drizzle/meta/_journal.json"),
    ) as { entries: Array<{ idx: number; tag: string }> };

    const entry = journal.entries.find(
      (e) => e.tag === "0021_store_initial_credit",
    );

    expect(entry).toBeDefined();
    expect(entry?.idx).toBe(21);

    const migrationSql = readRepoFile(
      "drizzle/0021_store_initial_credit.sql",
    );

    expect(migrationSql).toContain(
      'ALTER TABLE "stores" ALTER COLUMN "creditMzn" SET DEFAULT 100000;',
    );
  });

  it("o backfill da 0021 é seguro: nunca baixa saldos nem destrói dados (sem duplicação)", () => {
    const migrationSql = readRepoFile(
      "drizzle/0021_store_initial_credit.sql",
    );

    // Sobe saldos abaixo de 100.000 exatamente para 100.000;
    // saldos maiores ficam intactos → reexecutar não duplica.
    expect(migrationSql).toContain(
      'UPDATE "stores" SET "creditMzn" = 100000 WHERE "creditMzn" < 100000;',
    );

    // Nenhuma operação destrutiva na migração.
    expect(migrationSql).not.toMatch(
      /\b(DROP|DELETE|TRUNCATE)\b/i,
    );
  });

  it("todos os fluxos de criação de loja atribuem STORE_INITIAL_CREDIT", () => {
    const dbSource = readRepoFile("server/db.ts");

    // Existem exatamente dois pontos de criação de loja:
    // createStoreForUser e createStoreFromApplication.
    const insertCount = dbSource.split(".insert(stores)").length - 1;
    expect(insertCount).toBe(2);

    // Cada criação define explicitamente o saldo inicial
    // (sem depender do default da base de dados).
    const segments = dbSource.split(".insert(stores)").slice(1);
    for (const segment of segments) {
      expect(segment.slice(0, 500)).toContain(
        "creditMzn: STORE_INITIAL_CREDIT",
      );
    }
  });

  it("o saldo é sempre exibido como 'créditos', nunca como moeda (sem MZN/MT/MZM)", () => {
    expect(formatCreditAmount(100_000)).toBe("100.000");
    expect(formatCredits(100_000)).toBe("100.000 créditos");
    expect(formatStoreCredit(100_000)).toBe("Créditos: 100.000");

    const forbidden = /MZM|\bMT\b|\bMZN\b|R\$|€|\$|meticai?s?/i;

    for (const output of [
      formatCreditAmount(100_000),
      formatCredits(100_000),
      formatStoreCredit(100_000),
      formatCreditAmount(0),
      formatCredits(0),
      formatStoreCredit(0),
      formatCredits(null),
      formatStoreCredit(undefined),
    ]) {
      expect(output).not.toMatch(forbidden);
    }
  });

  it("nenhum ecrã de crédito usa MZM como unidade do saldo", () => {
    const creditScreens = [
      "client/src/lib/plans.ts",
      "client/src/components/dashboard/plan/PlanBadge.tsx",
      "client/src/components/dashboard/plan/PlanUsageCard.tsx",
      "client/src/components/dashboard/plan/PlanSidebarCard.tsx",
      "client/src/components/dashboard/plan/useStorePlan.ts",
      "client/src/components/dashboard/layout/DashboardSidebar.tsx",
      "client/src/components/dashboard/layout/DashboardHeader.tsx",
      "client/src/components/admin/credit/CreditPanel.tsx",
      "client/src/components/admin/users/UsersPanel.tsx",
    ];

    for (const file of creditScreens) {
      // MZM não pode existir em código executável (menções
      // em comentários que proíbem o uso são permitidas).
      expect(stripComments(readRepoFile(file))).not.toContain(
        "MZM",
      );
    }
  });

  it("textos públicos/SEO anunciam '100.000 créditos' corretamente", () => {
    const indexHtml = readRepoFile("client/index.html");

    expect(indexHtml).toContain("100.000 créditos gratuitos");

    // A meta description não pode apresentar créditos como moeda.
    const metaDescription = indexHtml.match(
      /name="description" content="([^"]+)"/,
    )?.[1];
    expect(metaDescription).toBeDefined();
    expect(metaDescription).toMatch(/100\.000 créditos/);
    expect(metaDescription).not.toMatch(/\bMZM\b|\bMT\b|\bMZN\b/);

    const home = readRepoFile("client/src/pages/Home.tsx");
    expect(home).toContain("100.000 créditos gratuitos");
    expect((home.match(/100\.000 créditos/g) ?? []).length).toBeGreaterThanOrEqual(3);

    // Nenhuma linha pública que fala de créditos os apresenta
    // com unidade monetária (preços demo de produtos não contam).
    for (const line of home.split("\n")) {
      if (/cr[eé]dit/i.test(line)) {
        expect(line).not.toMatch(/\bMZM\b/);
      }
    }

    const readme = readRepoFile("README_HOMSTEG.md");
    expect(readme).toContain("100.000 créditos gratuitos");
    expect(readme).toContain(
      "nunca são apresentados como MZN, MT ou qualquer moeda",
    );
  });
});
