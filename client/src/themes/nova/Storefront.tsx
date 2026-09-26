import { Store } from "lucide-react";

import { trpc } from "@/lib/trpc";

import Header, {
  type NovaHeaderCategory,
} from "./components/Header";
import BannerCarousel from "./components/BannerCarousel";
import { TopBenefits } from "./components/TopBenefits";
import { CategoryMenu } from "./components/CategoryMenu";
import {
  ProductGrid,
  type NovaProduct,
} from "./components/ProductGrid";
import { PromotionBanner } from "./components/PromotionBanner";
import { BenefitsSection } from "./components/BenefitsSection";
import { BottomNavigation } from "./components/BottomNavigation";
import Footer from "./components/Footer";
import {
  novaDemoProducts,
  novaDemoStore,
  novaDemoCategories,
  type NovaDemoProduct,
} from "./demoData";

type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  priceMzn: number;
  compareAtPriceMzn?: number | null;
  stock: number;
  category: string;
  status: "draft" | "active" | "archived";
  imageUrl?: string | null;
};

type StoreData = {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  currency?: string | null;
  status?: string | null;
  whatsapp?: string | null;
};

type NovaStorefrontProps = {
  mode?: "demo" | "store";
  storeId?: string;
  storeSlug?: string;

  /**
   * Repassado ao Header para as pré-visualizações
   * por dispositivo (ver NovaHeaderProps).
   */
  headerVariant?: "auto" | "desktop" | "mobile";
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NovaStorefront({
  mode = "store",
  storeId,
  storeSlug,
  headerVariant,
}: NovaStorefrontProps) {
  const isDemo = mode === "demo";

  /* =========================================================
     MODO DEMO
     ========================================================= */

  const demoStore: StoreData = {
    id: "nova-demo",
    name: novaDemoStore.name,
    slug: "nova-demo",
    category: novaDemoStore.category,
    currency: novaDemoStore.currency,
    status: "active",
  };

  const demoProducts: Product[] = novaDemoProducts.map(
    (product: NovaDemoProduct) => ({
      ...product,
      status: "active",
    }),
  );

  /* =========================================================
     MODO LOJA REAL

     Existem dois cenários:

     1. /store/:slug
        → consulta pública pelo slug.

     2. Modo interno com storeId
        → continua usando stores.mine + products.list,
          mantendo a proteção existente.
     ========================================================= */

  const publicStoreQuery = trpc.stores.bySlug.useQuery(
    {
      slug: storeSlug ?? "",
    },
    {
      enabled: !isDemo && Boolean(storeSlug),
    },
  );

  const storesQuery = trpc.stores.mine.useQuery(undefined, {
    enabled: !isDemo && !storeSlug,
  });

  const accountStore = storesQuery.data?.[0] as
    | StoreData
    | undefined;

  const storeById = storeId
    ? (storesQuery.data ?? []).find((item) => {
        const possibleStore =
          "store" in item ? item.store : item;

        return (
          String(possibleStore.id) ===
          String(storeId)
        );
      })
    : undefined;

  const internalStore = storeById
    ? ((
        "store" in storeById
          ? storeById.store
          : storeById
      ) as StoreData)
    : accountStore;

  const publicStore = publicStoreQuery.data?.store as
    | StoreData
    | undefined;

  const realStore = storeSlug
    ? publicStore
    : internalStore;

  const store = isDemo ? demoStore : realStore;

  /* =========================================================
     PRODUTOS
     ========================================================= */

  const internalProductsQuery =
    trpc.products.list.useQuery(
      {
        storeId: store?.id ?? "",
      },
      {
        enabled:
          !isDemo &&
          !storeSlug &&
          Boolean(store?.id),
      },
    );

  const products: Product[] = isDemo
    ? demoProducts
    : storeSlug
      ? ((publicStoreQuery.data?.products ??
          []) as Product[])
      : ((internalProductsQuery.data ??
          []) as Product[]);

  /* =========================================================
     CATEGORIAS
     ========================================================= */

  const categories = isDemo
    ? novaDemoCategories
    : [
        "Todos",
        ...Array.from(
          new Set(
            products
              .map((product) => product.category)
              .filter(Boolean),
          ),
        ),
      ];

  /* =========================================================
     CATEGORIAS PARA O HEADER
     ========================================================= */

  const headerCategories: NovaHeaderCategory[] =
    categories.map((category, index) => ({
      id: `category-${index}-${category}`,
      name: category,
      slug:
        category === "Todos"
          ? "todas"
          : slugify(category),
      active: true,
    }));

  /* =========================================================
     PRODUTOS
     ========================================================= */

  const activeProducts = products.filter(
    (product) => product.status !== "archived",
  );

  const novaProducts: NovaProduct[] =
    activeProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      image: product.imageUrl,
      price: product.priceMzn,
      compare_at_price:
        product.compareAtPriceMzn,
      featured: false,
      active: product.status === "active",
    }));

  /* =========================================================
     LOADING
     ========================================================= */

  const isStoreLoading =
    !isDemo && Boolean(storeSlug)
      ? publicStoreQuery.isLoading
      : storesQuery.isLoading && !storeId;

  const isProductsLoading =
    !isDemo && Boolean(storeSlug)
      ? publicStoreQuery.isLoading
      : internalProductsQuery.isLoading;

  if (!isDemo && isStoreLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="text-sm text-slate-500">
            A carregar o tema...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     LOJA NÃO ENCONTRADA
     ========================================================= */

  const storeQueryError = storeSlug
    ? publicStoreQuery.isError
    : storesQuery.isError;

  if (!isDemo && (!store || storeQueryError)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <Store className="h-7 w-7 text-emerald-600" />
          </div>

          <h1 className="text-xl font-semibold text-slate-950">
            Loja não encontrada
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Não foi possível encontrar a loja solicitada.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     STORE FRONT
     ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <Header
        storeName={
          store?.name ?? "NOVA STORE"
        }
        storeSlug={store?.slug}
        categories={headerCategories}
        categoriesLoading={isProductsLoading}
        cartCount={0}
        whatsappNumber={store?.whatsapp ?? ""}
        basePath="/themes/nova"
        currency={store?.currency || "MZN"}
        country="Moçambique"
        headerVariant={headerVariant}
      />

      <main>
        {/* =====================================================
            BANNER PRINCIPAL
            ===================================================== */}

        <BannerCarousel />

        {/* =====================================================
            BENEFÍCIOS SUPERIORES
            ===================================================== */}

        <TopBenefits />

        {/* =====================================================
            CATEGORIAS
            ===================================================== */}

        <CategoryMenu />

        {/* =====================================================
            PRODUTOS
            ===================================================== */}

        <ProductGrid
          products={novaProducts}
          loading={isProductsLoading}
          error={
            (
              storeSlug
                ? publicStoreQuery.isError
                : internalProductsQuery.isError
            )
              ? "Não foi possível carregar os produtos."
              : null
          }
          storeName={
            store?.name ?? "NOVA STORE"
          }
          storeSlug={
            store?.slug ??
            storeSlug ??
            ""
          }
        />

        {/* =====================================================
            BANNER PROMOCIONAL
            ===================================================== */}

        <PromotionBanner />

        {/* =====================================================
            BENEFÍCIOS + SOBRE A LOJA
            ===================================================== */}

        <BenefitsSection
          storeName={
            store?.name ?? "NOVA STORE"
          }
        />

        {/* =====================================================
            INFORMAÇÕES DA LOJA
            ===================================================== */}

        <section className="border-t border-slate-200 bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-bold text-white">
                  {getInitials(
                    store?.name ?? "",
                  ) || "N"}
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    Sobre a loja
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-950">
                    {store?.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {store?.category ||
                      "Comércio online"}{" "}
                    · Moçambique
                  </p>
                </div>

                <div className="rounded-xl bg-white px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Moeda
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {store?.currency || "MZN"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <Footer
        storeName={
          store?.name ?? "NOVA STORE"
        }
        whatsappNumber={store?.whatsapp ?? ""}
        basePath="/themes/nova"
      />

      {/* =====================================================
          NAVEGAÇÃO MOBILE
          ===================================================== */}

      <BottomNavigation
        cartCount={0}
        whatsappNumber={store?.whatsapp ?? ""}
        basePath="/themes/nova"
        storeSlug={store?.slug}
      />
    </div>
  );
}
