-- Saldo inicial de créditos (HOMSTEG).
--
-- Os créditos são a unidade interna da plataforma
-- para desbloqueio de funcionalidades no Market —
-- não são dinheiro nem moeda.
--
-- Toda loja começa automaticamente com 100.000
-- créditos gratuitos.

-- 1. Novas lojas nascem com 100.000 créditos.
ALTER TABLE "stores" ALTER COLUMN "creditMzn" SET DEFAULT 100000;

-- 2. Backfill seguro das lojas existentes: nenhuma
--    fica abaixo de 100.000 créditos. Saldos já
--    maiores não são alterados; nenhum outro dado
--    é tocado.
UPDATE "stores" SET "creditMzn" = 100000 WHERE "creditMzn" < 100000;
