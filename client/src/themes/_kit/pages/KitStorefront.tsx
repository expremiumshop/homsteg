import { useMemo } from "react";
import { Store } from "lucide-react";

import { trpc } from "@/lib/trpc";

import { KitHeader, type KitHeaderCategory } from "../components/KitHeader";
import {
  KitBannerCarousel,
  KitBenefitsSection,
  KitCategoryMenu,
  KitPromotionBanner,
  KitStoreInfo,
  KitTopBenefits,
} from "../components/KitSections";
import { KitProductGrid } from "../components/KitProductGrid";
import { KitFooter } from "../components/KitFooter";
import { KitBottomNavigation } from "../components/KitBottomNavigation";
import { slugify } from "../lib";
import { ThemeStyleScope } from "../ThemeStyleScope";
import type { ThemeConfig } from "../themeConfig";

export interface KitDemoData {
  store: {
    name: string;
    category: string;
    currency: string;
    country: string;
  };
  categories: string[];
  products: {
    id: number;
    name: string;
    slug: string;
    description: string;
    priceMzn: number;
    compareAtPriceMzn?: number;
    stock: number;
    category: string;
    imageUrl: string;
    featured?: boolean;
  }[];
  banners: { title: string; subtitle: string; cta: string; image: string }[];
  topBenefits: { title: string }[];
  promotion: { title: string; subtitle: string; cta: string };
}

type StoreData = {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  currency?: string | null;
  status?: string | null;
  whatsapp?: string | null;
};

type ProductData = {
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;
  priceMzn: number;
  compareAtPriceMzn?: number | null;
  stock: number;
  category: string;
  status: "draft" | "active" | "archived" | string;
  imageUrl?: string | null;
};

export interface KitStorefrontProps {
  theme: ThemeConfig;
  demo: KitDemoData;
  mode?: "demo" | "store";
  storeId?: string;
  storeSlug?: string;
  headerVariant?: "auto" | "desktop" | "mobile";
}

/**
 * ============================================================
 * STOREFRONT DA _kit
 * ============================================================
 *
 * Espelho funcional da NovaStorefront: modo demo, modo loja
 * pública por slug, modo interno por storeId, loading, erro e
 * todas as secções na mesma ordem.
 */
