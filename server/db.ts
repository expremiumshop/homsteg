import { randomUUID } from "crypto";

import {
  MARKET_CATALOG,
  computeStockCapacity,
  getStockPackExtra,
} from "../shared/market-catalog.js";

import { and, count, desc, eq, ne } from "drizzle-orm";
import { asc } from "drizzle-orm";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import {
  InsertProduct,
  InsertStoreApplication,
  InsertUser,
  products,
  storeApplications,
  storeCategories,
  stores,
  storeMembers,
  users,
  marketFeatures,
  storeMarketFeatures,
} from "../drizzle/schema.js";

import { createStoreDownloadUrl } from "./r2.js";

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

  (["name", "email", "loginMethod"] as const).forEach(
    (field) => {
      if (user[field] !== undefined) {
        values[field] = user[field] ?? null;
        updateSet[field] = values[field];
      }
    },
  );

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

export async function getUserByEmail(
  email: string,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const normalizedEmail = email
    .toLowerCase()
    .trim();

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  return result[0];
}

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

export async function resolveBetterAuthBusinessUser({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name: string;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedName = name.trim() || null;

  const byOpenId = await db
    .select()
    .from(users)
    .where(eq(users.openId, userId))
    .limit(1);

  if (byOpenId[0]) {
    return byOpenId[0];
  }

  const byEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (byEmail[0]) {
    const updated = await db
      .update(users)
      .set({
        openId: userId,
        name: normalizedName,
        email: normalizedEmail,
        loginMethod: "better-auth",
        lastSignedIn: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, byEmail[0].id))
      .returning();

    return updated[0];
  }

  const created = await db
    .insert(users)
    .values({
      openId: userId,
      email: normalizedEmail,
      name: normalizedName,
      loginMethod: "better-auth",
      lastSignedIn: new Date(),
    })
    .returning();

  return created[0];
}

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
      eq(
        storeMembers.storeId,
        stores.id,
      ),
    )
    .where(
      eq(
        storeMembers.userId,
        userId,
      ),
    )
    .orderBy(desc(stores.createdAt));
}

