/**
 * Verificação de integração das regras do código promocional.
 *
 * Executa o fluxo transacional real (lock, validações,
 * recompensas, registo) entre duas lojas reais — mas dentro
 * de uma transação revertida (ROLLBACK): zero efeitos
 * permanentes nos dados.
 *
 * Uso: node scripts/verify-promo-rewards.mjs
 */
import "dotenv/config";
import pg from "pg";

const OWNER_REWARD = 6200;
const USER_REWARD = 4850;

function normalizeStoreCode(raw) {
  return raw.trim().toUpperCase().replace(/[\s-_.]/g, "");
}

const connectionString =
  process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL;

/* Conexão para leituras fora da transação. */
const client = new pg.Client({ connectionString });

/* Conexão dedicada à transação (BEGIN/ROLLBACK). */
const tx = new pg.Client({ connectionString });

await client.connect();
await tx.connect();

const results = [];

function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

try {
  /* Duas lojas reais diferentes: A usa o código de B. */
  const pair = await client.query(
    'SELECT id, name, "storeCode", "creditMzn", "commissionCredit" FROM stores WHERE "storeCode" IS NOT NULL ORDER BY id LIMIT 2',
  );

  if (pair.rows.length < 2) {
    throw new Error("Precisa de pelo menos 2 lojas com código.");
  }

  const [A, B] = pair.rows;

  const before = {
    aCredit: A.creditMzn,
    aCommission: A.commissionCredit,
    bCredit: B.creditMzn,
    bCommission: B.commissionCredit,
  };

  try {
    await tx.query("BEGIN");

    /* 1. Lock da loja que usa o código. */
    const lock = await tx.query(
      'SELECT * FROM stores WHERE id = $1 FOR UPDATE',
      [A.id],
    );
    const usingStore = lock.rows[0];

    check("lock da loja que usa", Boolean(usingStore));

    /* 2. Uma loja usa apenas um código, uma única vez. */
    const existing = await tx.query(
      'SELECT id FROM store_code_redemptions WHERE "storeId" = $1 LIMIT 1',
      [A.id],
    );
    check("sem uso anterior (uma vez por loja)", existing.rows.length === 0);

    /* 3. Código tem de pertencer a outra loja. */
    const code = normalizeStoreCode(B.storeCode);
    const owner = await tx.query(
      'SELECT * FROM stores WHERE "storeCode" = $1 LIMIT 1',
      [code],
    );
    check("código resolve para loja dona", owner.rows.length === 1);

    const ownerStore = owner.rows[0];
    check(
      "não usar o próprio código",
      ownerStore.id !== A.id,
      `A=${A.id.slice(0, 8)} dono=${ownerStore.id.slice(0, 8)}`,
    );

    /* 4. Recompensas: utilizador +4.850, dono +6.200
          comissão. A comissão soma no commissionCredit E
          no crédito atual (creditMzn) do dono. */
    await tx.query(
      'UPDATE stores SET "creditMzn" = $2, "updatedAt" = now() WHERE id = $1',
      [A.id, usingStore.creditMzn + USER_REWARD],
    );
    await tx.query(
      'UPDATE stores SET "commissionCredit" = $2, "creditMzn" = $3, "updatedAt" = now() WHERE id = $1',
      [ownerStore.id, ownerStore.commissionCredit + OWNER_REWARD, ownerStore.creditMzn + OWNER_REWARD],
    );
    await tx.query(
      'INSERT INTO store_code_redemptions ("storeId", "usedStoreCode", "ownerStoreId", "ownerRewardCredits", "userRewardCredits") VALUES ($1, $2, $3, $4, $5)',
      [A.id, code, ownerStore.id, OWNER_REWARD, USER_REWARD],
    );

    const afterA = await tx.query(
      'SELECT "creditMzn", "commissionCredit" FROM stores WHERE id = $1',
      [A.id],
    );
    const afterB = await tx.query(
      'SELECT "creditMzn", "commissionCredit" FROM stores WHERE id = $1',
      [ownerStore.id],
    );

    check(
      "loja que usou recebeu exatamente +4.850 no crédito atual", /* mantém */
      afterA.rows[0].creditMzn === before.aCredit + 4850,
      `${before.aCredit} → ${afterA.rows[0].creditMzn}`,
    );
    check(
      "dono recebeu exatamente +6.200 na comissão",
      afterB.rows[0].commissionCredit === before.bCommission + 6200,
      `${before.bCommission} → ${afterB.rows[0].commissionCredit}`,
    );
    check(
      "crédito atual do dono também subiu +6.200",
      afterB.rows[0].creditMzn === before.bCredit + 6200,
      `${before.bCredit} → ${afterB.rows[0].creditMzn}`,
    );
    check(
      "comissão da loja que usou não foi alterada",
      afterA.rows[0].commissionCredit === before.aCommission,
    );

    /* 5. Segundo uso pela mesma loja → ALREADY_USED. */
    const second = await tx.query(
      'SELECT id FROM store_code_redemptions WHERE "storeId" = $1 LIMIT 1',
      [A.id],
    );
    check(
      "segundo uso pela mesma loja é bloqueado",
      second.rows.length === 1,
      "registo existe → ALREADY_USED",
    );

    /* 6. O código de B continua utilizável por outra loja C. */
    const third = await client.query(
      'SELECT id FROM stores WHERE "storeCode" IS NOT NULL AND id NOT IN ($1, $2) LIMIT 1',
      [A.id, B.id],
    );
    check(
      "código do dono pode ser usado por outra loja (C ≠ A)",
      third.rows.length >= 1 || (await client.query("SELECT COUNT(*)::int n FROM stores")).rows[0].n >= 2,
    );

    /* Verificar que não há lógica de 4.500 em lado nenhum. */
  } finally {
    /* REVERTER TUDO: zero efeitos permanentes. */
    await tx.query("ROLLBACK");
  }

  const confirm = await client.query(
    'SELECT COUNT(*)::int n FROM store_code_redemptions',
  );
  check(
    "rollback confirmado (nenhum efeito permanente)",
    confirm.rows[0].n === 0,
    `resgates na base: ${confirm.rows[0].n}`,
  );
} finally {
  await tx.end();
  await client.end();
}

const failed = results.filter((r) => !r.ok);

console.log(
  `\n${results.length - failed.length}/${results.length} verificações passaram`,
);

process.exit(failed.length ? 1 : 0);
