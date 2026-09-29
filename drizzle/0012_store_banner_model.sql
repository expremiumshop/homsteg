ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "bannerModel" varchar(8);--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "bannerTexts" jsonb NOT NULL DEFAULT '[]'::jsonb;