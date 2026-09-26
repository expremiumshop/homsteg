import { randomUUID } from "crypto";
import { and, count, desc, eq, ne } from "drizzle-orm";

import {
  addOneMonth,
  isPlanKey,
  isPaidPlan,
} from "../shared/homsteg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import {
  InsertProduct,
  InsertStoreApplication,
  InsertUser,
  products,
  planRequests,
  plans,
  storeApplications,
  stores,
  storeMembers,
  users,
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
        planKey: "free",
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
   SUBSCRIPTION PLANS
   ============================================================ */

/**
 * Garante que os planos HOMSTEG existem na base de dados
 * com os limites corretos. Chamado no arranque do servidor
 * e antes de leituras de planos.
 *
 * O plano Free é o único obrigatório para o correto
 * funcionamento do sistema de planos.
 */
export const PLAN_CATALOG = [
  {
    key: "free",
    name: "Free",
    priceMzn: 0,
    productLimit: 50,
    features: [
      "Loja online",
      "50 produtos",
      "Tema base",
      "Gestão de stock",
      "Gestão de pedidos",
      "Painel administrativo",
      "Banner da loja",
      "Logo e informações da loja",
      "Link para WhatsApp",
    ],
  },
  {
    key: "starter",
    name: "Starter",
    priceMzn: 480,
    productLimit: 580,
    features: [
      "Tudo do Free",
      "580 produtos",
      "Todos os temas disponíveis",
      "Variantes de produtos",
      "Galeria de imagens",
      "Promoções",
      "Cupons",
      "Relatórios básicos",
      "Mais personalização",
    ],
  },
  {
    key: "business",
    name: "Business",
    priceMzn: 1590,
    productLimit: 2450,
    features: [
      "Tudo do Starter",
      "2.450 produtos",
      "Domínio personalizado",
      "Relatórios avançados",
      "Gestão avançada de pedidos",
      "Marketing e promoções",
      "Mais membros da equipa",
      "Permissões de equipa",
      "Personalização avançada",
    ],
  },
  {
    key: "professional",
    name: "Professional",
    priceMzn: 2150,
    productLimit: 5850,
    features: [
      "Tudo do Business",
      "5.850 produtos",
      "Maior capacidade",
      "Prioridade de suporte",
      "Integrações avançadas",
      "Equipas maiores",
    ],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    priceMzn: 8900,
    productLimit: -1,
    features: [
      "Tudo do Professional",
      "Produtos ilimitados",
      "Variantes ilimitadas",
      "Equipas maiores",
      "Permissões avançadas",
      "Domínio personalizado",
      "Integrações personalizadas",
      "Maior capacidade",
      "Suporte prioritário",
    ],
  },
] as const;

export async function seedPlans() {
  const db = await getDb();

  if (!db) {
    return;
  }

  for (const plan of PLAN_CATALOG) {
    await db
      .insert(plans)
      .values({
        key: plan.key,
        name: plan.name,
        priceMzn: plan.priceMzn,
        productLimit:
          plan.productLimit === -1
            ? 2147483647
            : plan.productLimit,
        features: plan.features.join("\n"),
      })
      .onConflictDoUpdate({
        target: plans.key,
        set: {
          name: plan.name,
          priceMzn: plan.priceMzn,
          productLimit:
            plan.productLimit === -1
              ? 2147483647
              : plan.productLimit,
          features: plan.features.join("\n"),
          status: "active",
        },
      });
  }
}

/**
 * Número de produtos não arquivados da loja.
 * É este valor que conta para o limite do plano.
 */
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
      )),
    );

  return Number(result[0]?.value ?? 0);
}

export async function getStoreWithPlanUsage(
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

  const latestRequest =
    await getLatestPlanRequestByStoreId(
      store.id,
    );

  return {
    store,
    productsUsed,
    latestRequest: latestRequest ?? null,
  };
}

