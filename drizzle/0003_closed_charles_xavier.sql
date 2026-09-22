CREATE TABLE "twoFactor" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "secret" text,
  "backup_codes" text,
  "verified" boolean DEFAULT false NOT NULL,
  "failed_verification_count" text DEFAULT '0' NOT NULL,
  "locked_until" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

ALTER TABLE "user"
ADD COLUMN "two_factor_enabled" boolean DEFAULT false NOT NULL;
--> statement-breakpoint

ALTER TABLE "twoFactor"
ADD CONSTRAINT "twoFactor_user_id_user_id_fk"
FOREIGN KEY ("user_id")
REFERENCES "public"."user"("id")
ON DELETE cascade
ON UPDATE no action;
--> statement-breakpoint

CREATE INDEX "twoFactor_userId_idx"
ON "twoFactor" USING btree ("user_id");