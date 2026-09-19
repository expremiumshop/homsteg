import { randomUUID } from "crypto";

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
} from "../drizzle/schema";
import { createStoreDownloadUrl } from "./r2";

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

/**
 * Cria ou atualiza o utilizador de negócio do HOMSTEG.
 *
 * O openId recebe o ID do utilizador do Better Auth.
 *
 * IMPORTANTE:
 * - users.id continua a ser o ID interno numérico do HOMSTEG.
 * - users.openId guarda o ID externo do Better Auth.
 * - Não alteramos users.id.
 */
export async function upsertUser(
  user: InsertUser,
): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();

  if (!db) {
    console.warn(
      "[Database] Cannot upsert user: database not available",
    );
    return;
  }

  const values: InsertUser = {
    openId: user.openId,
    lastSignedIn: user.lastSignedIn ?? new Date(),
  };

  const updateSet: Record<string, unknown> = {
    lastSignedIn: values.lastSignedIn,
  };

  (["name", "email", "loginMethod"] as const).forEach((field) => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = values[field];
    }
  });

  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = values.role;
  }

  await db
    .insert(users)
    .values(values)
    .onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
}

/**
 * Procura um utilizador de negócio pelo ID do Better Auth.
 */
export async function getUserByOpenId(
  openId: string,
) {
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
 * O e-mail é normalizado para minúsculas.
 */
export async function getUserByEmail(
  email: string,
) {
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
 * Sincroniza o utilizador autenticado pelo Better Auth
 * com a tabela de negócio users do HOMSTEG.
 *
 * Esta função será chamada pelo hook do Better Auth.
 */
export async function syncBetterAuthUser({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name: string;
}) {
  await upsertUser({
    openId: userId,
    email: email.toLowerCase().trim(),
    name: name.trim() || null,
    loginMethod: "better-auth",
    lastSignedIn: new Date(),
  });
}

/**
 * Atualiza a data do último login do utilizador de negócio.
 */
export async function updateUserLastSignedIn(
  userId: number,
) {
  const db = await getDb();

  if (!db) {
    return;
  }

  await db
    .update(users)
    .set({
      lastSignedIn: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

/* ============================================================
   STORES
   ============================================================ */

export async function getStoresForUser(
  userId: number,
  isAdmin = false,
) {
  const db = await getDb();

  if (!db) {
    return [];
  }

  if (isAdmin) {
    return db
      .select()
      .from(stores)
      .orderBy(desc(stores.createdAt));
  }

  return db
    .select({
      store: stores,
    })
    .from(stores)
    .innerJoin(
      storeMembers,
      eq(storeMembers.storeId, stores.id),
    )
    .where(
      eq(storeMembers.userId, userId),
    )
    .orderBy(desc(stores.createdAt));
}

/**
 * Cria uma loja ativa e a relação owner
 * dentro da mesma transação.
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

  return db.transaction(async (tx) => {
    const existingStore = await tx
      .select()
      .from(stores)
      .where(eq(stores.slug, slug))
      .limit(1);

    if (existingStore[0]) {
      const membership = await tx
        .select({
          id: storeMembers.id,
        })
        .from(storeMembers)
        .where(
          and(
            eq(
              storeMembers.storeId,
              existingStore[0].id,
            ),
            eq(
              storeMembers.userId,
              userId,
            ),
          ),
        )
        .limit(1);

      if (membership[0]) {
        return existingStore[0];
      }

      throw new Error(
        "STORE_SLUG_ALREADY_EXISTS",
      );
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

    await tx
      .insert(storeMembers)
      .values({
        storeId: id,
        userId,
        role: "owner",
      });

    return created[0];
  });
}

/* ============================================================
   ADMIN
   ============================================================ */

export async function getAdminUsers() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  const [
    allUsers,
    applications,
    memberships,
  ] = await Promise.all([
    db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt)),

    db
      .select()
      .from(storeApplications)
      .orderBy(
        desc(storeApplications.createdAt),
      ),

    db
      .select({
        membership: storeMembers,
        store: stores,
        plan: plans,
      })
      .from(storeMembers)
      .innerJoin(
        stores,
        eq(
          storeMembers.storeId,
          stores.id,
        ),
      )
      .leftJoin(
        plans,
        eq(
          stores.planKey,
          plans.key,
        ),
      ),
  ]);

  const latestApplicationByUser =
    new Map<
      number,
      (typeof applications)[number]
    >();

  for (const application of applications) {
    if (
      !latestApplicationByUser.has(
        application.userId,
      )
    ) {
      latestApplicationByUser.set(
        application.userId,
        application,
      );
    }
  }

  const storesByUser =
    new Map<
      number,
      typeof memberships
    >();

  for (const membership of memberships) {
    const userStores =
      storesByUser.get(
        membership.membership.userId,
      ) ?? [];

    userStores.push(membership);

    storesByUser.set(
      membership.membership.userId,
      userStores,
    );
  }

  return allUsers.map((user) => ({
    user,

    latestApplication:
      latestApplicationByUser.get(
        user.id,
      ) ?? null,

    stores: (
      storesByUser.get(user.id) ?? []
    ).map(
      ({
        membership,
        store,
        plan,
      }) => ({
        store,
        role: membership.role,
        plan,
      }),
    ),
  }));
}

export async function getAdminPlans() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  const [
    allPlans,
    allStores,
  ] = await Promise.all([
    db
      .select()
      .from(plans)
      .orderBy(plans.priceMzn),

    db
      .select({
        planKey: stores.planKey,
      })
      .from(stores),
  ]);

  const usageByPlanKey =
    new Map<string, number>();

  for (const store of allStores) {
    usageByPlanKey.set(
      store.planKey,
      (
        usageByPlanKey.get(
          store.planKey,
        ) ?? 0
      ) + 1,
    );
  }

  return allPlans.map((plan) => ({
    plan,

    storeCount:
      usageByPlanKey.get(
        plan.key,
      ) ?? 0,
  }));
}

export async function userHasStoreAccess(
  userId: number,
  storeId: string,
  isAdmin = false,
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
      and(
        eq(
          storeMembers.userId,
          userId,
        ),
        eq(
          storeMembers.storeId,
          storeId,
        ),
      ),
    )
    .limit(1);

  return result.length > 0;
}

