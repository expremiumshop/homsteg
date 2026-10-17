/*
 * Teste SEGURO do fluxo de produto contra a base de dados real.
 *
 * Uso: node scripts/test-product-publication-safe.mjs
 *
 * Como funciona:
 *   - Tudo corre dentro de UMA transação que termina SEMPRE em
 *     ROLLBACK. Nada é persistido: não cria nem altera produtos reais.
 *   - Usa um storeId sentinela ("__homsteg_verify__") que não
 *     corresponde a nenhuma loja real.
 *   - No fim prova que o número de linhas do sentinela é 0 e que a
 *     contagem total de produtos não mudou.
 *
 * O que verifica (ao nível da base de dados):
 *   1. criar produto com status='active' e featured=true persiste;
 *   2. ler de volta confirma status e featured;
 *   3. editar para status='draft' persiste;
 *   4. a consulta PÚBLICA (status='active') devolve só os ativos;
 *   5. a consulta do painel devolve todos os estados.
 */

import { readFileSync } from "node:fs";

import pg from "pg";

function parseEnv(path) {
  const out = {};
  const text = readFileSync(path, "utf8");

  for (const line of text.split(/\r?\n/)) {
    const match = line.match(
      /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/,
    );

    if (!match) continue;

    let value = match[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    out[match[1]] = value;
  }

  return out;
}

const env = parseEnv(".env");
const connectionString =
  env.MIGRATION_DATABASE_URL || env.DATABASE_URL;

const TEST_STORE = "__homsteg_verify__";

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} — ${name}${detail ? ` (${detail})` : ""}`);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

let totalBefore;

try {
  await client.connect();

  const identity = (
    await client.query("select current_database() as db")
  ).rows[0];

  if (identity.db !== "neondb") {
    throw new Error(`Base de dados inesperada: ${identity.db}`);
  }

  totalBefore = Number(
    (await client.query("select count(*)::int as n from products"))
      .rows[0].n,
  );

  console.log(`Produtos na tabela antes: ${totalBefore}`);
  console.log("A abrir transação (será revertida no fim)...\n");

  await client.query("begin");

  /* 1. CRIAR produto publicado + destacado */
  const created = (
    await client.query(
      `insert into products ("storeId", name, slug, "priceMzn", stock, status, featured, options, "imageKeys")
       values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::text[])
       returning id, status, featured`,
      [
        TEST_STORE,
        "Produto de verificação",
        "produto-de-verificacao",
        100,
        5,
        "active",
        true,
        JSON.stringify([]),
        [],
      ],
    )
  ).rows[0];

  check(
    "criação publica (active) persiste",
    created.status === "active",
    `status=${created.status}`,
  );
  check(
    "criação com destaque (featured=true) persiste",
    created.featured === true,
    `featured=${created.featured}`,
  );

  /* 2. LER DE VOLTA (prova que ficou gravado na Neon) */
  const readBack = (
    await client.query(
      "select status, featured from products where id = $1",
      [created.id],
    )
  ).rows[0];

  check(
    "leitura de volta confirma status/featured",
    readBack.status === "active" && readBack.featured === true,
    JSON.stringify(readBack),
  );

  /* 3. EDITAR: voltar a rascunho */
  const edited = (
    await client.query(
      "update products set status = $1, featured = $2 where id = $3 returning status, featured",
      ["draft", false, created.id],
    )
  ).rows[0];

  check(
    "edição para rascunho (draft) persiste",
    edited.status === "draft" && edited.featured === false,
    JSON.stringify(edited),
  );

  /* 3b. EDITAR: publicar de novo */
  const republished = (
    await client.query(
      "update products set status = $1 where id = $2 returning status",
      ["active", created.id],
    )
  ).rows[0];

  check(
    "republicação (draft -> active) persiste",
    republished.status === "active",
    `status=${republished.status}`,
  );

  /* 4. Segundo produto (rascunho) para testar a visibilidade */
  await client.query(
    `insert into products ("storeId", name, slug, "priceMzn", stock, status, featured, options, "imageKeys")
     values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::text[])`,
    [
      TEST_STORE,
      "Produto rascunho",
      "produto-rascunho",
      200,
      0,
      "draft",
      false,
      JSON.stringify([]),
      [],
    ],
  );

  /* Consulta PÚBLICA (igual a listPublicProducts: só active) */
  const publicRows = (
    await client.query(
      `select id, status from products
        where "storeId" = $1 and status = 'active'`,
      [TEST_STORE],
    )
  ).rows;

  check(
    "consulta pública devolve apenas o produto ativo",
    publicRows.length === 1 && publicRows[0].id === created.id,
    `ativas=${publicRows.length}`,
  );

  /* Consulta do PAINEL (listProducts: todos os estados) */
  const panelRows = (
    await client.query(
      'select id from products where "storeId" = $1',
      [TEST_STORE],
    )
  ).rows;

  check(
    "consulta do painel devolve todos os estados",
    panelRows.length === 2,
    `total=${panelRows.length}`,
  );

  /* 5. ROLLBACK — nada é persistido */
  await client.query("rollback");
  console.log("\nROLLBACK executado (nada persistido).");
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("ERRO (rollback feito):", error.message);
  process.exitCode = 1;
} finally {
  /* Prova final: o sentinela não deixou rasto e o total não mudou. */
  try {
    const leftovers = Number(
      (
        await client.query(
          'select count(*)::int as n from products where "storeId" = $1',
          [TEST_STORE],
        )
      ).rows[0].n,
    );

    const totalAfter = Number(
      (await client.query("select count(*)::int as n from products"))
        .rows[0].n,
    );

    check(
      "nenhum produto de teste ficou na base de dados",
      leftovers === 0,
      `sentinel=${leftovers}`,
    );

    check(
      "contagem total de produtos inalterada",
      totalAfter === totalBefore,
      `antes=${totalBefore} depois=${totalAfter}`,
    );
  } finally {
    await client.end().catch(() => {});
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(
    `\nRESULTADO: ${results.length - failed}/${results.length} verificações passaram.`,
  );
}
