CREATE TABLE "store_categories" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"storeId" varchar(64) NOT NULL,
	"name" varchar(80) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" DROP NOT NULL;