/*
 * Diagnóstico read-only do fluxo "Criar conta".
 *
 * Mostra os utilizadores Better Auth mais recentes e as
 * linhas de OTP (tabela `verification`) mais recentes,
 * para perceber se:
 *   1. o utilizador é criado no sign-up;
 *   2. o OTP é armazenado (identificador "email-verification:*");
 *   3. o OTP já expirou.
 *
 * NÃO altera nenhum dado — apenas SELECT.
 */

import "dotenv/config";

import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL não está configurada.");
  process.exit(1);
}

const host = new URL(databaseUrl).host;

console.log("Base de dados:", host);
console.log("==========================================");

const pool = new pg.Pool({
  connectionString: databaseUrl,
  max: 1,
  connectionTimeoutMillis: 10_000,
});

try {
  const users = await pool.query(
    `SELECT id, email, email_verified, created_at
       FROM "user"
      ORDER BY created_at DESC
      LIMIT 8`,
  );

  console.log("\nÚltimos utilizadores Better Auth:");
  for (const u of users.rows) {
    console.log(
      `  - ${u.email} | verificado=${u.email_verified} | criado=${u.created_at?.toISOString?.() ?? u.created_at}`,
    );
  }

  if (users.rows.length === 0) {
    console.log("  (nenhum utilizador)");
  }

  const verifications = await pool.query(
    `SELECT identifier, expires_at
       FROM "verification"
      ORDER BY expires_at DESC
      LIMIT 12`,
  );

  console.log("\nÚltimos OTPs armazenados (identifier | expira):");
  for (const v of verifications.rows) {
    const expired =
      v.expires_at < new Date() ? "EXPIRADO" : "válido";
    console.log(`  - ${v.identifier} | ${v.expires_at?.toISOString?.()} | ${expired}`);
  }

  if (verifications.rows.length === 0) {
    console.log("  (nenhum OTP armazenado)");
  }

  const unverified = await pool.query(
    `SELECT count(*)::int AS total
       FROM "user"
      WHERE email_verified = false`,
  );

  console.log(
    `\nUtilizadores NÃO verificados: ${unverified.rows[0]?.total ?? 0}`,
  );
} finally {
  await pool.end();
}
