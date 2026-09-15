import { randomUUID } from "crypto";

import { clerkClient } from "@clerk/express";

import bcrypt from "bcryptjs";

import { and, desc, eq, ne } from "drizzle-orm";

import { drizzle } from "drizzle-orm/node-postgres";

import { Pool } from "pg";

import {
  InsertProduct,
  InsertStoreApplication,
  InsertUser,
  products,
  plans,
  storeApplications,
  stores,
  storeMembers,
  users,
} from "../drizzle_old/schema";

import { ENV } from "./_core/env";

let pool: Pool | null = null;

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);

      pool = null;
      _db = null;
    }
  }

  return _db;
}

/* ============================================================
   USERS
   ============================================================ */

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();

  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");

    return;
  }

  const values: InsertUser = {
    openId: user.openId,
    lastSignedIn: user.lastSignedIn ?? new Date(),
  };

  const updateSet: Record<string, unknown> = {
    lastSignedIn: values.lastSignedIn,
  };

  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = values[field];
    }
  });

  if (user.role !== undefined || user.openId === ENV.ownerOpenId) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }

  await db.insert(users).values(values).onConflictDoUpdate({
    target: users.openId,
    set: updateSet,
  });
}

/**
 * Synchronizes the minimal profile supplied by a verified Clerk webhook.
 * This avoids waiting for the user to make an authenticated app request
 * before the account is visible in the Neon-backed Admin area.
 */
export async function syncClerkUser({
  clerkUserId,
  email,
  name,
}: {
  clerkUserId: string;
  email: string | null;
  name: string | null;
}): Promise<void> {
  await upsertUser({
    openId: clerkUserId,
    email,
    name,
    loginMethod: "clerk",
    lastSignedIn: new Date(),
  });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result[0];
}

/**
 * Procura um utilizador pelo e-mail.
 *
 * O e-mail é normalizado para minúsculas para evitar
 * contas duplicadas por diferença de maiúsculas/minúsculas.
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const normalizedEmail = email.toLowerCase().trim();

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  return result[0];
}

/**
 * Procura ou cria o utilizador local do Neon
 * correspondente ao utilizador autenticado pelo Clerk.
 */
export async function getOrCreateClerkUser(clerkUserId: string) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  // The Clerk user id is the source of identity. OWNER_OPEN_ID must contain
  // that exact `user_...` id, never an e-mail address or the Neon numeric id.
  const isConfiguredOwner =
    ENV.ownerOpenId.length > 0 && clerkUserId === ENV.ownerOpenId;

  // 1. Tenta encontrar diretamente pelo ID do Clerk.
  const existingByClerkId = await getUserByOpenId(clerkUserId);

  if (existingByClerkId) {
    // Accounts created before Clerk was introduced already exist in Neon. On
    // every sign-in, reconcile the configured owner role so an existing row
    // cannot remain incorrectly marked as a regular user.
    if (isConfiguredOwner && existingByClerkId.role !== "admin") {
      const result = await db
        .update(users)
        .set({
          role: "admin",
          lastSignedIn: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingByClerkId.id))
        .returning();

      return result[0] ?? existingByClerkId;
    }

    await updateUserLastSignedIn(existingByClerkId.id);

    return existingByClerkId;
  }

  // 2. Obtém os dados atuais do utilizador no Clerk.
  const clerkUser = await clerkClient.users.getUser(clerkUserId);

  const email =
    clerkUser.primaryEmailAddress?.emailAddress?.toLowerCase().trim() ?? null;

  const name =
    [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || null;

  // 3. Se já existir no Neon pelo mesmo e-mail,
  // associa essa conta ao Clerk.
  if (email) {
    const existingByEmail = await getUserByEmail(email);

    if (existingByEmail) {
      const result = await db
        .update(users)
        .set({
          openId: clerkUserId,
          name,
          email,
          loginMethod: "clerk",
          // Preserve an existing manual admin role. Only the configured owner
          // is elevated automatically.
          role: isConfiguredOwner ? "admin" : existingByEmail.role,
          lastSignedIn: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingByEmail.id))
        .returning();

      return result[0];
    }
  }

  // 4. Primeiro login de um novo utilizador.
  const result = await db
    .insert(users)
    .values({
      openId: clerkUserId,
      name,
      email,
      loginMethod: "clerk",
      role: isConfiguredOwner ? "admin" : "user",
      lastSignedIn: new Date(),
    })
    .returning();

  return result[0];
}

