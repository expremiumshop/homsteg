import { useMemo, useState } from "react";

import { Store } from "lucide-react";

import { trpc } from "@/lib/trpc";

import { useCart } from "@/contexts/CartContext";

import { TopBar } from "./components/TopBar";
import { Header } from "./components/Header";
import { HeroCarousel } from "./components/HeroCarousel";
import { ServiceBar } from "./components/ServiceBar";
import { CategoryGrid } from "./components/CategoryGrid";
import { ProductSection } from "./components/ProductSection";
import { PromotionBanner } from "./components/PromotionBanner";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { BottomNavigation } from "./components/BottomNavigation";

import {
  marketDemoCategories,
  marketDemoProducts,
  type MarketProduct,
} from "./demoData";

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

type MarketStorefrontProps = {
  mode?: "demo" | "store";
  storeId?: string;
  storeSlug?: string;
  headerVariant?: "auto" | "desktop" | "mobile";
};

export default function MarketStorefront({
  mode = "demo",
  storeId,
  storeSlug,
  headerVariant,
}: MarketStorefrontProps) {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const { totalItems } = useCart();

  const isDemo = mode === "demo";

  /* =========================================================
     MODO DEMO
     ========================================================= */

  const demoStore: StoreData = {
    id: "market-demo",
    name: "Market Central",
    slug: "market-demo",
    category: "Marketplace",
    currency: "MZN",
    status: "active",
  };

  const demoProducts: ProductData[] =
    marketDemoProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug:
        product.slug ??
        product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
      description: product.description,
      priceMzn: product.price,
      compareAtPriceMzn: product.oldPrice ?? null,
      stock: product.stock ?? 12,
      category: product.category,
      status: "active",
      imageUrl: product.image,
    }));

  /* =========================================================
     MODO LOJA REAL
     ========================================================= */

  const publicStoreQuery = trpc.stores.bySlug.useQuery(
    { slug: storeSlug ?? "" },
    { enabled: !isDemo && Boolean(storeSlug) },
  );

  const storesQuery = trpc.stores.mine.useQuery(undefined, {
    enabled: !isDemo && !storeSlug,
  });

  const accountStore = storesQuery.data?.[0] as
    | StoreData
    | undefined;

  const storeById = storeId
    ? (storesQuery.data ?? []).find((item) => {
        const possible =
          "store" in item ? item.store : item;

        return (
          String(possible.id) ===
          String(storeId)
        );
      })
    : undefined;

  const internalStore = storeById
    ? (("store" in storeById
        ? storeById.store
        : storeById) as StoreData)
    : accountStore;

  const publicStore = publicStoreQuery.data
    ?.store as StoreData | undefined;

  const realStore = storeSlug
    ? publicStore
    : internalStore;

  const store = isDemo ? demoStore : realStore;

  /* =========================================================
     PRODUTOS
     ========================================================= */

  const internalProductsQuery =
    trpc.products.list.useQuery(
      { storeId: store?.id ?? "" },
      {
        enabled:
          !isDemo &&
          !storeSlug &&
          Boolean(store?.id),
      },
    );

  const products: ProductData[] = isDemo
    ? demoProducts
    : storeSlug
      ? ((publicStoreQuery.data?.products ??
          []) as ProductData[])
      : ((internalProductsQuery.data ??
          []) as ProductData[]);

  /* =========================================================
     CATEGORIAS
     ========================================================= */

  const categories = useMemo(() => {
    if (isDemo) {
      return [
        "Todos",
        ...marketDemoCategories.map(
          (item) => item.name,
        ),
      ];
    }

    return [
      "Todos",
      ...Array.from(
        new Set(
          products
            .map(
              (product) =>
                product.category,
            )
            .filter(Boolean),
        ),
      ),
    ];
  }, [isDemo, products]);

  const headerCategories = categories.map(
    (categoryName, index) => ({
      id: `category-${index}-${categoryName}`,
      name: categoryName,
    }),
  );

  /* =========================================================
     PRODUTOS PARA O GRID
     ========================================================= */

  const marketProducts =
    useMemo<MarketProduct[]>(() => {
      const active =
        isDemo
          ? demoProducts
          : products.filter(
              (product) =>
                product.status !==
                "archived",
            );

      return active.map(
        (product, index) => ({
          id: Number(product.id) || index + 1,
          name: product.name,
          category:
            product.category || "Produtos",
          price: Number(
            product.priceMzn ?? 0,
          ),
          oldPrice:
            product.compareAtPriceMzn == null
              ? undefined
              : Number(
                  product.compareAtPriceMzn,
                ),
          rating: 4.8,
          reviews: 0,
          sold: 0,
          image:
            product.imageUrl ||
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=88",
          description:
            product.description ??
            "Produto disponível nesta loja Market.",
          slug: product.slug,
          stock: Number(
            product.stock ?? 0,
          ),
        }),
      );
    }, [isDemo, products]);

  /* =========================================================
     LOADING
     ========================================================= */

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

  if (
    !isDemo &&
    (!store || storeQueryError)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <Store className="h-7 w-7 text-emerald-600" />
          </div>

          <h1 className="text-xl font-black tracking-tight text-slate-950">
            Loja não encontrada
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Não foi possível encontrar a
            loja solicitada.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     STOREFRONT
     ========================================================= */

  return (
    <div
      data-theme="market"
      data-mode={mode}
      className="min-h-screen bg-slate-50 font-sans text-slate-900"
    >
      <TopBar
        storeName={store?.name}
        storeSlug={store?.slug}
      />

      <Header
        storeName={
          store?.name ?? "Market"
        }
        categories={headerCategories}
        categoriesLoading={
          isProductsLoading
        }
        cartCount={totalItems}
        storeSlug={store?.slug}
        search={search}
        onSearch={setSearch}
        headerVariant={headerVariant}
      />

      <main className="pb-24 md:pb-0">
        <HeroCarousel />

        <ServiceBar />

        <CategoryGrid
          category={category}
          onCategory={setCategory}
          onScrollToProducts={() =>
            document
              .getElementById("products")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        />

        <ProductSection
          products={marketProducts}
          category={category}
          onCategory={setCategory}
          search={search}
          onSearch={setSearch}
          storeSlug={store?.slug}
        />

        <PromotionBanner />

        <Newsletter />
      </main>

      <Footer
        storeName={
          store?.name ?? "Market"
        }
        storeSlug={store?.slug}
      />

      <BottomNavigation
        cartCount={totalItems}
        storeSlug={store?.slug}
      />
    </div>
  );
}