export function KitStorefront({
  theme,
  demo,
  mode = "store",
  storeId,
  storeSlug,
  headerVariant,
}: KitStorefrontProps) {
  const isDemo = mode === "demo";
  const basePath = `/themes/${theme.key}`;

  const demoStore: StoreData = {
    id: `${theme.key}-demo`,
    name: demo.store.name,
    slug: `${theme.key}-demo`,
    category: demo.store.category,
    currency: demo.store.currency,
    status: "active",
  };

  const demoProducts: ProductData[] = demo.products.map((p) => ({
    ...p,
    status: "active",
  }));

  /* ---------- consultas (idênticas à Nova) ---------- */

  const publicStoreQuery = trpc.stores.bySlug.useQuery(
    { slug: storeSlug ?? "" },
    { enabled: !isDemo && Boolean(storeSlug) },
  );

  const storesQuery = trpc.stores.mine.useQuery(undefined, {
    enabled: !isDemo && !storeSlug,
  });

  const accountStore = storesQuery.data?.[0] as
    | (StoreData | { store: StoreData })
    | undefined;

  const storeById = storeId
    ? (storesQuery.data ?? []).find((item) => {
        const possible = "store" in item ? item.store : item;
        return String(possible.id) === String(storeId);
      })
    : undefined;

  const internalStore = storeById
    ? (("store" in storeById ? storeById.store : storeById) as StoreData)
    : (accountStore as StoreData | undefined);

  const publicStore = publicStoreQuery.data?.store as StoreData | undefined;

  const realStore = storeSlug ? publicStore : internalStore;
  const store = isDemo ? demoStore : realStore;

  const internalProductsQuery = trpc.products.list.useQuery(
    { storeId: store?.id ?? "" },
    {
      enabled: !isDemo && !storeSlug && Boolean(store?.id),
    },
  );

  const products: ProductData[] = isDemo
    ? demoProducts
    : storeSlug
      ? ((publicStoreQuery.data?.products ?? []) as ProductData[])
      : ((internalProductsQuery.data ?? []) as ProductData[]);

  const categories = isDemo
    ? demo.categories
    : [
        "Todos",
        ...Array.from(
          new Set(
            products.map((p) => p.category).filter(Boolean),
          ),
        ),
      ];

  const headerCategories: KitHeaderCategory[] = categories.map(
    (category, index) => ({
      id: `category-${index}-${category}`,
      name: category,
      slug: category === "Todos" ? "todas" : slugify(category),
      active: true,
    }),
  );

  const activeProducts = products.filter((p) => p.status !== "archived");

  const kitProducts = useMemo(
    () =>
      activeProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        image: p.imageUrl,
        price: p.priceMzn,
        compare_at_price: p.compareAtPriceMzn,
        featured: false,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products],
  );

  const isStoreLoading = !isDemo
    ? storeSlug
      ? publicStoreQuery.isLoading
      : storesQuery.isLoading && !storeId
    : false;

  const isProductsLoading = !isDemo
    ? storeSlug
      ? publicStoreQuery.isLoading
      : internalProductsQuery.isLoading
    : false;

  /* ---------- estados ---------- */

  if (!isDemo && isStoreLoading) {
    return (
      <ThemeStyleScope theme={theme}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div
              className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4"
              style={{
                borderColor: "var(--tk-border)",
                borderTopColor: "var(--tk-primary)",
              }}
            />
            <p className="text-sm text-[var(--tk-muted)]">A carregar o tema...</p>
          </div>
        </div>
      </ThemeStyleScope>
    );
  }

  const storeQueryError = storeSlug
    ? publicStoreQuery.isError
    : storesQuery.isError;

  if (!isDemo && (!store || storeQueryError)) {
    return (
      <ThemeStyleScope theme={theme}>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div
            className="w-full max-w-md p-8 text-center"
            style={{
              background: "var(--tk-surface)",
              borderRadius: "var(--tk-card-radius)",
              border: "1px solid var(--tk-border)",
            }}
          >
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center"
              style={{
                borderRadius: "999px",
                background:
                  "color-mix(in srgb, var(--tk-primary) 12%, transparent)",
                color: "var(--tk-primary)",
              }}
            >
              <Store className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-semibold text-[var(--tk-text)]">
              Loja não encontrada
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">
              Não foi possível encontrar a loja solicitada.
            </p>
          </div>
        </div>
      </ThemeStyleScope>
    );
  }

  /* ---------- storefront ---------- */

  return (
    <ThemeStyleScope theme={theme}>
      <div className="min-h-screen">
        <KitHeader
          theme={theme}
          storeName={store?.name ?? theme.name}
          storeSlug={store?.slug}
          categories={headerCategories}
          categoriesLoading={isProductsLoading}
          cartCount={0}
          basePath={basePath}
          variant={headerVariant}
        />

        <main>
          <KitBannerCarousel slides={demo.banners} />
          <KitTopBenefits items={demo.topBenefits} />
          <KitCategoryMenu categories={categories} />

          <KitProductGrid
            products={kitProducts}
            basePath={basePath}
            storeName={store?.name ?? theme.name}
            storeSlug={store?.slug ?? storeSlug ?? ""}
            loading={isProductsLoading}
            error={
              storeSlug
                ? publicStoreQuery.isError
                  ? "Não foi possível carregar os produtos."
                  : null
                : internalProductsQuery.isError
                  ? "Não foi possível carregar os produtos."
                  : null
            }
          />

          <KitPromotionBanner
            title={demo.promotion.title}
            subtitle={demo.promotion.subtitle}
            cta={demo.promotion.cta}
          />

          <KitBenefitsSection storeName={store?.name ?? theme.name} />

          <KitStoreInfo
            name={store?.name ?? theme.name}
            category={store?.category}
            currency={store?.currency}
          />
        </main>

        <KitFooter
          storeName={store?.name ?? theme.name}
          whatsappNumber={store?.whatsapp ?? ""}
          basePath={basePath}
        />

        <KitBottomNavigation
          cartCount={0}
          basePath={basePath}
          storeSlug={store?.slug}
        />
      </div>
    </ThemeStyleScope>
  );
}

export default KitStorefront;