/**
 * Cria uma conta utilizando e-mail e palavra-passe.
 *
 * LEGACY:
 * Esta função será removida depois que a autenticação
 * Clerk estiver totalmente confirmada.
 */
export async function createCredentialsUser(email: string, password: string) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const openId = `credentials_${randomUUID()}`;

  const result = await db
    .insert(users)
    .values({
      openId,
      email: normalizedEmail,
      passwordHash,
      loginMethod: "email",
      role: "user",
      lastSignedIn: new Date(),
    })
    .returning();

  return result[0];
}

/**
 * Verifica e-mail + palavra-passe.
 *
 * LEGACY:
 * Esta função será removida depois que a autenticação
 * Clerk estiver totalmente confirmada.
 */
export async function verifyUserPassword(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user || !user.passwordHash) {
    return undefined;
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    return undefined;
  }

  await updateUserLastSignedIn(user.id);

  return user;
}

/**
 * Atualiza a data do último login.
 */
async function updateUserLastSignedIn(userId: number) {
  const db = await getDb();

  if (!db) {
    return;
  }

  await db
    .update(users)
    .set({
      lastSignedIn: new Date(),
    })
    .where(eq(users.id, userId));
}

/* ============================================================
   STORES
   ============================================================ */

export async function getStoresForUser(userId: number, isAdmin = false) {
  const db = await getDb();

  if (!db) {
    return [];
  }

  if (isAdmin) {
    return db.select().from(stores).orderBy(desc(stores.createdAt));
  }

  return db
    .select({
      store: stores,
    })
    .from(stores)
    .innerJoin(storeMembers, eq(storeMembers.storeId, stores.id))
    .where(eq(storeMembers.userId, userId))
    .orderBy(desc(stores.createdAt));
}

/**
 * Creates an active store and its owner membership atomically. Retries by the
 * same owner are safe; another user cannot claim an existing slug.
 */
export async function createStoreForUser({
  userId,
  name,
  slug,
}: {
  userId: number;
  name: string;
  slug: string;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  return db.transaction(async tx => {
    const existingStore = await tx
      .select()
      .from(stores)
      .where(eq(stores.slug, slug))
      .limit(1);

    if (existingStore[0]) {
      const membership = await tx
        .select({ id: storeMembers.id })
        .from(storeMembers)
        .where(
          and(
            eq(storeMembers.storeId, existingStore[0].id),
            eq(storeMembers.userId, userId),
          ),
        )
        .limit(1);

      if (membership[0]) {
        return existingStore[0];
      }

      throw new Error("STORE_SLUG_ALREADY_EXISTS");
    }

    const id = randomUUID();
    const created = await tx
      .insert(stores)
      .values({
        id,
        name,
        slug,
        category: "General",
        planKey: "free",
        status: "active",
        currency: "MZN",
        themeKey: "nova",
      })
      .returning();

    await tx.insert(storeMembers).values({
      storeId: id,
      userId,
      role: "owner",
    });

    return created[0];
  });
}

/**
 * Dados administrativos normalizados por utilizador. A lista preserva todas
 * as lojas do mesmo utilizador, pois uma conta pode ser proprietária ou
 * membro de várias lojas.
 */
export async function getAdminUsers() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  const [allUsers, applications, memberships] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)),
    db
      .select()
      .from(storeApplications)
      .orderBy(desc(storeApplications.createdAt)),
    db
      .select({
        membership: storeMembers,
        store: stores,
        plan: plans,
      })
      .from(storeMembers)
      .innerJoin(stores, eq(storeMembers.storeId, stores.id))
      .leftJoin(plans, eq(stores.planKey, plans.key)),
  ]);

  const latestApplicationByUser = new Map<
    number,
    (typeof applications)[number]
  >();
  for (const application of applications) {
    if (!latestApplicationByUser.has(application.userId)) {
      latestApplicationByUser.set(application.userId, application);
    }
  }

  const storesByUser = new Map<number, typeof memberships>();
  for (const membership of memberships) {
    const userStores = storesByUser.get(membership.membership.userId) ?? [];
    userStores.push(membership);
    storesByUser.set(membership.membership.userId, userStores);
  }

  return allUsers.map(user => ({
    user,
    latestApplication: latestApplicationByUser.get(user.id) ?? null,
    stores: (storesByUser.get(user.id) ?? []).map(
      ({ membership, store, plan }) => ({
        store,
        role: membership.role,
        plan,
      })
    ),
  }));
}

