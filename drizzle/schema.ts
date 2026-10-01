import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/* ============================================================
   ENUMS
   ============================================================ */

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
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

  /*
   * Campo histórico mantido para compatibilidade com
   * dados antigos. Sempre "free": a HOMSTEG é uma
   * plataforma 100% gratuita, sem planos.
   */
  planKey: varchar("planKey", {
    length: 32,
  })
    .notNull()
    .default("free"),

  /*
   * Crédito da loja (MZN).
   *
   * O único sistema pago da HOMSTEG: o crédito é
   * usado APENAS para comprar/desbloquear
   * funcionalidades, modelos e componentes no
   * Market. Definido/acrescentado manualmente pelo
   * Admin (secção "Créditos"); 0 = sem crédito.
   * Criar e usar a loja é sempre gratuito.
   */
  creditMzn: integer("creditMzn")
    .notNull()
    .default(0),

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
   * Modelo dos botões de navegação (tema Nova).
   * null = modelo atual (1).
   * Valores: "1".."5" (ver navButtonModels).
   */
  navButtonModel: varchar("navButtonModel", {
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
   MARKET FEATURES
   ============================================================ */

/*
 * Catálogo comercial do módulo MARKET.
 *
 * O que se vende no Market são FUNCIONALIDADES de
 * personalização da loja (header, banner, category-card,
 * product-card, footer) — nunca produtos físicos.
 *
 * Cada linha é uma "funcionalidade Market": um componente
 * estrutural comercializado em créditos.
 *
 * A estrutura de código de cada funcionalidade vive
 * isolada em client/src/components/dashboard/market/
 * components/*; aqui vivem apenas os dados comerciais
 * (nome, descrição, categoria, preço em créditos e
 * status), administráveis pelo Admin sem tocar em código.
 */
export const marketFeatureStatusEnum = pgEnum(
  "market_feature_status",
  ["active", "inactive"],
);

export const marketCategoryEnum = pgEnum(
  "market_category",
  [
    "header",
    "banner",
    "category_card",
    "product_card",
    "nav_button",
    "footer",
  ],
);

export const marketFeatures = pgTable("market_features", {
  id: varchar("id", {
    length: 64,
  }).primaryKey(),

  /* Nome comercial apresentado no Market e no Admin. */
  name: varchar("name", {
    length: 120,
  }).notNull(),

  description: text("description").notNull(),

  category: marketCategoryEnum("category").notNull(),

  /*
   * Preço da funcionalidade em créditos.
   * Fonte única de verdade: nunca hardcoded no cliente.
   */
  priceCredits: integer("priceCredits")
    .notNull()
    .default(0),

  status: marketFeatureStatusEnum("status")
    .notNull()
    .default("active"),

  /*
   * Referência ao código correspondente
   * (ex.: "1header", "2banner", "3product").
   * É o elo entre o registo comercial e o componente
   * isolado em market/components/<categoria>/<featureKey>/page.tsx.
   */
  featureKey: varchar("featureKey", {
    length: 64,
  }).notNull(),

  /* Ordenação manual dentro da categoria. */
  sortOrder: integer("sortOrder")
    .notNull()
    .default(0),

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
   STORE MARKET FEATURES

   Compras/desbloqueios do Market por loja.
   Cada linha é uma funcionalidade comprada
   (ex.: "4product") por uma loja, com o preço em
   créditos registado no momento da compra.

   É a única fonte de verdade do desbloqueio: nada
   de localStorage. Uma linha por loja + featureKey
   (índice único).
   ============================================================ */
export const storeMarketFeatures = pgTable(
  "store_market_features",
  {
    id: varchar("id", {
      length: 64,
    }).primaryKey(),

    storeId: varchar("storeId", {
      length: 64,
    }).notNull(),

    /* Referência ao código do Market (ex.: "4product"). */
    featureKey: varchar("featureKey", {
      length: 64,
    }).notNull(),

    /* Preço em créditos registado no momento da compra. */
    priceCredits: integer("priceCredits")
      .notNull()
      .default(0),

    purchasedAt: timestamp("purchasedAt", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("store_market_features_store_feature_idx").on(
      table.storeId,
      table.featureKey,
    ),
    index("store_market_features_store_id_idx").on(table.storeId),
  ],
);

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

export type MarketFeature =
  typeof marketFeatures.$inferSelect;

export type InsertMarketFeature =
  typeof marketFeatures.$inferInsert;

export type StoreMarketFeature =
  typeof storeMarketFeatures.$inferSelect;

export type InsertStoreMarketFeature =
  typeof storeMarketFeatures.$inferInsert;

export type MarketCategory =
  typeof marketCategoryEnum.enumValues[number];

export type MarketFeatureStatus =
  typeof marketFeatureStatusEnum.enumValues[number];
