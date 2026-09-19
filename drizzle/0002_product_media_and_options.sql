ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "imageKeys" text[] DEFAULT '{}' NOT NULL,
  ADD COLUMN IF NOT EXISTS "options" jsonb DEFAULT '[]'::jsonb NOT NULL;