/**
 * Planos configurados e respetiva utilização por lojas. A associação é
 * sempre feita por stores.planKey -> plans.key.
 */
export async function getAdminPlans() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  const [allPlans, allStores] = await Promise.all([
    db.select().from(plans).orderBy(plans.priceMzn),
    db.select({ planKey: stores.planKey }).from(stores),
  ]);

  const usageByPlanKey = new Map<string, number>();
  for (const store of allStores) {
    usageByPlanKey.set(
      store.planKey,
      (usageByPlanKey.get(store.planKey) ?? 0) + 1
    );
  }

  return allPlans.map(plan => ({
    plan,
    storeCount: usageByPlanKey.get(plan.key) ?? 0,
  }));
}

export async function userHasStoreAccess(
  userId: number,
  storeId: string,
  isAdmin = false
) {
  if (isAdmin) {
    return true;
  }

  const db = await getDb();

  if (!db) {
    return false;
  }

  const result = await db
    .select({
      id: storeMembers.id,
    })
    .from(storeMembers)
    .where(
      and(eq(storeMembers.userId, userId), eq(storeMembers.storeId, storeId))
    )
    .limit(1);

  return result.length > 0;
}

/**
 * Procura uma loja pública pelo slug.
 *
 * IMPORTANTE:
 * Esta função NÃO depende do utilizador autenticado.
 *
 * É utilizada pelo storefront público:
 *
 * /store/minha-loja
 *       ↓
 * stores.slug = "minha-loja"
 */
export async function getPublicStoreBySlug(slug: string) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const normalizedSlug = slug.trim().toLowerCase();

  const result = await db
    .select()
    .from(stores)
    .where(and(eq(stores.slug, normalizedSlug), eq(stores.status, "active")))
    .limit(1);

  return result[0];
}

/**
 * Atualiza o tema escolhido para uma loja.
 */
export async function updateStoreTheme(storeId: string, themeKey: string) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const result = await db
    .update(stores)
    .set({
      themeKey,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  return result[0];
}

/* ============================================================
   PRODUCTS
   ============================================================ */

export async function listProducts(storeId: string) {
  const db = await getDb();

  if (!db) {
    return [];
  }

  return db
    .select()
    .from(products)
    .where(eq(products.storeId, storeId))
    .orderBy(desc(products.createdAt));
}

/**
 * Lista produtos públicos de uma loja.
 *
 * A loja já foi localizada pelo slug antes desta função
 * ser chamada.
 *
 * O filtro por storeId garante isolamento entre lojas.
 *
 * Mantemos draft visível porque o storefront atual do Nova
 * já trata draft como produto não arquivado. Apenas produtos
 * archived ficam fora da vitrine.
 */
export async function listPublicProducts(storeId: string) {
  const db = await getDb();

  if (!db) {
    return [];
  }

  return db
    .select()
    .from(products)
    .where(and(eq(products.storeId, storeId), ne(products.status, "archived")))
    .orderBy(desc(products.createdAt));
}

export async function insertProduct(product: InsertProduct) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const result = await db.insert(products).values(product).returning();

  return result[0];
}

