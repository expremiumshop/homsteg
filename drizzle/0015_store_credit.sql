-- 0015 — STORE CREDIT (MZN)
-- Saldo de crédito manual por loja, gerido pelo Admin.
-- NOT NULL com default 0: lojas existentes começam
-- com "Crédito: 0" no dashboard.
--
-- Nota: as tabelas market_features já são criadas pela
-- migration 0014 (com guards IF NOT EXISTS); esta migration
-- contém apenas a nova coluna de crédito.

ALTER TABLE "stores"
  ADD COLUMN IF NOT EXISTS "creditMzn" integer NOT NULL DEFAULT 0;
