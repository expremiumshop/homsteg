import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const plans = mysqlTable("plans", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  priceMzn: int("priceMzn").notNull().default(0),
  productLimit: int("productLimit").notNull().default(10),
  status: mysqlEnum("status", ["active", "archived"]).notNull().default("active"),
  features: text("features").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const stores = mysqlTable("stores", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  category: varchar("category", { length: 80 }).notNull().default("General"),
  planKey: varchar("planKey", { length: 32 }).notNull().default("free"),
  status: mysqlEnum("status", ["draft", "active", "suspended"]).notNull().default("draft"),
  currency: varchar("currency", { length: 8 }).notNull().default("MZN"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const storeMembers = mysqlTable("storeMembers", {
  id: int("id").autoincrement().primaryKey(),
  storeId: varchar("storeId", { length: 64 }).notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["owner", "manager", "staff"]).notNull().default("owner"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  storeId: varchar("storeId", { length: 64 }).notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull(),
  description: text("description"),
  priceMzn: int("priceMzn").notNull(),
  compareAtPriceMzn: int("compareAtPriceMzn"),
  sku: varchar("sku", { length: 80 }),
  stock: int("stock").notNull().default(0),
  category: varchar("category", { length: 80 }).notNull().default("General"),
  status: mysqlEnum("status", ["draft", "active", "archived"]).notNull().default("draft"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