export async function archiveProduct(storeId: string, productId: number) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  return db
    .update(products)
    .set({
      status: "archived",
      updatedAt: new Date(),
    })
    .where(and(eq(products.id, productId), eq(products.storeId, storeId)));
}

/* ============================================================
   STORE APPLICATIONS
   ============================================================ */

export async function createStoreApplication(
  application: InsertStoreApplication
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const result = await db
    .insert(storeApplications)
    .values({
      ...application,
      status: "pending",
    })
    .returning();

  return result[0];
}

export async function getStoreApplicationByUserId(userId: number) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const result = await db
    .select()
    .from(storeApplications)
    .where(eq(storeApplications.userId, userId))
    .orderBy(desc(storeApplications.createdAt))
    .limit(1);

  return result[0];
}

export async function getStoreApplications() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  return db
    .select()
    .from(storeApplications)
    .orderBy(desc(storeApplications.createdAt));
}

export async function getStoreApplicationById(id: number) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const result = await db
    .select()
    .from(storeApplications)
    .where(eq(storeApplications.id, id))
    .limit(1);

  return result[0];
}

export async function updateStoreApplicationStatus(
  id: number,
  status: "pending" | "approved" | "rejected" | "changes_requested",
  adminNotes?: string
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  return db
    .update(storeApplications)
    .set({
      status,
      adminNotes: adminNotes ?? null,
      reviewedAt: status === "pending" ? null : new Date(),
      updatedAt: new Date(),
    })
    .where(eq(storeApplications.id, id));
}

/**
 * Cria uma loja a partir de uma candidatura aprovada.
 *
 * IMPORTANTE:
 * Uma loja pertence ao utilizador através de storeMembers.
 *
 * Se o slug já existir:
 * - Se a loja pertencer ao mesmo utilizador, devolve a loja existente.
 * - Se pertencer a outro utilizador, bloqueia a operação.
 */
export async function createStoreFromApplication(
  applicationId: number,
  adminNotes?: string
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  return db.transaction(async tx => {
    const applicationResult = await tx
      .select()
      .from(storeApplications)
      .where(eq(storeApplications.id, applicationId))
      .limit(1);

    const application = applicationResult[0];

    if (!application) {
      throw new Error("APPLICATION_NOT_FOUND");
    }

    if (
      application.status !== "pending" &&
      application.status !== "changes_requested" &&
      application.status !== "approved"
    ) {
      throw new Error("APPLICATION_NOT_APPROVABLE");
    }

    const existingStoreResult = await tx
      .select()
      .from(stores)
      .where(eq(stores.slug, application.storeSlug))
      .limit(1);

    if (existingStoreResult.length > 0) {
      const existingStore = existingStoreResult[0];
      const existingMembership = await tx
        .select({ id: storeMembers.id })
        .from(storeMembers)
        .where(
          and(
            eq(storeMembers.storeId, existingStore.id),
            eq(storeMembers.userId, application.userId)
          )
        )
        .limit(1);

      if (existingMembership.length === 0) {
        throw new Error("STORE_SLUG_ALREADY_EXISTS");
      }

      // Safe retry: the real store and its real owner relationship already
      // exist, so only complete the application state.
      if (application.status !== "approved") {
        await tx
          .update(storeApplications)
          .set({
            status: "approved",
            adminNotes: adminNotes ?? null,
            reviewedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(storeApplications.id, applicationId));
      }

      return existingStore;
    }

    const storeId = randomUUID();

    // Store, ownership and approval are one transaction. A failure cannot
    // leave an approved application without its corresponding store.
    const createdStoreResult = await tx
      .insert(stores)
      .values({
        id: storeId,
        name: application.storeName,
        slug: application.storeSlug,
        category: "General",
        planKey: "free",
        status: "active",
        currency: "MZN",
        themeKey: "nova",
      })
      .returning();

    await tx.insert(storeMembers).values({
      storeId,
      userId: application.userId,
      role: "owner",
    });

    await tx
      .update(storeApplications)
      .set({
        status: "approved",
        adminNotes: adminNotes ?? null,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(storeApplications.id, applicationId));

    return createdStoreResult[0];
  });
}
