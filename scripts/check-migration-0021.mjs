/**
 * Verificação read-only do estado da migração 0021
 * (saldo inicial de 100.000 créditos) no PostgreSQL atual.
 *
 * Uso: MIGRATION_DATABASE_URL=<url> node scripts/check-migration-0021.mjs
 * (ou simplesmente `node scripts/check-migration-0021.mjs` com .env presente)
 */
import "dotenv/config";
import pg from "pg";

const connectionString =
  process.env.MIGRATION_DATABASE_URL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Sem MIGRATION_DATABASE_URL nem DATABASE_URL");
  process.exit(1);
}

const client = new pg.Client({ connectionString });
await client.connect();

try {
  // 1. Migrações registadas pela drizzle
  const mig = await client.query(
    "SELECT hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at ASC",
  );
  console.log("== Migrações registadas (drizzle.__drizzle_migrations) ==");
  for (const row of mig.rows) {
    console.log(`- ${row.hash} (${new Date(Number(row.created_at)).toISOString()})`);
  }

  // 2. Default atual da coluna creditMzn
  const def = await client.query(
    `SELECT column_default FROM information_schema.columns
     WHERE table_name = 'stores' AND column_name = 'creditMzn'`,
  );
  console.log("\n== Default da coluna stores.creditMzn ==");
  console.log(def.rows[0]?.column_default ?? "(coluna não encontrada)");

  // 3. Estado dos saldos das lojas existentes
  const stats = await client.query(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE "creditMzn" = 100000)::int AS com_100k,
            COUNT(*) FILTER (WHERE "creditMzn" < 100000)::int AS abaixo_100k,
            COUNT(*) FILTER (WHERE "creditMzn" > 100000)::int AS acima_100k,
            MIN("creditMzn")::int AS minimo,
            MAX("creditMzn")::int AS maximo
     FROM stores`,
  );
  console.log("\n== Saldos de créditos nas lojas existentes ==");
  console.log(stats.rows[0]);

  // 4. Utilizadores sem loja (informativo)
  const users = await client.query(
    `SELECT COUNT(*)::int AS total_users,
            (SELECT COUNT(*)::int FROM stores) AS total_stores
     FROM users`,
  );
  console.log("\n== Utilizadores vs lojas ==");
  console.log(users.rows[0]);
} finally {
  await client.end();
}
