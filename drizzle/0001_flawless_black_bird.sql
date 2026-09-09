CREATE TABLE `plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(32) NOT NULL,
	`name` varchar(80) NOT NULL,
	`priceMzn` int NOT NULL DEFAULT 0,
	`productLimit` int NOT NULL DEFAULT 10,
	`status` enum('active','archived') NOT NULL DEFAULT 'active',
	`features` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `plans_id` PRIMARY KEY(`id`),
	CONSTRAINT `plans_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` varchar(64) NOT NULL,
	`name` varchar(180) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`description` text,
	`priceMzn` int NOT NULL,
	`compareAtPriceMzn` int,
	`sku` varchar(80),
	`stock` int NOT NULL DEFAULT 0,
	`category` varchar(80) NOT NULL DEFAULT 'General',
	`status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storeMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','manager','staff') NOT NULL DEFAULT 'owner',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `storeMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` varchar(64) NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`category` varchar(80) NOT NULL DEFAULT 'General',
	`planKey` varchar(32) NOT NULL DEFAULT 'free',
	`status` enum('draft','active','suspended') NOT NULL DEFAULT 'draft',
	`currency` varchar(8) NOT NULL DEFAULT 'MZN',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stores_id` PRIMARY KEY(`id`),
	CONSTRAINT `stores_slug_unique` UNIQUE(`slug`)
);
