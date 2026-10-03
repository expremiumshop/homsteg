/**
 * Backfill do código exclusivo da loja (migração 0023).
 *
 * Toda loja existente sem "storeCode" recebe um código
 * único de 8 caracteres (alfabeto sem caracteres ambíguos:
 * sem 0/O/1/I/L). Verifica colisões na base de dados antes
 * de gravar; repete em caso de colisão.
 *
 * Idempotente: só toca em lojas com storeCode IS NULL.
 * Uso: node scripts/backfill-store-codes.mjs
 */
import "dotenv/config";
import pg from "pg";

/* Mesmo alfabeto/length de server/store-code.ts. */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 8;

/* Webcrypto no Node (ou fallback node:crypto). */
if (!globalThis.crypto) {
  globalThis.crypto = (await import("node:crypto")).webcrypto;
}

function randomCode() {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

const client = new pg.Client({
  connectionString:
    process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL,
});

await client.connect();

try {
  const missing = await client.query(
    'SELECT id FROM "stores" WHERE "storeCode" IS NULL',
  );

  console.log(`Lojas sem código: ${missing.rows.length}`);

  let updated = 0;

  for (const { id } of missing.rows) {
    /* Tenta até encontrar um código livre (colisão é rara:
       32^8 ≈ 1 bilião de combinações). */
    for (let attempt = 0; attempt < 10; attempt++) {
      const code = randomCode();

      const exists = await client.query(
        'SELECT 1 FROM "stores" WHERE "storeCode" = $1 LIMIT 1',
        [code],
      );

      if (exists.rows.length > 0) {
        continue;
      }

      const result = await client.query(
        'UPDATE "stores" SET "storeCode" = $1, "updatedAt" = now() WHERE id = $2 AND "storeCode" IS NULL',
        [code, id],
      );

      if (result.rowCount > 0) {
        updated++;
        break;
      }
    }
  }

  console.log(`Códigos atribuídos: ${updated}`);
} finally {
  await client.end();
}
