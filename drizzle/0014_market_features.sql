-- 0014 — MARKET FEATURES
-- Catálogo comercial do módulo MARKET: funcionalidades de
-- personalização da loja (header, banner, category-card,
-- product-card, footer) com preço em créditos, administráveis
-- pelo Admin. O Market vende FUNCIONALIDADES, nunca produtos
-- físicos.

DO $$ BEGIN
  CREATE TYPE "market_feature_status" AS ENUM ('active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "market_category" AS ENUM (
    'header', 'banner', 'category_card', 'product_card', 'footer'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "market_features" (
  "id" varchar(64) PRIMARY KEY NOT NULL,
  "name" varchar(120) NOT NULL,
  "description" text NOT NULL,
  "category" "market_category" NOT NULL,
  "priceCredits" integer NOT NULL DEFAULT 0,
  "status" "market_feature_status" NOT NULL DEFAULT 'active',
  "featureKey" varchar(64) NOT NULL,
  "sortOrder" integer NOT NULL DEFAULT 0,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "market_features_feature_key_idx"
  ON "market_features" ("featureKey");
