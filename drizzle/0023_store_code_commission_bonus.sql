-- 0023 — CÓDIGO DA LOJA, COMISSÃO E BÔNUS (HOMSTEG)
--
-- Cada loja recebe automaticamente um código exclusivo
-- (aproximadamente 8 caracteres) que pertence a essa loja.
-- O proprietário pode partilhá-lo para convidar outras
-- pessoas; um código pode ser utilizado por várias lojas.
--
-- Crédito de comissão e crédito de bônus são saldos
-- próprios da loja (unidade interna "créditos", nunca
-- moeda) e nascem a 0, como o crédito atual.
--
-- Idempotente e não destrutivo.

-- 1. Saldos próprios de comissão e bônus (em créditos).
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "commissionCredit" integer NOT NULL DEFAULT 0;
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "bonusCredit" integer NOT NULL DEFAULT 0;

-- 2. Código exclusivo da loja (~8 caracteres). NULL durante
--    o backfill; torna-se NOT NULL depois de preenchido.
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "storeCode" varchar(16);

-- 3. O código é exclusivo por loja (índice único). Criado
--    já aqui: o backfill abaixo garante valores distintos
--    antes de qualquer nova escrita concorrente.
CREATE UNIQUE INDEX IF NOT EXISTS "stores_store_code_unique"
  ON "stores" ("storeCode");

-- 4. Backfill: feito pelo script scripts/backfill-store-codes.mjs
--    (código gerado no servidor com verificação de colisão).
--    Nenhum UPDATE automático aqui: o código é atribuído por
--    script idempotente, nunca aleatório dentro da migração.
