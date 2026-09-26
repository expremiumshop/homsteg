CREATE TYPE "public"."plan_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "planRequests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "planRequests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"storeId" varchar(64) NOT NULL,
	"requestedPlanKey" varchar(32) NOT NULL,
	"currentPlanKey" varchar(32) NOT NULL,
	"productsUsed" integer DEFAULT 0 NOT NULL,
	"status" "plan_request_status" DEFAULT 'pending' NOT NULL,
	"note" text,
	"adminNotes" text,
	"assignedPlanKey" varchar(32),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewedAt" timestamp with time zone
);
