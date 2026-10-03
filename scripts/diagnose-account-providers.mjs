/*
 * Diagnóstico read-only: mostra, por utilizador Better Auth
 * recente, as contas (providers) ligadas na tabela `account`.
 * Serve para confirmar se a credencial "credential"
 * (palavra-passe) desaparece após a verificação por OTP.
 */

import "dotenv/config";

import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL não está configurada.");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: databaseUrl,
  max: 1,
  connectionTimeoutMillis: 10_000,
});

try {
  const result = await pool.query(
    `SELECT u.email, u.email_verified,
            COALESCE(array_agg(a.provider_id) FILTER (WHERE a.provider_id IS NOT NULL), '{}') AS providers
       FROM "user" u
       LEFT JOIN "account" a ON a.user_id = u.id
      WHERE u.created_at > now() - interval '30 days'
      GROUP BY u.id, u.email, u.email_verified
      ORDER BY u.created_at DESC
      LIMIT 12`,
  );

  console.log("Utilizadores recentes e providers ligados:");

  for (const row of result.rows) {
    console.log(
      `  - ${row.email} | verificado=${row.email_verified} | providers=[${row.providers.join(", ")}]`,
    );
  }
} finally {
  await pool.end();
}
