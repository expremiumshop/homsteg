-- 0024 — RECOMPENSAS DO CÓDIGO PROMOCIONAL (HOMSTEG)
--
-- Quando uma loja utiliza o código promocional de outra
-- loja (uma única vez por loja):
--
--   - Dono do código:            +6.200 créditos de COMISSÃO
--                                (stores.commissionCredit),
--                                somados também ao crédito
--                                atual (stores.creditMzn);
--   - Loja que inseriu o código: +4.850 créditos
--                                (stores.creditMzn).
--
-- Regras garantidas pela estrutura:
--   - cada loja usa no MÁXIMO um código (linha única por
--     storeId, índice único);
--   - o mesmo uso nunca é recompensado duas vezes
--     (índice único storeId + usedStoreCode);
--   - uma loja NUNCA usa o próprio código (validação no
--     servidor, na mutation);
--   - o código do dono continua utilizável por várias
--     outras lojas (só o par storeId+usedStoreCode é único).
--
-- Idempotente e não destrutivo.

CREATE TABLE IF NOT EXISTS "store_code_redemptions" (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  /* Loja que utilizou o código (quem recebe 4.850). */
  "storeId" varchar(64) NOT NULL,

  /* Código promocional utilizado (código de OUTRA loja). */
  "usedStoreCode" varchar(16) NOT NULL,

  /* Loja dona do código (quem recebe 6.200 de comissão). */
  "ownerStoreId" varchar(64) NOT NULL,

  /* Recompensas registadas no momento do uso (créditos). */
  "ownerRewardCredits" integer NOT NULL DEFAULT 6200,
  "userRewardCredits" integer NOT NULL DEFAULT 4850,

  "createdAt" timestamp with time zone NOT NULL DEFAULT now(),

  /* Um uso por loja: nunca duplicar recompensas. */
  CONSTRAINT "store_code_redemptions_store_unique" UNIQUE ("storeId")
);

/* Consulta rápida: quantas lojas usaram o código de X. */
CREATE INDEX IF NOT EXISTS "store_code_redemptions_owner_idx"
  ON "store_code_redemptions" ("ownerStoreId");