/* ============================================================
   PUBLIC STORE
   ============================================================ */

export async function getPublicStoreBySlug(
  slug: string,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const normalizedSlug =
    slug.trim().toLowerCase();

  const result = await db
    .select()
    .from(stores)
    .where(
      and(
        eq(
          stores.slug,
          normalizedSlug,
        ),
        eq(
          stores.status,
          "active",
        ),
      ),
    )
    .limit(1);

  return result[0];
}

/* ============================================================
   STORE THEMES
   ============================================================ */

export async function updateStoreTheme(
  storeId: string,
  themeKey: string,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
  }

  const result = await db
    .update(stores)
    .set({
      themeKey,
      updatedAt: new Date(),
    })
    .where(
      eq(
        stores.id,
        storeId,
      ),
    )
    .returning();

  return result[0];
}

/* ============================================================
   PRODUCTS
   ============================================================ */

type StoredProductOption = {
  name: string;
  values: string[];
};

async function hydrateProductAssets(
  product: typeof products.$inferSelect,
) {
  const imageUrls = (
    await Promise.all(
      product.imageKeys.map(async (key) => {
        try {
          return await createStoreDownloadUrl(key);
        } catch {
          return null;
        }
      }),
    )
  ).filter((url): url is string => Boolean(url));

  if (product.imageUrl) {
    imageUrls.push(product.imageUrl);
  }

  const images = Array.from(new Set(imageUrls));
  const options = Array.isArray(product.options)
    ? product.options.filter(
        (option): option is StoredProductOption =>
          typeof option?.name === "string" &&
          Array.isArray(option.values),
      )
    : [];

  return {
    ...product,
    imageUrl: images[0] ?? null,
    images,
    options,
  };
}

export async function listProducts(
  storeId: string,
) {
  const db = await getDb();

  if (!db) {
    return [];
  }

  const result = await db
    .select()
    .from(products)
    .where(
      eq(
        products.storeId,
        storeId,
      ),
    )
    .orderBy(
      desc(products.createdAt),
    );

  return Promise.all(result.map(hydrateProductAssets));
}

/**
 * Dados reais usados pelo dashboard da loja.
 *
 * Não cria números fictícios:
 * - total de produtos
 * - produtos ativos
 * - rascunhos
 * - arquivados
 * - produtos sem stock
 * - produtos recentes
 *
 * Os dados são sempre calculados a partir da loja
 * e dos produtos existentes no Neon.
 */
export async function getStoreDashboardSummary(
  storeId: string,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const storeResult = await db
    .select()
    .from(stores)
    .where(
      eq(
        stores.id,
        storeId,
      ),
    )
    .limit(1);

  const store = storeResult[0];

  if (!store) {
    return undefined;
  }

  const storeProducts = await db
    .select()
    .from(products)
    .where(
      eq(
        products.storeId,
        storeId,
      ),
    )
    .orderBy(
      desc(products.createdAt),
    );

  const totalProducts =
    storeProducts.length;

  const activeProducts =
    storeProducts.filter(
      (product) =>
        product.status === "active",
    ).length;

  const draftProducts =
    storeProducts.filter(
      (product) =>
        product.status === "draft",
    ).length;

  const archivedProducts =
    storeProducts.filter(
      (product) =>
        product.status === "archived",
    ).length;

  const outOfStockProducts =
    storeProducts.filter(
      (product) =>
        product.stock <= 0,
    ).length;

  const recentProducts =
    storeProducts.slice(0, 5);

  return {
    store: {
      id: store.id,
      name: store.name,
      slug: store.slug,
      category: store.category,
      planKey: store.planKey,
      status: store.status,
      currency: store.currency,
      themeKey: store.themeKey,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
    },

    products: {
      total: totalProducts,
      active: activeProducts,
      draft: draftProducts,
      archived: archivedProducts,
      outOfStock: outOfStockProducts,
      recent: recentProducts,
    },

    updatedAt: new Date(),
  };
}

