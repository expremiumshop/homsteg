/*
 * Aplica a migração 0027 (products.featured) à base de dados Neon.
 *
 * Uso: node scripts/apply-0027-product-featured.mjs --apply
 *
 * Guardas de segurança (aborta sem escrever se falharem):
 *   - a migração tem de conter o ALTER ... ADD COLUMN IF NOT EXISTS
 *     e NÃO pode conter DROP/DELETE/TRUNCATE/UPDATE;
 *   - a base de dados tem de ser "neondb";
 *   - se a coluna já existir, não faz nada (idempotente) e apenas
 *     garante o registo na tabela de migrações;
 *   - tudo dentro de uma transação: ou aplica por completo, ou nada.
 *
 * Regista também a migração em drizzle.__drizzle_migrations com o
 * hash sha256 do ficheiro (o mesmo método que o migrador do drizzle
 * usa — validado contra as migrações 0025 e 0026 já aplicadas).
 * Nunca imprime segredos.
 */

import { createHash } from "node:crypto";
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

const MIGRATION_FILE = "drizzle/0027_product_featured.sql";
const MIGRATION_WHEN = 1792100400000;

const env = parseEnv(".env");
const connectionString =
  env.MIGRATION_DATABASE_URL || env.DATABASE_URL;

if (!process.argv.includes("--apply")) {
  console.error("Abortado: falta --apply (execução deliberada).");
  process.exit(1);
}

if (!connectionString) {
  console.error("Abortado: sem MIGRATION_DATABASE_URL/DATABASE_URL.");
  process.exit(1);
}

const sqlBytes = readFileSync(MIGRATION_FILE);
const sqlText = sqlBytes.toString("utf8");
const migrationHash = createHash("sha256")
  .update(sqlBytes)
  .digest("hex");

/* Remove comentários `--` para validar apenas código executável. */
function stripSqlComments(source) {
  return source.replace(/--[^\n]*/g, "");
}

const executableSql = stripSqlComments(sqlText);

/* ---- Guardas de conteúdo (exclusivamente aditiva) ---- */
if (
  !/ADD COLUMN IF NOT EXISTS "featured" boolean NOT NULL DEFAULT false;/i.test(
    executableSql,
  )
) {
  console.error("Abortado: o SQL não contém o ADD COLUMN esperado.");
  process.exit(1);
}

if (/\b(DROP|DELETE|TRUNCATE|UPDATE|INSERT)\b/i.test(executableSql)) {
  console.error("Abortado: o SQL contém operações não aditivas.");
  process.exit(1);
}

console.log("Migração:", MIGRATION_FILE);
console.log("Hash sha256:", migrationHash);

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();

  const identity = (
    await client.query("select current_database() as db")
  ).rows[0];

  if (identity.db !== "neondb") {
    console.error(
      `Abortado: base de dados inesperada ("${identity.db}").`,
    );
    process.exit(1);
  }

  const before = (
    await client.query(
      `select 1 from information_schema.columns
        where table_schema='public' and table_name='products'
          and column_name='featured'`,
    )
  ).rowCount;

  const registered = (
    await client.query(
      "select id from drizzle.__drizzle_migrations where hash = $1",
      [migrationHash],
    )
  ).rowCount;

  console.log("Coluna já existe:", before > 0);
  console.log("Já registada nas migrações:", registered > 0);

  await client.query("begin");

  if (before === 0) {
    await client.query(sqlText);
    console.log("ALTER aplicado.");
  } else {
    console.log("ALTER ignorado (coluna já existia).");
  }

  if (registered === 0) {
    await client.query(
      "insert into drizzle.__drizzle_migrations (hash, created_at) values ($1, $2)",
      [migrationHash, MIGRATION_WHEN],
    );
    console.log("Registo de migração inserido.");
  } else {
    console.log("Registo de migração já existia.");
  }

  await client.query("commit");

  const after = (
    await client.query(
      `select column_name, data_type, is_nullable, column_default
         from information_schema.columns
        where table_schema='public' and table_name='products'
          and column_name='featured'`,
    )
  ).rows;

  console.log("Resultado:", JSON.stringify(after));
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("ERRO (rollback feito):", error.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
