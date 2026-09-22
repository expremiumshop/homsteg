ALTER TABLE "twoFactor"
ALTER COLUMN "failed_verification_count" DROP DEFAULT;
--> statement-breakpoint

ALTER TABLE "twoFactor"
ALTER COLUMN "failed_verification_count" TYPE integer
USING "failed_verification_count"::integer;
--> statement-breakpoint

ALTER TABLE "twoFactor"
ALTER COLUMN "failed_verification_count" SET DEFAULT 0;
--> statement-breakpoint

UPDATE "user"
SET "two_factor_enabled" = true
WHERE "two_factor_enabled" = false;