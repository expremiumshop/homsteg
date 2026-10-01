CREATE TABLE IF NOT EXISTS "store_market_features" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"storeId" varchar(64) NOT NULL,
	"featureKey" varchar(64) NOT NULL,
	"priceCredits" integer DEFAULT 0 NOT NULL,
	"purchasedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "store_market_features_store_feature_idx" ON "store_market_features" USING btree ("storeId","featureKey");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_market_features_store_id_idx" ON "store_market_features" USING btree ("storeId");
