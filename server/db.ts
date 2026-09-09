import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertProduct, InsertUser, products, stores, storeMembers, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  (['name', 'email', 'loginMethod'] as const).forEach((field) => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = values[field]; } });
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) { values.role = user.role ?? 'admin'; updateSet.role = values.role; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getStoresForUser(userId: number, isAdmin = false) {
  const db = await getDb();
  if (!db) return [];
  if (isAdmin) return db.select().from(stores).orderBy(desc(stores.createdAt));
  return db.select({ store: stores }).from(stores).innerJoin(storeMembers, eq(storeMembers.storeId, stores.id)).where(eq(storeMembers.userId, userId)).orderBy(desc(stores.createdAt));
}

export async function userHasStoreAccess(userId: number, storeId: string, isAdmin = false) {
  if (isAdmin) return true;
  const db = await getDb();
  if (!db) return false;
  const result = await db.select({ id: storeMembers.id }).from(storeMembers).where(and(eq(storeMembers.userId, userId), eq(storeMembers.storeId, storeId))).limit(1);
  return result.length > 0;
}

export async function listProducts(storeId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.storeId, storeId)).orderBy(desc(products.createdAt));
}

export async function insertProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const result = await db.insert(products).values(product);
  return result;
}

export async function archiveProduct(storeId: string, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  return db.update(products).set({ status: "archived", updatedAt: new Date() }).where(and(eq(products.id, productId), eq(products.storeId, storeId)));
}
