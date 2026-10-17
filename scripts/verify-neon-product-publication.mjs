/*
 * Verificação read-only do estado da base de dados Neon (HOMSTEG).
 *
 * Uso: node scripts/verify-neon-product-publication.mjs [--db]
 *
 * - Sem --db: apenas compara os destinos das URLs (host/base/utilizador
 *   mascarado) SEM imprimir segredos e SEM abrir ligação.
 * - Com --db: liga à DATABASE_URL e reporta (só leitura):
 *     - identidade do servidor (base de dados, versão, hora);
 *     - existência da coluna products.featured;
 *     - migrações aplicadas em drizzle.__drizzle_migrations;
 *     - contagem de produtos por estado (visibilidade pública);
 *     - o resultado exato da consulta pública (status = 'active').
 *
 * Nunca escreve na base de dados. Nunca imprime password/host completo.
 */

import { readFileSync } from "node:fs";

import pg from "pg";

function parseEnv(path) {
  const out = {};
  let text;

  try {
    text = readFileSync(path, "utf8");
  } catch {
    return out;
  }

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

function describe(url) {
  if (!url) return { present: false };

  try {
    const u = new URL(url);
    const user = u.username || "";

    return {
      present: true,
      protocol: u.protocol.replace(":", ""),
      host: u.hostname,
      port: u.port || "(default)",
      database: u.pathname.replace(/^\//, ""),
      user: user
        ? `${user.slice(0, 3)}***`
        : "(none)",
      sslmode: u.searchParams.get("sslmode") ?? "(none)",
    };
  } catch {
    return { present: true, error: "unparseable" };
  }
}

const env = parseEnv(".env");
const prod = parseEnv(".env.vercel.production");

const targets = {
  "env.DATABASE_URL": env.DATABASE_URL,
  "env.MIGRATION_DATABASE_URL": env.MIGRATION_DATABASE_URL,
  "vercel.production.DATABASE_URL": prod.DATABASE_URL,
};

console.log("=== DESTINOS (sem segredos) ===");

for (const [name, url] of Object.entries(targets)) {
  console.log(name, JSON.stringify(describe(url)));
}

const same = (a, b) => Boolean(a) && Boolean(b) && a === b;

console.log("\n=== RELAÇÕES ===");
console.log(
  "env.DATABASE_URL === vercel.production.DATABASE_URL:",
  same(env.DATABASE_URL, prod.DATABASE_URL),
);
console.log(
  "env.DATABASE_URL === env.MIGRATION_DATABASE_URL:",
  same(env.DATABASE_URL, env.MIGRATION_DATABASE_URL),
);

if (!process.argv.includes("--db")) {
  process.exit(0);
}

const connectionString = env.DATABASE_URL;

if (!connectionString) {
  console.error("\nDATABASE_URL ausente em .env — abortar.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();

  console.log("\n=== IDENTIDADE DO SERVIDOR ===");

  console.log(
    (
      await client.query(
        "select current_database() as db, current_user as usr, version() as version, now() as now",
      )
    ).rows[0],
  );

  console.log("\n=== COLUNA products.featured ===");

  console.log(
    (
      await client.query(
        `select column_name, data_type, is_nullable, column_default
           from information_schema.columns
          where table_schema = 'public'
            and table_name = 'products'
            and column_name = 'featured'`,
      )
    ).rows,
  );

  console.log("\n=== MIGRAÇÕES APLICADAS (drizzle.__drizzle_migrations) ===");

  try {
    console.log(
      (
        await client.query(
          "select id, hash, created_at from drizzle.__drizzle_migrations order by id",
        )
      ).rows,
    );
  } catch (error) {
    console.log("indisponível:", error.message);
  }

  console.log("\n=== PRODUTOS POR ESTADO (leitura) ===");

  console.log(
    (
      await client.query(
        `select status, count(*)::int as total
           from products
          group by status
          order by status`,
      )
    ).rows,
  );

  console.log("\n=== CONSULTA PÚBLICA (o que a loja devolve) ===");

  console.log(
    (
      await client.query(
        `select status, count(*)::int as public_products
           from products
          where status = 'active'
          group by status`,
      )
    ).rows,
  );
} finally {
  await client.end().catch(() => {});
}