export async function createPlanUpgradeRequest({
  storeId,
  requestedPlanKey,
  note,
}: {
  storeId: string;
  requestedPlanKey: string;
  note?: string | null;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const storeResult = await db
    .select()
    .from(stores)
    .where(eq(stores.id, storeId))
    .limit(1);

  const store = storeResult[0];

  if (!store) {
    throw new Error("STORE_NOT_FOUND");
  }

  const productsUsed =
    await countActiveStoreProducts(
      storeId,
    );

  const result = await db
    .insert(planRequests)
    .values({
      storeId,
      requestedPlanKey,
      currentPlanKey: store.planKey,
      productsUsed,
      status: "pending",
      note: note?.trim() || null,
    })
    .returning();

  return result[0];
}

export async function getLatestPlanRequestByStoreId(
  storeId: string,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  const result = await db
    .select()
    .from(planRequests)
    .where(
      eq(planRequests.storeId, storeId),
    )
    .orderBy(
      desc(planRequests.createdAt),
    )
    .limit(1);

  return result[0];
}

export async function getAdminPlanRequests() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  const rows = await db
    .select({
      request: planRequests,
      store: stores,
    })
    .from(planRequests)
    .innerJoin(
      stores,
      eq(
        planRequests.storeId,
        stores.id,
      ),
    )
    .orderBy(
      desc(planRequests.createdAt),
    );

  return Promise.all(
    rows.map(async ({ request, store }) => {
      const productsUsed =
        await countActiveStoreProducts(
          store.id,
        );

      return {
        request,
        store: {
          id: store.id,
          name: store.name,
          slug: store.slug,
          planKey: store.planKey,
          whatsapp: store.whatsapp,
        },
        productsUsed,
      };
    }),
  );
}

export async function getAdminPlanOverview() {
  const db = await getDb();

  if (!db) {
    return {
      plans: [],
      stores: [],
    };
  }

  await seedPlans();

  const [allPlans, allStores] =
    await Promise.all([
      db
        .select()
        .from(plans)
        .orderBy(plans.priceMzn),

      db
        .select()
        .from(stores)
        .orderBy(desc(stores.createdAt)),
    ]);

  const storesWithUsage = await Promise.all(
    allStores.map(async (store) => {
      const productsUsed =
        await countActiveStoreProducts(
          store.id,
        );

      const latestRequest =
        await getLatestPlanRequestByStoreId(
          store.id,
        );
      const plan =
        allPlans.find(
          (item) =>
            item.key === store.planKey,
        ) ?? allPlans.find(
          (item) => item.key === "free",
        );
      const ownerResult = await db
        .select({
          userId: storeMembers.userId,
        })
        .from(storeMembers)
        .where(
          and(
            eq(
              storeMembers.storeId,
              store.id,
            ),
            eq(
              storeMembers.role,
              "owner",
            ),
        ))
        .limit(1);

      const ownerId =
        ownerResult[0]?.userId ?? null;

      const owner = ownerId
        ? (
            await db
              .select({
                id: users.id,
                name: users.name,
                email: users.email,
              })
              .from(users)
              .where(
                eq(users.id, ownerId),
              )
              .limit(1)
          )[0] ?? null
        : null;

      return {
        store: {
          id: store.id,
          name: store.name,
          slug: store.slug,
          status: store.status,
          planKey: store.planKey,
          whatsapp: store.whatsapp,
          createdAt: store.createdAt,
          subscriptionPaidUntil:
            store.subscriptionPaidUntil,
          subscriptionPaidAt:
            store.subscriptionPaidAt,
        },
        plan: plan
          ? {
              key: plan.key,
              name: plan.name,
              productLimit: plan.productLimit,
            }
          : null,
        productsUsed,
        owner,
        latestRequest: latestRequest ?? null,
      };
    }),
  );

  return {
    plans: allPlans,
    stores: storesWithUsage,
  };
}

/**
 * Decide um pedido de plano. approved = atribui o
 * plano (assignedPlanKey ou o pedido) à loja;
 * rejected = apenas marca o pedido como rejeitado.
 */
