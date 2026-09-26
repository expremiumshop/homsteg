import { useMemo, useState } from "react";

import { Store } from "lucide-react";

import { trpc } from "@/lib/trpc";

import { useCart } from "@/contexts/CartContext";

import { TopBar } from "./components/TopBar";
import { Header } from "./components/Header";
import { MobileMenu } from "./components/MobileMenu";
import { HeroCarousel } from "./components/HeroCarousel";
import { TopBenefits } from "./components/TopBenefits";
import { CategoryMenu } from "./components/CategoryMenu";
import { ProductSection } from "./components/ProductSection";
import { PromotionBanner } from "./components/PromotionBanner";
import { BenefitsSection } from "./components/BenefitsSection";
import { StoreInfo } from "./components/StoreInfo";
import { Footer } from "./components/Footer";
import { BottomNavigation } from "./components/BottomNavigation";

import {
  calizaDemoCategories,
  calizaDemoProducts,
  type CalizaMode,
  type CalizaProduct,
  type CalizaStore,
} from "./demoData";

import { useThemeFonts } from "./useThemeFonts";

import {
  calizaColors,
  calizaBodyFont,
} from "./theme";

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
  featured?: boolean;
};

type CalizaStorefrontProps = {
  mode?: CalizaMode;
  storeId?: string;
  storeSlug?: string;
  headerVariant?: "auto" | "desktop" | "mobile";
};

export default function CalizaStorefront({
  mode = "demo",
  storeId,
  storeSlug,
  headerVariant,
}: CalizaStorefrontProps) {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useThemeFonts();

  const { totalItems } = useCart();

  const isDemo = mode === "demo";

  /* =========================================================
     MODO DEMO
     ========================================================= */

  const demoStore: StoreData = {
    id: "caliza-demo",
    name: "Caliza Studio",
    slug: "caliza-demo",
    category: "Moderno",
    currency: "MZN",
    status: "active",
  };

  const demoProducts: ProductData[] =
    calizaDemoProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      priceMzn: product.price,
      compareAtPriceMzn: product.oldPrice ?? null,
      stock: product.stock,
      category: product.category,
      status: "active",
      imageUrl: product.image,
      featured: product.featured,
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
    | { store: StoreData }
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
    ? ((("store" in storeById
        ? storeById.store
        : storeById) as StoreData))
    : ((accountStore as
        | StoreData
        | undefined
        | { store: StoreData }) as
        | StoreData
        | undefined);

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
      return calizaDemoCategories;
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

  const calizaProducts =
    useMemo<CalizaProduct[]>(() => {
      const active =
        isDemo
          ? demoProducts
          : products.filter(
              (product) =>
                product.status !==
                "archived",
            );

      return active.map(
        (product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description:
            product.description ??
            "Peça disponível nesta loja Caliza.",
          price: Number(
            product.priceMzn ?? 0,
          ),
          oldPrice:
            product.compareAtPriceMzn == null
              ? null
              : Number(
                  product.compareAtPriceMzn,
                ),
          stock: Number(
            product.stock ?? 0,
          ),
          category:
            product.category || "Produtos",
          featured: product.featured,
          image:
            product.imageUrl ||
            null,
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
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          background: calizaColors.bg,
        }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2"
            style={{
              borderColor:
                calizaColors.border,
              borderTopColor:
                calizaColors.primary,
            }}
          />

          <p
            className="text-xs uppercase tracking-[0.16em]"
            style={{
              color:
                calizaColors.textMuted,
            }}
          >
            A carregar
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
      <div
        className="flex min-h-screen items-center justify-center px-5"
        style={{
          background: calizaColors.bg,
        }}
      >
        <div
          className="w-full max-w-md rounded-2xl border p-10 text-center"
          style={{
            background:
              calizaColors.surface,
            borderColor:
              calizaColors.border,
          }}
        >
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              background:
                "color-mix(in srgb, #c2410c 12%, transparent)",
              color: "#c2410c",
            }}
          >
            <Store
              size={26}
              strokeWidth={1.5}
            />
          </div>

          <h1
            className="text-2xl"
            style={{
              fontFamily:
                "'Playfair Display', Georgia, serif",
              fontWeight: 500,
              color: calizaColors.text,
            }}
          >
            Loja não encontrada
          </h1>

          <p
            className="mt-2 text-sm leading-6"
            style={{
              color:
                calizaColors.textMuted,
            }}
          >
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

  function scrollToProducts() {
    document
      .getElementById("products")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  return (
    <div
      data-theme="caliza"
      data-mode={mode}
      className="min-h-screen"
      style={{
        background: calizaColors.bg,
        color: calizaColors.text,
        fontFamily: calizaBodyFont,
      }}
    >
      <TopBar
        storeName={store?.name}
        storeSlug={store?.slug}
      />

      <Header
        storeName={
          store?.name ?? "Caliza Studio"
        }
        categories={headerCategories}
        categoriesLoading={
          isProductsLoading
        }
        cartCount={totalItems}
        storeSlug={store?.slug}
        search={search}
        onSearch={setSearch}
        onMenu={() =>
          setMobileMenuOpen(true)
        }
        headerVariant={headerVariant}
      />

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() =>
          setMobileMenuOpen(false)
        }
        storeName={
          store?.name ?? "Caliza Studio"
        }
        storeSlug={store?.slug}
      />

      <main className="pb-24 md:pb-0">
        <HeroCarousel
          onCta={scrollToProducts}
        />

        <TopBenefits />

        <CategoryMenu
          categories={categories}
          category={category}
          onCategory={setCategory}
          onScrollToProducts={
            scrollToProducts
          }
        />

        <ProductSection
          products={calizaProducts}
          categories={categories}
          category={category}
          onCategory={setCategory}
          search={search}
          onSearch={setSearch}
          storeSlug={store?.slug}
          loading={isProductsLoading}
          error={
            !isDemo &&
            (storeSlug
              ? publicStoreQuery.isError
              : internalProductsQuery.isError)
              ? "Não foi possível carregar as peças."
              : null
          }
        />

        <PromotionBanner
          onCta={scrollToProducts}
        />

        <BenefitsSection
          storeName={
            store?.name ?? "Caliza Studio"
          }
        />

        <StoreInfo
          name={store?.name ?? "Caliza Studio"}
          category={store?.category}
          currency={store?.currency}
        />
      </main>

      <Footer
        storeName={
          store?.name ?? "Caliza Studio"
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
