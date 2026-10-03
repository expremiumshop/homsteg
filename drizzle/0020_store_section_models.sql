ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "headerModel" varchar(8);--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "footerModel" varchar(8);--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "categoryCardModel" varchar(8);
