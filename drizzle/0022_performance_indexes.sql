-- 0022 — ÍNDICES DE DESEMPENHO (HOMSTEG)
--
-- Índices para as consultas mais frequentes da plataforma:
-- listagens e contagens por loja, verificação de acesso
-- (storeMembers) e categorias por loja.
--
-- Idempotente (IF NOT EXISTS) e não destrutivo: só cria
-- índices, nunca altera dados.

-- Produtos por loja: listagens do dashboard, storefront
-- público (stores.bySlug → listPublicProducts), contagens
-- de uso e agregações do resumo do dashboard.
CREATE INDEX IF NOT EXISTS "products_store_id_idx"
  ON "products" ("storeId");

-- Verificação de acesso em TODA mutation/query protegida
-- (userHasStoreAccess: WHERE userId = ? AND storeId = ?).
CREATE INDEX IF NOT EXISTS "store_members_user_store_idx"
  ON "storeMembers" ("userId", "storeId");

-- Listagem de membros por loja (admin, delete de loja,
-- memberships por loja).
CREATE INDEX IF NOT EXISTS "store_members_store_id_idx"
  ON "storeMembers" ("storeId");

-- Categorias por loja (selector de produtos, personalização).
CREATE INDEX IF NOT EXISTS "store_categories_store_id_idx"
  ON "store_categories" ("storeId");
