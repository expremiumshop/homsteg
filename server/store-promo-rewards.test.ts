import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  STORE_CODE_OWNER_REWARD,
  STORE_CODE_USER_REWARD,
} from "./db";
import { stores, storeCodeRedemptions } from "../drizzle/schema";

const projectRoot = path.resolve(import.meta.dirname, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(
    path.join(projectRoot, relativePath),
    "utf8",
  );
}

describe("HOMSTEG — recompensas do código promocional", () => {
  it("dono do código recebe 6.200 créditos de comissão", () => {
    expect(STORE_CODE_OWNER_REWARD).toBe(6_200);
  });

  it("loja que utilizou o código recebe 4.850 créditos", () => {
    expect(STORE_CODE_USER_REWARD).toBe(4_850);
  });

  it("não existe lógica anterior de 4.500 créditos de comissão", () => {
    const dbSource = readRepoFile("server/db.ts");
    const routers = readRepoFile("server/routers.ts");

    for (const source of [dbSource, routers]) {
      expect(source).not.toContain("4500");
      expect(source).not.toContain("4_500");
      expect(source).not.toContain("4.500");
    }
  });

  it("a recompensa do dono vai para a COMISSÃO e a do utilizador para o BÔNUS", () => {
    const dbSource = readRepoFile("server/db.ts");

    /* Dono (Loja A): commissionCredit += OWNER_REWARD. */
    expect(dbSource).toContain(
      "commissionCredit:\n          ownerStore.commissionCredit + STORE_CODE_OWNER_REWARD",
    );

    /* A comissão também entra no crédito atual. */
    expect(dbSource).toContain(
      "creditMzn:\n          ownerStore.creditMzn + STORE_CODE_OWNER_REWARD",
    );

    /* Utilizador (Loja B): bonusCredit += USER_REWARD... */
    expect(dbSource).toContain(
      "bonusCredit: usingStore.bonusCredit + STORE_CODE_USER_REWARD",
    );

    /* ...e também entra no crédito atual. */
    expect(dbSource).toContain(
      "creditMzn: usingStore.creditMzn + STORE_CODE_USER_REWARD",
    );

    /* Os 4.850 NÃO entram no commissionCredit da Loja B. */
    const usingUpdate = dbSource.split("usingStore.bonusCredit +")[1] ?? "";

    const usingBlock = usingUpdate.slice(
      0,
      usingUpdate.indexOf(".where"),
    );

    expect(usingBlock).not.toContain("commissionCredit");
  });

  it("os dois saldos do dono sobem JUNTOS na mesma atualização", () => {
    const dbSource = readRepoFile("server/db.ts");

    const commissionIndex = dbSource.indexOf(
      "commissionCredit:\n          ownerStore.commissionCredit + STORE_CODE_OWNER_REWARD",
    );
    const creditIndex = dbSource.indexOf(
      "creditMzn:\n          ownerStore.creditMzn + STORE_CODE_OWNER_REWARD",
    );

    expect(commissionIndex).toBeGreaterThan(-1);
    expect(creditIndex).toBeGreaterThan(commissionIndex);

    /* Mesma chamada .set({ ... }): campos lado a lado. */
    expect(creditIndex - commissionIndex).toBeLessThan(200);
  });

  it("compras do Market debitem APENAS creditMzn — commissionCredit nunca diminui", () => {
    const dbSource = readRepoFile("server/db.ts");

    const fnBody =
      dbSource.split("export async function purchaseMarketFeature")[1] ?? "";

    /* A função termina na próxima exportação. */
    const fnEnd = fnBody.indexOf("export async function");
    const body = fnBody.slice(0, fnEnd > 0 ? fnEnd : undefined);

    expect(fnEnd).toBeGreaterThan(-1);
    expect(body).toContain(
      "creditMzn: currentCredit - feature.priceCredits",
    );

    /* O commissionCredit NÃO aparece em lado nenhum da
       compra — é histórico acumulado, nunca gasto. */
    expect(body).not.toContain("commissionCredit");
  });

  it("uma loja usa apenas um código, uma única vez (índice único por storeId)", () => {
    const schema = readRepoFile("drizzle/schema.ts");

    expect(schema).toContain(
      'uniqueIndex("store_code_redemptions_store_unique")',
    );
    expect(schema).toContain("table.storeId");
  });

  it("a mutation valida: código próprio, uso repetido e código inválido", () => {
    const dbSource = readRepoFile("server/db.ts");

    /* Lock pessimista: nenhuma duplicação em concorrência. */
    expect(dbSource).toContain('.for("update")');

    /* Verificação de uso anterior DENTRO da transação. */
    expect(dbSource).toMatch(
      /ALREADY_USED[\s\S]*?storeCodeRedemptions[\s\S]*?eq\(storeCodeRedemptions\.storeId, storeId\)/,
    );

    /* Não permitir usar o próprio código. */
    expect(dbSource).toContain('"CODE_IS_OWN"');
    expect(dbSource).toContain(
      "ownerStore.id === storeId",
    );

    /* Verificação ANTES de qualquer crédito ser escrito:
       dentro da função useStorePromoCode, a ordem é
       ALREADY_USED → CODE_IS_OWN → updates de saldos. */
    const fnBody =
      dbSource.split("export async function useStorePromoCode")[1] ?? "";

    /* A função termina onde começa a próxima (ensureStoreCode). */
    const fnEnd = fnBody.indexOf("export async function ensureStoreCode");
    const body = fnBody.slice(0, fnEnd > 0 ? fnEnd : undefined);

    const alreadyCheck = body.indexOf('"ALREADY_USED"');
    const ownCheck = body.indexOf('"CODE_IS_OWN"');
    const ownerUpdate = body.indexOf("ownerStore.commissionCredit +");

    expect(alreadyCheck).toBeGreaterThan(-1);
    expect(ownCheck).toBeGreaterThan(alreadyCheck);
    expect(ownerUpdate).toBeGreaterThan(ownCheck);
  });

  it("o registo do uso é permanente e guarda as recompensas aplicadas", () => {
    const dbSource = readRepoFile("server/db.ts");

    expect(dbSource).toContain(
      "ownerRewardCredits: STORE_CODE_OWNER_REWARD",
    );
    expect(dbSource).toContain(
      "userRewardCredits: STORE_CODE_USER_REWARD",
    );
  });

  it("o campo de inserir código desaparece depois do uso (cliente)", () => {
    /*
     * O código promocional vive na conta completa
     * (CreditsPage), não no painel principal.
     */
    const card = readRepoFile(
      "client/src/components/dashboard/plan/CreditsPage.tsx",
    );

    /* Renderização condicional: registo do uso OU campo vazio. */
    expect(card).toContain("promoCode ? (");
    expect(card).toContain("Código promocional utilizado");
    expect(card).toContain("Código promocional de outra loja");

    /* Invalida a query após uso — o campo desaparece. */
    expect(card).toContain(
      "utils.stores.usage.current.invalidate()",
    );
  });

  it("a regra aplica-se a lojas antigas e novas (mesma leitura/mutation)", () => {
    const routers = readRepoFile("server/routers.ts");

    /* A leitura do uso corre em TODA chamada de usage.current
       (lojas antigas e novas), não só na criação. */
    expect(routers).toContain(
      "getStoreCodeRedemption(input.storeId)",
    );

    /* A mutação é genérica: recebe storeId + code. */
    expect(routers).toContain("usePromoCode: protectedProcedure");
  });
});
