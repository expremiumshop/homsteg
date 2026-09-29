import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/* ============================================================
   ENUMS
   ============================================================ */

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
]);

export const planStatusEnum = pgEnum("plan_status", [
  "active",
  "archived",
]);

export const storeStatusEnum = pgEnum("store_status", [
  "draft",
  "active",
  "suspended",
]);

export const storeMemberRoleEnum = pgEnum("store_member_role", [
  "owner",
  "manager",
  "staff",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "approved",
  "rejected",
  "changes_requested",
]);

export const planRequestStatusEnum = pgEnum("plan_request_status", [
  "pending",
  "approved",
  "rejected",
]);

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "active",
  "archived",
]);

/* ============================================================
   USERS
   ============================================================ */

export const users = pgTable("users", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

  openId: varchar("openId", {
    length: 64,
  })
    .notNull()
    .unique(),

  name: text("name"),

  email: varchar("email", {
    length: 320,
  }),

  passwordHash: varchar("passwordHash", {
    length: 255,
  }),

  loginMethod: varchar("loginMethod", {
    length: 64,
  }),

  role: userRoleEnum("role")
    .default("user")
    .notNull(),

  createdAt: timestamp("createdAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  lastSignedIn: timestamp("lastSignedIn", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/* ============================================================
   PLANS
   ============================================================ */

export const plans = pgTable("plans", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

  key: varchar("key", {
    length: 32,
  })
    .notNull()
    .unique(),

  name: varchar("name", {
    length: 80,
  }).notNull(),

  priceMzn: integer("priceMzn")
    .notNull()
    .default(0),

  productLimit: integer("productLimit")
    .notNull()
    .default(10),

  status: planStatusEnum("status")
    .notNull()
    .default("active"),

  features: text("features")
    .notNull(),

  createdAt: timestamp("createdAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/* ============================================================
   STORES
   ============================================================ */

export const stores = pgTable("stores", {
  id: varchar("id", {
    length: 64,
  }).primaryKey(),

  name: varchar("name", {
    length: 120,
  }).notNull(),

  slug: varchar("slug", {
    length: 120,
  })
    .notNull()
    .unique(),

  category: varchar("category", {
    length: 80,
  })
    .notNull()
    .default("General"),

  planKey: varchar("planKey", {
    length: 32,
  })
    .notNull()
    .default("free"),

  status: storeStatusEnum("status")
    .notNull()
    .default("draft"),

  currency: varchar("currency", {
    length: 8,
  })
    .notNull()
    .default("MZN"),

  whatsapp: varchar("whatsapp", {
    length: 40,
  }),

  /*
   * Subscrição mensal do plano.
   *
   * null para lojas no plano Free.
   * Para planos pagos: até quando o período
   * pago está válido.
   */
  subscriptionPaidUntil: timestamp(
    "subscriptionPaidUntil",
    {
      withTimezone: true,
    },
  ),

  /*
   * Quando o último pagamento foi registado
   * pelo admin ("Mark as Paid").
   */
  subscriptionPaidAt: timestamp(
    "subscriptionPaidAt",
    {
      withTimezone: true,
    },
  ),

  /*
   * Tema visual escolhido pela loja.
   *
   * null = ainda não escolheu nenhum tema.
   *
   * Exemplos:
   * "nova"
   * "luxe"
   * "market"
   * "urban"
   * "essenza"
   * "prime"
   * "caliza"
   * "chazuca"
   */
  themeKey: varchar("themeKey", {
    length: 32,
  }),

  /*
   * Identidade visual da loja (não do tema).
   *
   * Guardam CHAVES R2 (não URLs assinadas) sob
n   * stores/{storeId}/branding/.
   * null = usar o visual demo do tema.
   */
  logoKey: varchar("logoKey", {
    length: 255,
  }),

  bannerKey: varchar("bannerKey", {
    length: 255,
  }),

  /*
   * Banners adicionais da loja (para além do
   * bannerKey legado). Guardam CHAVES R2 sob
   * stores/{storeId}/branding/.
   * Array vazio = nenhum banner extra.
   */
  bannerKeys: text("bannerKeys")
    .array()
    .notNull()
    .default([]),

  /*
   * Modelo dos cartões de produto no tema Nova.
   * null = modelo atual (1).
   * Valores: "1".."5" (ver BrandingPage / ProductCard).
   */
  productCardModel: varchar("productCardModel", {
    length: 8,
  }),

  /*
   * Modelo de banner do carrossel (tema Nova).
   * null = modelo atual (1).
   * Valores: "1".."5" (ver bannerModels).
   */
  bannerModel: varchar("bannerModel", {
    length: 8,
  }),

  /*
   * Título/subtítulo por banner (tema Nova).
   * Array paralelo a bannerKeys+bannerKey (após
   * achatamento), por índice de slide.
   */
  bannerTexts: jsonb("bannerTexts")
    .$type<{ title?: string; subtitle?: string }[]>()
    .notNull()
    .default([]),

  /*
   * Elementos opcionais por banner (tema Nova):
   * mapa keyed por chave R2 do banner → botão, texto,
   * animação e contagem decrescente independentes.
   */
  bannerFeatures: jsonb("bannerFeatures")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),

  createdAt: timestamp("createdAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/* ============================================================
   STORE MEMBERS
   ============================================================ */

export const storeMembers = pgTable("storeMembers", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

  storeId: varchar("storeId", {
    length: 64,
  }).notNull(),

  userId: integer("userId")
    .notNull(),

  role: storeMemberRoleEnum("role")
    .notNull()
    .default("owner"),

  createdAt: timestamp("createdAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/* ============================================================
   STORE APPLICATIONS
   ============================================================ */

/**
 * Candidaturas para criação de novas lojas.
 *
 * O utilizador primeiro envia uma candidatura.
 * A loja só deve ser ativada depois da aprovação
 * do administrador.
 */

export const storeApplications = pgTable("storeApplications", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

  userId: integer("userId")
    .notNull(),

  status: applicationStatusEnum("status")
    .notNull()
    .default("pending"),

  businessTypes: text("businessTypes"),

  fullName: varchar("fullName", {
    length: 160,
  }).notNull(),

  username: varchar("username", {
    length: 80,
  }).notNull(),

  phone: varchar("phone", {
    length: 40,
  }).notNull(),

  alternativePhone: varchar("alternativePhone", {
    length: 40,
  }),

  whatsapp: varchar("whatsapp", {
    length: 40,
  }),

  country: varchar("country", {
    length: 80,
  }).notNull(),

  province: varchar("province", {
    length: 100,
  }),

  district: varchar("district", {
    length: 100,
  }),

  neighborhood: varchar("neighborhood", {
    length: 120,
  }),

  storeName: varchar("storeName", {
    length: 120,
  }).notNull(),

  storeSlug: varchar("storeSlug", {
    length: 120,
  }).notNull(),

  notes: text("notes"),

  adminNotes: text("adminNotes"),

  createdAt: timestamp("createdAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  reviewedAt: timestamp("reviewedAt", {
    withTimezone: true,
  }),
});

/* ============================================================
   PLAN REQUESTS
   ============================================================ */

/**
 * Pedidos de upgrade de plano.
 *
 * O proprietário da loja pede um plano superior.
 * O limite só aumenta depois de aprovação manual
 * do administrador.
 */

export const planRequests = pgTable("planRequests", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

  storeId: varchar("storeId", {
    length: 64,
  }).notNull(),

  requestedPlanKey: varchar("requestedPlanKey", {
    length: 32,
  }).notNull(),

  currentPlanKey: varchar("currentPlanKey", {
    length: 32,
  }).notNull(),

  productsUsed: integer("productsUsed")
    .notNull()
    .default(0),

  status: planRequestStatusEnum("status")
    .notNull()
    .default("pending"),

  note: text("note"),

  adminNotes: text("adminNotes"),

  /*
   * Plano efetivamente atribuído pelo admin.
   * Pode diferir do pedido (ex.: aprovar Business
   * quando foi pedido Professional).
   */
  assignedPlanKey: varchar("assignedPlanKey", {
    length: 32,
  }),

  createdAt: timestamp("createdAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  reviewedAt: timestamp("reviewedAt", {
    withTimezone: true,
  }),
});

/* ============================================================
   STORE CATEGORIES
   ============================================================ */

/*
 * Categorias criadas pelo utilizador para a sua loja.
 * São a única fonte de categorias no selector de produtos:
 * nada é derivado de produtos nem pré-preenchido.
 */
export const storeCategories = pgTable("store_categories", {
  id: varchar("id", {
    length: 64,
  }).primaryKey(),

  storeId: varchar("storeId", {
    length: 64,
  }).notNull(),

  name: varchar("name", {
    length: 80,
  }).notNull(),

  createdAt: timestamp("createdAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/* ============================================================
   PRODUCTS
   ============================================================ */

export const products = pgTable("products", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

  storeId: varchar("storeId", {
    length: 64,
  }).notNull(),

  name: varchar("name", {
    length: 180,
  }).notNull(),

  slug: varchar("slug", {
    length: 180,
  }).notNull(),

  description: text("description"),

  priceMzn: integer("priceMzn")
    .notNull(),

  compareAtPriceMzn: integer("compareAtPriceMzn"),

  sku: varchar("sku", {
    length: 80,
  }),

  stock: integer("stock")
    .notNull()
    .default(0),

  /*
   * Categoria do produto. null = Sem categoria.
   * O valor tem de ser o nome de uma categoria da
   * própria loja (validado no router).
   */
  category: varchar("category", {
    length: 80,
  }),

  status: productStatusEnum("status")
    .notNull()
    .default("draft"),

  imageUrl: text("imageUrl"),

  imageKeys: text("imageKeys")
    .array()
    .notNull()
    .default([]),

  options: jsonb("options")
    .$type<
      {
        name: string;
        values: string[];
      }[]
    >()
    .notNull()
    .default([]),

  createdAt: timestamp("createdAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/* ============================================================
   TYPES
   ============================================================ */

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Store = typeof stores.$inferSelect;

export type StoreApplication =
  typeof storeApplications.$inferSelect;

export type InsertStoreApplication =
  typeof storeApplications.$inferInsert;

export type Product = typeof products.$inferSelect;

export type InsertProduct =
  typeof products.$inferInsert;

export type StoreCategory =
  typeof storeCategories.$inferSelect;

export type InsertStoreCategory =
  typeof storeCategories.$inferInsert;

export type PlanRequest =
  typeof planRequests.$inferSelect;

export type InsertPlanRequest =
  typeof planRequests.$inferInsert;
