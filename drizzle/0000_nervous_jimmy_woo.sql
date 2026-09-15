CREATE TYPE "public"."application_status" AS ENUM('pending', 'approved', 'rejected', 'changes_requested');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."store_member_role" AS ENUM('owner', 'manager', 'staff');--> statement-breakpoint
CREATE TYPE "public"."store_status" AS ENUM('draft', 'active', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "plans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" varchar(32) NOT NULL,
	"name" varchar(80) NOT NULL,
	"priceMzn" integer DEFAULT 0 NOT NULL,
	"productLimit" integer DEFAULT 10 NOT NULL,
	"status" "plan_status" DEFAULT 'active' NOT NULL,
	"features" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "plans_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"storeId" varchar(64) NOT NULL,
	"name" varchar(180) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"description" text,
	"priceMzn" integer NOT NULL,
	"compareAtPriceMzn" integer,
	"sku" varchar(80),
	"stock" integer DEFAULT 0 NOT NULL,
	"category" varchar(80) DEFAULT 'General' NOT NULL,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storeApplications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "storeApplications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"businessTypes" text,
	"fullName" varchar(160) NOT NULL,
	"username" varchar(80) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"alternativePhone" varchar(40),
	"whatsapp" varchar(40),
	"country" varchar(80) NOT NULL,
	"province" varchar(100),
	"district" varchar(100),
	"neighborhood" varchar(120),
	"storeName" varchar(120) NOT NULL,
	"storeSlug" varchar(120) NOT NULL,
	"notes" text,
	"adminNotes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "storeMembers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "storeMembers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"storeId" varchar(64) NOT NULL,
	"userId" integer NOT NULL,
	"role" "store_member_role" DEFAULT 'owner' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"category" varchar(80) DEFAULT 'General' NOT NULL,
	"planKey" varchar(32) DEFAULT 'free' NOT NULL,
	"status" "store_status" DEFAULT 'draft' NOT NULL,
	"currency" varchar(8) DEFAULT 'MZN' NOT NULL,
	"themeKey" varchar(32),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"passwordHash" varchar(255),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
