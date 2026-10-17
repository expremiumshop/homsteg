-- 0025 — IDIOMA DA LOJA (HOMSTEG)
--
-- A moeda da loja já existe (stores.currency). Faltava
-- o IDIOMA de exibição da loja pública, escolhido em
-- Configurações → Idioma e moeda.
--
--   "pt" = Português (predefinido)
--   "en" = English
--
-- Idempotente e não destrutivo:
--   - IF NOT EXISTS: reaplicar a migração não falha;
--   - o DEFAULT 'pt' preenche as lojas JÁ existentes no
--     momento do ALTER (Postgres 11+ preenche o valor sem
--     reescrever a tabela), por isso NÃO é preciso nenhum
--     UPDATE de backfill e nenhum dado é tocado.
--
-- O idioma é aplicado pelo i18n do storefront público
-- (client/src/lib/i18n) e gravado pela mutação de settings
-- da loja, a par da moeda.

ALTER TABLE "stores"
ADD COLUMN IF NOT EXISTS "language" varchar(8) NOT NULL DEFAULT 'pt';
