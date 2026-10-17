-- 0028 — PREÇO, STOCK E SKU POR VARIANTE (HOMSTEG)
--
-- O painel já permitia configurar opções (variantes) nos
-- produtos, mas preço, stock e SKU por combinação não tinham
-- onde ser guardados — a escolha do merchant era
-- silenciosamente perdida e a variante ficava sempre com os
-- valores do produto.
--
-- Idempotente e não destrutivo:
--   - IF NOT EXISTS: reaplicar a migração não falha;
--   - o DEFAULT '[]' preenche os produtos JÁ existentes no
--     momento do ALTER, por isso NÃO é preciso UPDATE de
--     backfill e nenhum dado existente é tocado.

ALTER TABLE "products"
ADD COLUMN IF NOT EXISTS "variants" jsonb NOT NULL DEFAULT '[]'::jsonb;