export async function listPublicProducts(
  storeId: string,
) {
  const db = await getDb();

  if (!db) {
    return [];
  }

  const result = await db
    .select()
    .from(products)
    .where(
      and(
        eq(
          products.storeId,
          storeId,
        ),
        ne(
          products.status,
          "archived",
        ),
      ),
    )
    .orderBy(
      desc(products.createdAt),
    );

  return Promise.all(result.map(hydrateProductAssets));
}

export async function insertProduct(
  product: InsertProduct,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
  }

  const result = await db
    .insert(products)
    .values(product)
    .returning();

  return result[0];
}

export async function archiveProduct(
  storeId: string,
  productId: number,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
  }

  return db
    .update(products)
    .set({
      status: "archived",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(
          products.id,
          productId,
        ),
        eq(
          products.storeId,
          storeId,
        ),
      ),
    );
}

/* ============================================================
   STORE APPLICATIONS
   ============================================================ */

export async function createStoreApplication(
  application: InsertStoreApplication,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
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

export async function getStoreApplicationByUserId(
  userId: number,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const result = await db
    .select()
    .from(storeApplications)
    .where(
      eq(
        storeApplications.userId,
        userId,
      ),
    )
    .orderBy(
      desc(
        storeApplications.createdAt,
      ),
    )
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
    .orderBy(
      desc(
        storeApplications.createdAt,
      ),
    );
}

export async function getStoreApplicationById(
  id: number,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const result = await db
    .select()
    .from(storeApplications)
    .where(
      eq(
        storeApplications.id,
        id,
      ),
    )
    .limit(1);

  return result[0];
}

export async function updateStoreApplicationStatus(
  id: number,
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "changes_requested",
  adminNotes?: string,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
  }

  return db
    .update(storeApplications)
    .set({
      status,
      adminNotes:
        adminNotes ?? null,
      reviewedAt:
        status === "pending"
          ? null
          : new Date(),
      updatedAt: new Date(),
    })
    .where(
      eq(
        storeApplications.id,
        id,
      ),
    );
}

/**
 * Cria uma loja real a partir de uma candidatura aprovada.
 *
 * Tudo acontece numa única transação:
 *
 * stores
 * +
 * storeMembers
 * +
 * storeApplications.approved
 *
 * themeKey inicia sempre como "nova".
 */
export async function createStoreFromApplication(
  applicationId: number,
  adminNotes?: string,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
  }

  return db.transaction(async (tx) => {
    const applicationResult =
      await tx
        .select()
        .from(storeApplications)
        .where(
          eq(
            storeApplications.id,
            applicationId,
          ),
        )
        .limit(1);

    const application =
      applicationResult[0];

    if (!application) {
      throw new Error(
        "APPLICATION_NOT_FOUND",
      );
    }

    if (
      application.status !== "pending" &&
      application.status !==
        "changes_requested" &&
      application.status !== "approved"
    ) {
      throw new Error(
        "APPLICATION_NOT_APPROVABLE",
      );
    }

    const existingStoreResult =
      await tx
        .select()
        .from(stores)
        .where(
          eq(
            stores.slug,
            application.storeSlug,
          ),
        )
        .limit(1);

    if (
      existingStoreResult.length > 0
    ) {
      const existingStore =
        existingStoreResult[0];

      const existingMembership =
        await tx
          .select({
            id: storeMembers.id,
          })
          .from(storeMembers)
          .where(
            and(
              eq(
                storeMembers.storeId,
                existingStore.id,
              ),
              eq(
                storeMembers.userId,
                application.userId,
              ),
            ),
          )
          .limit(1);

      if (
        existingMembership.length ===
        0
      ) {
        throw new Error(
          "STORE_SLUG_ALREADY_EXISTS",
        );
      }

      if (
        application.status !==
        "approved"
      ) {
        await tx
          .update(storeApplications)
          .set({
            status: "approved",
            adminNotes:
              adminNotes ?? null,
            reviewedAt:
              new Date(),
            updatedAt:
              new Date(),
          })
          .where(
            eq(
              storeApplications.id,
              applicationId,
            ),
          );
      }

      return existingStore;
    }

    const storeId = randomUUID();

    const createdStoreResult =
      await tx
        .insert(stores)
        .values({
          id: storeId,
          name:
            application.storeName,
          slug:
            application.storeSlug,
          category: "General",
          planKey: "free",
          status: "active",
          currency: "MZN",
          themeKey: "nova",
        })
        .returning();

    await tx
      .insert(storeMembers)
      .values({
        storeId,
        userId:
          application.userId,
        role: "owner",
      });

    await tx
      .update(storeApplications)
      .set({
        status: "approved",
        adminNotes:
          adminNotes ?? null,
        reviewedAt:
          new Date(),
        updatedAt:
          new Date(),
      })
      .where(
        eq(
          storeApplications.id,
          applicationId,
        ),
      );

    return createdStoreResult[0];
  });
}