export async function createStoreForUser({
  userId,
  name,
  slug,
  whatsapp,
}: {
  userId: number;
  name: string;
  slug: string;
  whatsapp?: string;
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
        status: "active",
        currency: "MZN",
        whatsapp: whatsapp?.trim() || null,
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

export async function updateStoreWhatsApp(
  storeId: string,
  whatsapp: string,
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const updated = await db
    .update(stores)
    .set({
      whatsapp: whatsapp.trim(),
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  return updated[0];
}

/* ============================================================
   PRODUCTS
   ============================================================ */

export async function countActiveStoreProducts(
  storeId: string,
) {
  const db = await getDb();

  if (!db) {
    return 0;
  }

  const result = await db
    .select({ value: count() })
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
    );

  return Number(result[0]?.value ?? 0);
}

export async function getStoreWithUsage(
  storeId: string,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const storeResult = await db
    .select()
    .from(stores)
    .where(eq(stores.id, storeId))
    .limit(1);

  const store = storeResult[0];

  if (!store) {
    return undefined;
  }

  const productsUsed =
    await countActiveStoreProducts(
      store.id,
    );

  return {
    store,
    productsUsed,
  };
}

/* ============================================================
   STORE CREDIT (crédito da loja)

   O crédito vive na própria loja (stores.creditMzn),
   nunca no utilizador. NULL = sem crédito definido
   (tratado como 0 no dashboard). É o único sistema
   pago da HOMSTEG e serve apenas para o Market.
   ============================================================ */

/**
 * Define o saldo de crédito da loja (set absoluto).
 */
export async function setStoreCreditMzn({
  storeId,
  creditMzn,
}: {
  storeId: string;
  creditMzn: number;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const updated = await db
    .update(stores)
    .set({
      creditMzn,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  return updated[0] ?? null;
}

/**
 * Acrescenta (ou subtrai, com valor negativo) crédito
 * ao saldo atual da loja. O resultado nunca fica
 * abaixo de 0.
 */
export async function addStoreCreditMzn({
  storeId,
  amountMzn,
}: {
  storeId: string;
  amountMzn: number;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const storeResult = await db
    .select({ creditMzn: stores.creditMzn })
    .from(stores)
    .where(eq(stores.id, storeId))
    .limit(1);

  const store = storeResult[0];

  if (!store) {
    return null;
  }

  const current = store.creditMzn ?? 0;

  const next = Math.max(
    0,
    current + amountMzn,
  );

  const updated = await db
    .update(stores)
    .set({
      creditMzn: next,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  return updated[0] ?? null;
}

/* ============================================================
   STORE MARKET FEATURES (compras do Market por loja)

   Registo permanente de compra/desbloqueio de
   funcionalidades do Market por loja. Fonte de verdade:
   base de dados (tabela store_market_features) — nunca
   localStorage. A compra debita o crédito da loja
   (stores.creditMzn) de forma transacional.
   ============================================================ */

/**
 * Lista os featureKeys comprados/desbloqueados por
 * uma loja (ex.: ["4product", "8product"]).
 */
export async function listStoreMarketFeatureKeys({
  storeId,
}: {
  storeId: string;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const rows = await db
    .select({ featureKey: storeMarketFeatures.featureKey })
    .from(storeMarketFeatures)
    .where(eq(storeMarketFeatures.storeId, storeId));

  return rows.map((row) => row.featureKey);
}

/**
 * Compra (com desbloqueio permanente) de uma
 * funcionalidade do Market usando o crédito da loja.
 *
 * Transacional: verifica catálogo ativo, compra
 * duplicada, saldo suficiente — e só então debita
 * stores.creditMzn e insere store_market_features.
 */
export async function purchaseMarketFeature({
  storeId,
  featureKey,
}: {
  storeId: string;
  featureKey: string;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  return db.transaction(async (tx) => {
    /* 1. A funcionalidade tem de existir e estar ativa. */
    const featureResult = await tx
      .select({
        name: marketFeatures.name,
        priceCredits: marketFeatures.priceCredits,
        status: marketFeatures.status,
      })
      .from(marketFeatures)
      .where(eq(marketFeatures.featureKey, featureKey))
      .limit(1);

    const feature = featureResult[0];

    if (!feature || feature.status !== "active") {
      return {
        ok: false as const,
        reason: "FEATURE_NOT_FOUND" as const,
      };
    }

    /* 2. Já comprada? Idempotente. */
    const existing = await tx
      .select({ id: storeMarketFeatures.id })
      .from(storeMarketFeatures)
      .where(
        and(
          eq(storeMarketFeatures.storeId, storeId),
          eq(storeMarketFeatures.featureKey, featureKey),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return {
        ok: false as const,
        reason: "ALREADY_OWNED" as const,
      };
    }

    /* 3. A loja tem de existir e ter saldo suficiente. */
    const storeResult = await tx
      .select({ creditMzn: stores.creditMzn })
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1);

    const store = storeResult[0];

    if (!store) {
      return {
        ok: false as const,
        reason: "STORE_NOT_FOUND" as const,
      };
    }

    const currentCredit = store.creditMzn ?? 0;

    if (currentCredit < feature.priceCredits) {
      return {
        ok: false as const,
        reason: "INSUFFICIENT_CREDIT" as const,
      };
    }

    /* 4. Debita o crédito e regista a compra. */
    await tx
      .update(stores)
      .set({
        creditMzn: currentCredit - feature.priceCredits,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, storeId));

    await tx.insert(storeMarketFeatures).values({
      id: randomUUID(),
      storeId,
      featureKey,
      priceCredits: feature.priceCredits,
    });

    return {
      ok: true as const,
      purchase: {
        featureKey,
        name: feature.name,
        priceCredits: feature.priceCredits,
      },
    };
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
      .orderBy(
        desc(users.createdAt),
      ),

    db
      .select()
      .from(storeApplications)
      .orderBy(
        desc(
          storeApplications.createdAt,
        ),
      ),

    db
      .select({
        membership: storeMembers,
        store: stores,
      })
      .from(storeMembers)
      .innerJoin(
        stores,
        eq(
          storeMembers.storeId,
          stores.id,
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

    userStores.push(
      membership,
    );

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
      storesByUser.get(
        user.id,
      ) ?? []
    ).map(
      ({
        membership,
        store,
      }) => ({
        store,
        role: membership.role,
      }),
    ),
  }));
}

export async function updateStoreStatus(
  storeId: string,
  status: "active" | "suspended",
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
      status,
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

export async function deleteStore(
  storeId: string,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
  }

  return db.transaction(async (tx) => {
    await tx
      .delete(storeMembers)
      .where(
        eq(
          storeMembers.storeId,
          storeId,
        ),
      );

    await tx
      .delete(products)
      .where(
        eq(
          products.storeId,
          storeId,
        ),
      );

    const result = await tx
      .delete(stores)
      .where(
        eq(
          stores.id,
          storeId,
        ),
      )
      .returning();

    return result[0];
  });
}

/**
 * Elimina um utilizador do painel Admin.
 *
 * Remove:
 * - lojas do utilizador
 * - produtos dessas lojas
 * - membros dessas lojas
 * - candidaturas do utilizador
 * - utilizador da tabela users
 *
 * Tudo acontece dentro da mesma transação.
 */

export async function deleteAdminUser(
  userId: number,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
  }

  return db.transaction(async (tx) => {
    const userResult = await tx
      .select()
      .from(users)
      .where(
        eq(
          users.id,
          userId,
        ),
      )
      .limit(1);

    const user = userResult[0];

    if (!user) {
      throw new Error(
        "USER_NOT_FOUND",
      );
    }

    const memberships = await tx
      .select({
        storeId:
          storeMembers.storeId,
      })
      .from(storeMembers)
      .where(
        eq(
          storeMembers.userId,
          userId,
        ),
      );

    const storeIds = Array.from(
      new Set(
        memberships.map(
          (membership) =>
            membership.storeId,
        ),
      ),
    );

    for (const storeId of storeIds) {
      await tx
        .delete(storeMembers)
        .where(
          eq(
            storeMembers.storeId,
            storeId,
          ),
        );

      await tx
        .delete(products)
        .where(
          eq(
            products.storeId,
            storeId,
          ),
        );

      await tx
        .delete(stores)
        .where(
          eq(
            stores.id,
            storeId,
          ),
        );
    }

    await tx
      .delete(storeApplications)
      .where(
        eq(
          storeApplications.userId,
          userId,
        ),
      );

    const deleted = await tx
      .delete(users)
      .where(
        eq(
          users.id,
          userId,
        ),
      )
      .returning();

    return deleted[0];
  });
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
   STORE BRANDING (logo + banner)
   ============================================================ */

const BRANDING_KEY_PREFIX = "stores/";
const BRANDING_KEY_FOLDER = "/branding/";

/*
 * Resolve as chaves R2 de branding para URLs
 * assinadas prontas a exibir. Falha silenciosa:
 * sem branding (ou R2 indisponível), devolve null.
 */
/**
 * Normaliza a lista de chaves de banners da loja:
 * - aceita o array `bannerKeys`;
 * - inclui a chave legada `bannerKey` à frente (comportamento
 *   anterior preservado quando só existe 1 banner).
 */
function resolveStoreBannerKeys(store: {
  bannerKey: string | null;
  bannerKeys?: string[] | null;
}): string[] {
  const legacy =
    store.bannerKey && !store.bannerKeys?.includes(store.bannerKey)
      ? [store.bannerKey]
      : [];

  const keys = [...legacy, ...(store.bannerKeys ?? [])].filter(
    (key): key is string =>
      Boolean(key) &&
      key.startsWith(BRANDING_KEY_PREFIX) &&
      key.includes(BRANDING_KEY_FOLDER),
  );

  /* Remove duplicados preservando a ordem. */
  return Array.from(new Set(keys));
}

export async function getStoreBrandingUrls(store: {
  id: string;
  logoKey: string | null;
  bannerKey: string | null;
  bannerKeys?: string[] | null;
}): Promise<{
  logoUrl: string | null;
  bannerUrl: string | null;
  bannerUrls: string[];
}> {
  const [logoUrl, bannerUrls] = await Promise.all([
    store.logoKey
      ? createStoreDownloadUrlSafe(store.logoKey)
      : Promise.resolve(null),

    /* Todos os banners (legado + novos) como URLs assinadas. */
    Promise.all(
      resolveStoreBannerKeys(store).map((key) =>
        createStoreDownloadUrlSafe(key),
      ),
    ).then((urls) => urls.filter((url): url is string => url !== null)),
  ]);

  return {
    logoUrl,
    bannerUrl: bannerUrls[0] ?? null,
    bannerUrls,
  };
}

async function createStoreDownloadUrlSafe(
  key: string,
) {
  try {
    return await createStoreDownloadUrl(
      key,
    );
  } catch (error) {
    console.warn(
      `[Branding] Falha ao gerar URL para "${key}":`,
      error instanceof Error
        ? error.message
        : error,
    );

    return null;
  }
}

function isBrandingObjectKey(key: string) {
  if (
    !key ||
    key.length > 255 ||
    key.includes("..") ||
    key.startsWith("/") ||
    key.endsWith("/")
  ) {
    return false;
  }

  /*
   * A chave tem de pertencer à própria loja:
   * stores/{storeId}/branding/...
   * Garante isolamento total entre lojas.
   */
  return (
    key.startsWith(BRANDING_KEY_PREFIX) &&
    key.includes(BRANDING_KEY_FOLDER)
  );
}

function assertBrandingKeyForStore(
  storeId: string,
  key: string,
) {
  if (!isBrandingObjectKey(key)) {
    throw new Error("BRANDING_KEY_INVALID");
  }

  if (!key.startsWith(`stores/${storeId}/branding/`)) {
    throw new Error("BRANDING_KEY_WRONG_STORE");
  }
}

export async function updateStoreBranding({
  storeId,
  logoKey,
  bannerKey,
  bannerKeys,
}: {
  storeId: string;
  logoKey?: string | null;
  bannerKey?: string | null;
  bannerKeys?: string[] | null;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const updates: {
    logoKey?: string | null;
    bannerKey?: string | null;
    bannerKeys?: string[];
    updatedAt: Date;
  } = { updatedAt: new Date() };

  if (logoKey !== undefined) {
    if (logoKey !== null) {
      assertBrandingKeyForStore(storeId, logoKey);
    }

    updates.logoKey = logoKey;
  }

  if (bannerKey !== undefined) {
    if (bannerKey !== null) {
      assertBrandingKeyForStore(storeId, bannerKey);
    }

    updates.bannerKey = bannerKey;
  }

  if (bannerKeys !== undefined) {
    /*
     * Cada chave da lista tem de pertencer à própria loja.
     * Array vazio é válido (remove todos os banners extra).
     */
    for (const key of bannerKeys ?? []) {
      assertBrandingKeyForStore(storeId, key);
    }

    /* Sem duplicados, preservando a ordem. */
    updates.bannerKeys = Array.from(new Set(bannerKeys));
  }

  const result = await db
    .update(stores)
    .set(updates)
    .where(eq(stores.id, storeId))
    .returning();

  return result[0];
}

/* ============================================================
   STORE BANNER MODEL + TEXTS (tema Nova)
   ============================================================ */

export async function updateStoreBannerSettings({
  storeId,
  bannerModel,
  bannerTexts,
  bannerFeatures,
}: {
  storeId: string;
  bannerModel?: string | null;
  bannerTexts?: { title?: string; subtitle?: string }[] | null;
  bannerFeatures?: Record<string, unknown> | null;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const updates: {
    bannerModel?: string | null;
    bannerTexts?: { title?: string; subtitle?: string }[];
    bannerFeatures?: Record<string, unknown>;
    updatedAt: Date;
  } = { updatedAt: new Date() };

  if (bannerModel !== undefined) {
    updates.bannerModel = bannerModel;
  }

  if (bannerTexts !== undefined) {
    /*
     * Normaliza: remove entradas totalmente vazias e
     * campos em branco, preservando a ordem dos slides.
     */
    updates.bannerTexts = (bannerTexts ?? []).map((item) => ({
      title: item.title?.trim() || undefined,
      subtitle: item.subtitle?.trim() || undefined,
    }));
  }

  if (bannerFeatures !== undefined) {
    /*
     * Guarda apenas chaves da própria loja
     * (stores/{storeId}/branding/...) — o router
     * já as validou; aqui filtra por defeito.
     */
    updates.bannerFeatures = bannerFeatures ?? {};
  }

  const result = await db
    .update(stores)
    .set(updates)
    .where(eq(stores.id, storeId))
    .returning();

  return result[0];
}

/* ============================================================
   STORE PRODUCT CARD MODEL (tema Nova)
   ============================================================ */

export async function updateStoreProductCardModel(
  storeId: string,
  model: string | null,
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const result = await db
    .update(stores)
    .set({
      productCardModel: model,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  return result[0];
}

/* ============================================================
   STORE NAV BUTTON MODEL (tema Nova)
   ============================================================ */

export async function updateStoreNavButtonModel(
  storeId: string,
  model: string | null,
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const result = await db
    .update(stores)
    .set({
      navButtonModel: model,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

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
      product.imageKeys.map(
        async (key) => {
          try {
            return await createStoreDownloadUrl(
              key,
            );
          } catch {
            return null;
          }
        },
      ),
    )
  ).filter(
    (url): url is string =>
      Boolean(url),
  );

  if (product.imageUrl) {
    imageUrls.push(
      product.imageUrl,
    );
  }

  const images = Array.from(
    new Set(imageUrls),
  );

  const options = Array.isArray(
    product.options,
  )
    ? product.options.filter(
        (
          option,
        ): option is StoredProductOption =>
          typeof option?.name ===
            "string" &&
          Array.isArray(
            option.values,
          ),
      )
    : [];

  return {
    ...product,
    imageUrl:
      images[0] ?? null,
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
      desc(
        products.createdAt,
      ),
    );

  return Promise.all(
    result.map(
      hydrateProductAssets,
    ),
  );
}

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
      desc(
        products.createdAt,
      ),
    );

  const totalProducts =
    storeProducts.length;

  const activeProducts =
    storeProducts.filter(
      (product) =>
        product.status ===
        "active",
    ).length;

  const draftProducts =
    storeProducts.filter(
      (product) =>
        product.status ===
        "draft",
    ).length;

  const archivedProducts =
    storeProducts.filter(
      (product) =>
        product.status ===
        "archived",
    ).length;

  const outOfStockProducts =
    storeProducts.filter(
      (product) =>
        product.stock <= 0,
    ).length;

  const recentProducts =
    storeProducts.slice(
      0,
      5,
    );

  return {
    store: {
      id: store.id,
      name: store.name,
      slug: store.slug,
      category: store.category,
      status: store.status,
      currency: store.currency,
      themeKey: store.themeKey,
      createdAt:
        store.createdAt,
      updatedAt:
        store.updatedAt,
    },

    products: {
      total: totalProducts,
      active: activeProducts,
      draft: draftProducts,
      archived:
        archivedProducts,
      outOfStock:
        outOfStockProducts,
      recent:
        recentProducts,
    },

    updatedAt:
      new Date(),
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
      desc(
        products.createdAt,
      ),
    );

  return Promise.all(
    result.map(
      hydrateProductAssets,
    ),
  );
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

/* ============================================================
   STORE CATEGORIES
   ============================================================ */

/**
 * Categorias criadas pelo utilizador para a loja.
 * É a única fonte do selector de categoria em produtos.
 */
export async function listStoreCategories(
  storeId: string,
) {
  const db = await getDb();

  if (!db) {
    return [];
  }

  return db
    .select()
    .from(storeCategories)
    .where(
      eq(storeCategories.storeId, storeId),
    )
    .orderBy(
      asc(storeCategories.name),
    );
}

export async function insertStoreCategory({
  storeId,
  name,
}: {
  storeId: string;
  name: string;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
  }  const result = await db
    .insert(storeCategories)
    .values({
      id: randomUUID(),
      storeId,
      name,
    })
    .returning();

  return result[0];
}

export async function renameStoreCategory({
  storeId,
  categoryId,
  name,
}: {
  storeId: string;
  categoryId: string;
  name: string;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
  }

  const existing = await db
    .select()
    .from(storeCategories)
    .where(
      and(
        eq(storeCategories.id, categoryId),
        eq(storeCategories.storeId, storeId),
      ),
    )
    .limit(1);

  const current = existing[0];

  if (!current) {
    throw new Error(
      "STORE_CATEGORY_NOT_FOUND",
    );
  }

  const oldName = current.name;

  if (oldName === name) {
    return current;
  }

  const result = await db
    .update(storeCategories)
    .set({
      name,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(storeCategories.id, categoryId),
        eq(storeCategories.storeId, storeId),
      ),
    )
    .returning();

  /*
   * O nome da categoria vive nos produtos;
   * renomear atualiza os produtos da mesma loja
   * que apontavam para o nome antigo.
   */
  await db
    .update(products)
    .set({
      category: name,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(products.storeId, storeId),
        eq(products.category, oldName),
      ),
    );

  return result[0];
}

export async function updateProduct(
  storeId: string,
  productId: number,
  updates: Partial<InsertProduct>,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "DATABASE_UNAVAILABLE",
    );
  }

  const result = await db
    .update(products)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(products.id, productId),
        eq(products.storeId, storeId),
      ),
    )
    .returning();

  return result[0] ?? null;
}

export async function archiveProduct(  storeId: string,  productId: number,) {
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
      updatedAt:
        new Date(),
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
      application.status !==
        "pending" &&
      application.status !==
        "changes_requested" &&
      application.status !==
        "approved"
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
      existingStoreResult.length >
      0
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
          .update(
            storeApplications,
          )
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

    const storeId =
      randomUUID();

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

/* ============================================================
   MARKET FEATURES
   ============================================================ */

/*
 * Catálogo comercial do módulo MARKET.
 *
 * O que se vende são FUNCIONALIDADES de personalização
 * (não produtos físicos). O conteúdo comercial (nome,
 * descrição, categoria, preço em créditos e status) vive
 * APENAS aqui (banco de dados). A estrutura de código
 * continua isolada em
 * client/src/components/dashboard/market/components/*.
 */

/** Lista todas as funcionalidades do Market (Admin). */
export async function listMarketFeatures() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  return db
    .select()
    .from(marketFeatures)
    .orderBy(
      asc(marketFeatures.category),
      asc(marketFeatures.sortOrder),
    );
}

/**
 * Lista apenas as funcionalidades Market ativas.
 * É o que o Market (cliente) consome para
 * mostrar nomes, descrições e preços em créditos.
 */
export async function listActiveMarketFeatures() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  return db
    .select()
    .from(marketFeatures)
    .where(eq(marketFeatures.status, "active"))
    .orderBy(
      asc(marketFeatures.category),
      asc(marketFeatures.sortOrder),
    );
}

/** Cria uma funcionalidade Market. */
export async function insertMarketFeature(
  values: typeof marketFeatures.$inferInsert,
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const result = await db
    .insert(marketFeatures)
    .values(values)
    .returning();

  return result[0];
}

/** Atualiza campos comerciais de uma funcionalidade Market. */
export async function updateMarketFeature(
  id: string,
  patch: Partial<typeof marketFeatures.$inferInsert>,
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const result = await db
    .update(marketFeatures)
    .set({
      ...patch,
      updatedAt: new Date(),
    })
    .where(eq(marketFeatures.id, id))
    .returning();

  return result[0] ?? null;
}

/**
 * Garante que cada entrada estrutural do catálogo
 * (shared/market-catalog.ts) tem a sua linha comercial
 * na tabela market_features.
 *
 * É assim que o Admin "cria as funcionalidades através do
 * código/estrutura definida": ao publicar uma nova
 * funcionalidade no catálogo partilhado, a linha comercial
 * nasce automaticamente aqui, pronta a ser precificada.
 *
 * Cria apenas o que falta; nunca sobrescreve preços nem
 * descrições já editados pelo Admin.
 */
export async function ensureMarketFeaturesSeeded() {
  const db = await getDb();

  if (!db) {
    return;
  }

  const existing = await db
    .select({ featureKey: marketFeatures.featureKey })
    .from(marketFeatures);

  const existingKeys = new Set(
    existing.map((row) => row.featureKey),
  );

  /*
   * Identidade dos pacotes de estoque: nomes e
   * descrições corretos desde o seed. O PREÇO não
   * vive aqui — é definido exclusivamente no painel
   * Admin, pela mesma negociação dos outros
   * produtos do Market.
   */
  const STOCK_FEATURE_DEFAULTS: Record<
    string,
    { name: string; description: string }
  > = {
    "1stock": {
      name: "Estoque +60",
      description:
        "Adiciona 60 produtos à capacidade de estoque da tua loja.",
    },
    "2stock": {
      name: "Estoque +100",
      description:
        "Adiciona 100 produtos à capacidade de estoque da tua loja.",
    },
    "3stock": {
      name: "Estoque +200",
      description:
        "Adiciona 200 produtos à capacidade de estoque da tua loja.",
    },
    "4stock": {
      name: "Estoque +300",
      description:
        "Adiciona 300 produtos à capacidade de estoque da tua loja.",
    },
    "5stock": {
      name: "Estoque +500",
      description:
        "Adiciona 500 produtos à capacidade de estoque da tua loja.",
    },
    "6stock": {
      name: "Estoque +1.000",
      description:
        "Adiciona 1.000 produtos à capacidade de estoque da tua loja.",
    },
    "7stock": {
      name: "Estoque +5.000",
      description:
        "Adiciona 5.000 produtos à capacidade de estoque da tua loja.",
    },
    "8stock": {
      name: "Estoque +15.000",
      description:
        "Adiciona 15.000 produtos à capacidade de estoque da tua loja.",
    },
  };

  /*
   * Reparação idempotente: linhas de estoque que
   * tenham nascido com nome placeholder (ex.:
   * "1stock") recebem o nome/descrição corretos.
   * Se o Admin já editou, não há correspondência
   * e nada é alterado.
   */
  for (const entry of MARKET_CATALOG) {
    const stockDefaults =
      STOCK_FEATURE_DEFAULTS[entry.featureKey];

    if (
      !stockDefaults ||
      !existingKeys.has(entry.featureKey)
    ) {
      continue;
    }

    await db
      .update(marketFeatures)
      .set({
        name: stockDefaults.name,
        description: stockDefaults.description,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(
            marketFeatures.featureKey,
            entry.featureKey,
          ),
          eq(marketFeatures.name, entry.featureKey),
        ),
      );
  }

  const missing = MARKET_CATALOG.filter(
    (entry) => !existingKeys.has(entry.featureKey),
  );

  if (missing.length === 0) {
    return;
  }

  try {
    await db
      .insert(marketFeatures)
      .values(
        missing.map((entry) => {
          const stockDefaults =
            STOCK_FEATURE_DEFAULTS[
              entry.featureKey
            ];

          return {
            id: entry.featureKey,
            featureKey: entry.featureKey,
            category: entry.category,
            sortOrder: entry.sortOrder,
            /*
             * Nome e descrição corretos desde o
             * seed; o preço nasce a 0 e é definido
             * exclusivamente no painel Admin —
             * nenhuma segunda lógica de preços.
             * Status igual ao de todas as outras
             * funcionalidades: active.
             */
            name:
              stockDefaults?.name ??
              entry.featureKey,
            description:
              stockDefaults?.description ??
              "Funcionalidade de personalização do Market.",
            priceCredits: 0,
            status: "active" as const,
          };
        }),
      )
      .onConflictDoNothing();
  } catch (error) {
    /*
     * O seed NUNCA pode derrubar o carregamento do
     * Market (ex.: migração do enum ainda não
     * aplicada na base de dados). Os modelos
     * continuam visíveis e o Admin pode corrigir.
     */
    console.warn(
      "[Market] Seed de market_features falhou (o Market continua a carregar):",
      error,
    );
  }
}

/* ============================================================
   STOCK CAPACITY (capacidade de estoque da loja)

   Toda loja começa com 50 produtos grátis. Capacidade
   extra vive exclusivamente no Market (categoria
   "stock"): cada pacote comprado soma os seus
   produtos extras à capacidade total da loja. A
   fonte de verdade é a mesma das outras compras do
   Market: a tabela store_market_features.
   ============================================================ */

/**
 * Devolve os featureKeys comprados por uma loja
 * apenas na categoria "stock" (pacotes de estoque).
 */
export async function listStoreStockPackKeys({
  storeId,
}: {
  storeId: string;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const rows = await db
    .select({
      featureKey: storeMarketFeatures.featureKey,
    })
    .from(storeMarketFeatures)
    .where(
      eq(storeMarketFeatures.storeId, storeId),
    );

  /* Filtra só pacotes de estoque (compartilha a tabela com o resto do Market). */
  return rows
    .map((row) => row.featureKey)
    .filter(
      (featureKey) =>
        getStockPackExtra(featureKey) !== null,
    );
}

/**
 * Capacidade total de produtos da loja:
 * 50 grátis + soma dos pacotes de estoque comprados.
 */
export async function getStoreStockCapacity(
  storeId: string,
): Promise<number> {
  const stockPackKeys =
    await listStoreStockPackKeys({ storeId });

  return computeStockCapacity(stockPackKeys);
}