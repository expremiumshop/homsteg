ALTER TYPE "market_category" ADD VALUE IF NOT EXISTS 'nav_button';--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "navButtonModel" varchar(8);
