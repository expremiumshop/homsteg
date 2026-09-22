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

  category: varchar("category", {
    length: 80,
  })
    .notNull()
    .default("General"),

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