export async function reviewPlanRequest({
  requestId,
  decision,
  assignedPlanKey,
  adminNotes,
}: {
  requestId: number;
  decision: "approved" | "rejected";
  assignedPlanKey?: string | null;
  adminNotes?: string | null;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  return db.transaction(async (tx) => {
    const requestResult = await tx
      .select()
      .from(planRequests)
      .where(
        eq(planRequests.id, requestId),
      )
      .limit(1);

    const request = requestResult[0];

    if (!request) {
      throw new Error(
        "PLAN_REQUEST_NOT_FOUND",
      );
    }

    if (request.status !== "pending") {
      throw new Error(
        "PLAN_REQUEST_ALREADY_REVIEWED",
      );
    }

    const targetPlanKey =
      decision === "approved"
        ? assignedPlanKey ||
          request.requestedPlanKey
        : null;    if (decision === "approved") {
      if (
        !PLAN_CATALOG.some(
          (plan) => plan.key === targetPlanKey,
        )
      ) {
        throw new Error(
          "INVALID_PLAN_KEY",
      );
      }

      /*
       * O plano aprovado inicia um novo período
       * mensal de subscrição (planos pagos).
       */
      await tx
        .update(stores)
        .set({
          planKey: targetPlanKey!,
          ...buildSubscriptionPeriodSet(
            targetPlanKey!,
          ),
          updatedAt: new Date(),
        })
    
        .where(
          eq(stores.id, request.storeId),
        );
    }

    const updatedRequest = await tx
      .update(planRequests)
      .set({
        status: decision,
        assignedPlanKey:
          decision === "approved"
            ? targetPlanKey
            : null,
        adminNotes: adminNotes?.trim() || null,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        eq(planRequests.id, requestId),
      )

      .returning();

    const storeResult = await tx
      .select()
      .from(stores)
      .where(
        eq(stores.id, request.storeId),
      )
      .limit(1);

    return {
      request: updatedRequest[0],
      store: storeResult[0],
    };
  });
}

/**
 * Campos de período de subscrição a gravar quando
 * um plano é aplicado à loja. Planos pagos começam
 * um período de um mês; Free não tem cobrança.
 */
function buildSubscriptionPeriodSet(
  planKey: string,
  from: Date = new Date(),
) {
  if (!isPlanKey(planKey) || !isPaidPlan(planKey)) {
    return {
      subscriptionPaidUntil: null,
      subscriptionPaidAt: null,
    };
  }

  return {
    subscriptionPaidUntil: addOneMonth(from),
    subscriptionPaidAt: from,
  };
}

/**
 * Renova a subscrição mensal da loja por mais um
 * mês após confirmação de pagamento pelo admin.
 * Não altera o plano, limites ou outras configurações.
 */
export async function markStoreSubscriptionPaid(
  storeId: string,
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  return db.transaction(async (tx) => {
    const storeResult = await tx
      .select()
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1);

    const store = storeResult[0];

    if (!store) {
      throw new Error("STORE_NOT_FOUND");
    }

    if (
      !isPlanKey(store.planKey) ||
      !isPaidPlan(store.planKey)
    ) {
      throw new Error(
        "SUBSCRIPTION_NOT_REQUIRED_FOR_FREE_PLAN",
      );
    }

    /*
     * Renova a partir do período atual se ainda
     * válido (evita perder dias pagos), ou de hoje
     * se já expirou.
     */
    const currentUntil =
      store.subscriptionPaidUntil;

    const baseDate =
      currentUntil &&
      currentUntil.getTime() > Date.now()
        ? currentUntil
        : new Date();

    const renewedUntil =
      addOneMonth(baseDate);

    const updated = await tx
      .update(stores)
      .set({
        subscriptionPaidUntil: renewedUntil,
        subscriptionPaidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(stores.id, storeId))
      .returning();

    return updated[0];
  });
}

/**
 * Atribuição direta de plano pelo admin,
 * sem pedido prévio do proprietário.
 */
export async function assignPlanToStore({
  storeId,
  planKey,
}: {
  storeId: string;
  planKey: string;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  if (
    !PLAN_CATALOG.some(
      (plan) => plan.key === planKey,
    )
  ) {
    throw new Error("INVALID_PLAN_KEY");
  }

  const updated = await db
    .update(stores)
    .set({
      planKey,
      ...buildSubscriptionPeriodSet(
        planKey,
      ),
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  if (!updated[0]) {
    throw new Error("STORE_NOT_FOUND");
  }
  
  return updated[0];
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

  const latestApplicationByUser = new Map<
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

  const storesByUser = new Map<
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

export async function updateStoreStatus(
  storeId: string,
  status: "active" | "suspended",
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const result = await db
    .update(stores)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  return result[0];
}

export async function deleteStore(
  storeId: string,
) {
  const db = await getDb();

  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
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
        eq(stores.id, storeId),
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
    throw new Error("DATABASE_UNAVAILABLE");
  }

  return db.transaction(async (tx) => {
    const userResult = await tx
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userResult[0];

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const memberships = await tx
      .select({
        storeId: storeMembers.storeId,
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
          eq(stores.id, storeId),
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
        eq(users.id, userId),
      )
      .returning();

    return deleted[0];
  });
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
      planKey: store.planKey,
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