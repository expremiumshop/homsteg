-- Custom domain ownership and DNS verification (manual deployment migration).
ALTER TABLE "stores"
  ADD COLUMN IF NOT EXISTS "customDomain" varchar(253),
  ADD COLUMN IF NOT EXISTS "customDomainVerificationToken" varchar(64),
  ADD COLUMN IF NOT EXISTS "customDomainVerifiedAt" timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS "stores_custom_domain_unique"
  ON "stores" ("customDomain");
