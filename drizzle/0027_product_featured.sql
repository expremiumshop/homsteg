-- 0027 — PRODUTO EM DESTAQUE (HOMSTEG)
--
-- A opção "Produto em destaque" existia na UI
-- (Visibilidade, nos modais de criar/editar) mas não
-- tinha onde ser guardada na base de dados, pelo que a
-- escolha do merchant era silenciosamente perdida.
--
-- Idempotente e não destrutivo:
--   - IF NOT EXISTS: reaplicar a migração não falha;
--   - o DEFAULT false preenche os produtos JÁ existentes
--     no momento do ALTER (Postgres 11+ aplica sem
--     reescrever a tabela), por isso NÃO é preciso UPDATE
--     de backfill e nenhum dado é tocado.

ALTER TABLE "products"
ADD COLUMN IF NOT EXISTS "featured" boolean NOT NULL DEFAULT false;
