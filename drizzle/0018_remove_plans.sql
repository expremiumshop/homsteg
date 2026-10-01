DROP TABLE "planRequests" CASCADE;--> statement-breakpoint
DROP TABLE "plans" CASCADE;--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "subscriptionPaidUntil";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "subscriptionPaidAt";--> statement-breakpoint
DROP TYPE "public"."plan_request_status";--> statement-breakpoint
DROP TYPE "public"."plan_status";