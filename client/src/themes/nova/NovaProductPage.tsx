"use client";

import { useMemo } from "react";

import { ArrowLeft, Store } from "lucide-react";

import { Link, useLocation, useRoute, useSearch } from "wouter";

import { trpc } from "@/lib/trpc";

import ProductGallery from "./product/ProductGallery";
import ProductTop from "./product/ProductTop";
import ProductInfo from "./product/ProductInfo";
import ProductPurchaseSection from "./product/ProductPurchaseSection";
import ShippingCard from "./product/ShippingCard";
import GuaranteeCard from "./product/GuaranteeCard";
import PromotionBar from "./product/PromotionBar";
import ProductTabs from "./product/ProductTabs";
import ReviewsSection from "./product/ReviewsSection";
import RelatedProducts from "./product/RelatedProducts";

type StoreProduct = {
  id: number | string;
  slug: string;
  name: string;
  description?: string | null;
  priceMzn: number;
  compareAtPriceMzn?: number | null;
  stock: number;
  category?: string | null;
  status?: "draft" | "active" | "archived" | string;
  imageUrl?: string | null;
  images?: string[];
  options?: {
    name: string;
    values: string[];
  }[];
};

type ProductPageProduct = {
  id: number | string;
  slug: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  description: string | null;
  category: string;
  storeName: string;
  image: string | null;
  images: {
    id: string;
    image_url: string;
    position: number;
  }[];
  options: {
    id: string;
    name: string;
    values: string[];
    position: number;
  }[];
};

type RelatedProduct = {
  id: number | string;
  slug: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  image: string | null;
};

function getStoreSlugFromSearch(search: string): string {
  const params = new URLSearchParams(search);

  return params.get("storeSlug")?.trim() ?? "";
}

function normalizeProduct(
  product: StoreProduct,
  storeName: string,
): ProductPageProduct {
  const imageUrls = Array.from(
    new Set(
      [
        ...(product.images ?? []),
        product.imageUrl,
      ].filter((value): value is string => Boolean(value?.trim())),
    ),
  );
  const image = imageUrls[0] ?? null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.priceMzn ?? 0),
    compare_at_price:
      product.compareAtPriceMzn == null
        ? null
        : Number(product.compareAtPriceMzn),
    stock: Number(product.stock ?? 0),
    description:
      product.description ?? null,
    category:
      product.category ?? "Produtos",
    storeName,
    image,
    images: imageUrls.map((imageUrl, position) => ({
      id: `product-image-${product.id}-${position}`,
      image_url: imageUrl,
      position,
    })),
    options: (product.options ?? []).map((option, position) => ({
      id: `product-option-${product.id}-${position}`,
      name: option.name,
      values: option.values,
      position,
    })),
  };
}

export default function NovaProductPage() {
  const [, setLocation] = useLocation();
  const search = useSearch();

  /*
   * ============================================================
   * ROTA CORRETA DA PÁGINA DO PRODUTO
   * ============================================================
   *
   * O ProductCard abre:
   *
   * /themes/nova/produto/:slug?storeSlug=...
   *
   * Portanto a página precisa ler o slug desta rota.
   */
  const [, routeParams] = useRoute(
    "/themes/nova/produto/:slug",
  );

  const productSlug =
    routeParams?.slug?.trim() ?? "";

  /*
   * ============================================================
   * CONTEXTO DA LOJA
   * ============================================================
   *
   * O storeSlug acompanha o produto através da URL.
   */
  const storeSlug = getStoreSlugFromSearch(search);

  /*
   * Sem storeSlug não devemos consultar uma loja vazia.
   */
  const storeQuery =
    trpc.stores.bySlug.useQuery(
      {
        slug: storeSlug,
      },
      {
        enabled:
          Boolean(storeSlug) &&
          Boolean(productSlug),
      },
    );

  const store =
    storeQuery.data?.store as
      | {
          id: string;
          name: string;
          slug: string;
          category?: string | null;
          currency?: string | null;
          status?: string | null;
        }
      | undefined;

  /*
   * Produtos pertencentes EXCLUSIVAMENTE
   * à loja encontrada pelo storeSlug.
   */
  const storeProducts =
    (storeQuery.data?.products ??
      []) as StoreProduct[];

  /*
   * Procuramos o produto pelo slug
   * dentro dos produtos da loja atual.
   */
  const rawProduct = useMemo(() => {
    if (!productSlug) {
      return undefined;
    }

    return storeProducts.find(
      (product) =>
        String(product.slug) ===
        String(productSlug),
    );
  }, [storeProducts, productSlug]);

  const product = rawProduct
    ? normalizeProduct(
        rawProduct,
        store?.name ?? "Loja",
      )
    : undefined;

  /*
   * Produtos relacionados permanecem
   * dentro da MESMA loja.
   */
  const relatedProducts: RelatedProduct[] =
    storeProducts
      .filter(
        (item) =>
          String(item.slug) !==
            String(productSlug) &&
          item.status !== "archived",
      )
      .slice(0, 6)
      .map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: Number(
          item.priceMzn ?? 0,
        ),
        compare_at_price:
          item.compareAtPriceMzn == null
            ? null
            : Number(
                item.compareAtPriceMzn,
              ),
        image:
          item.imageUrl?.trim() || null,
      }));

  const isLoading =
    Boolean(storeSlug) &&
    Boolean(productSlug) &&
    storeQuery.isLoading;

  const hasStoreSlug =
    Boolean(storeSlug);

  /*
   * ============================================================
   * CARREGAMENTO
   * ============================================================
   */
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

          <p className="text-sm text-gray-500">
            A carregar o produto...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * LOJA NÃO ENCONTRADA
   * ============================================================
   */
  if (
    !hasStoreSlug ||
    storeQuery.isError ||
    !store
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <Store className="h-7 w-7 text-emerald-600" />
          </div>

          <h1 className="text-xl font-semibold text-gray-950">
            Loja não encontrada
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Não foi possível encontrar a
            loja associada a este produto.
          </p>

          <Link
            href="/"
            className="
              mt-6
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-emerald-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-emerald-700
            "
          >
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * PRODUTO NÃO ENCONTRADO
   * ============================================================
   */
  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <Store className="h-7 w-7 text-emerald-600" />
          </div>

          <h1 className="text-xl font-semibold text-gray-950">
            Produto não encontrado
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Este produto não existe nesta
            loja ou já não está disponível.
          </p>

          <button
            type="button"
            onClick={() =>
              setLocation(
                `/store/${store.slug}`,
              )
            }
            className="
              mt-6
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-emerald-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-emerald-700
            "
          >
            Voltar à loja
          </button>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * PÁGINA DO PRODUTO
   * ============================================================
   */
  return (
    <main className="min-h-screen bg-[#f5f5f5] pb-24">
      <div
        className="
          mx-auto
          max-w-[1440px]
          px-3
          py-4
          md:px-4
          md:py-8
        "
      >
        {/* =====================================================
            VOLTAR À MESMA LOJA
            ===================================================== */}
        <div className="mb-4">
          <Link
            href={`/store/${store.slug}`}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-gray-500
              transition
              hover:text-emerald-600
            "
          >
            <ArrowLeft size={18} />
            Voltar à loja
          </Link>
        </div>

        {/* =====================================================
            PRODUTO
            ===================================================== */}
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-6
              p-4
              md:p-6
              xl:grid-cols-[620px_1fr]
              xl:gap-10
            "
          >
            {/* =================================================
                GALERIA
                ================================================= */}
            <div className="min-w-0">
              <ProductGallery
                image={product.image}
                name={product.name}
                images={product.images}
              />
            </div>

            {/* =================================================
                INFORMAÇÕES
                ================================================= */}
            <div className="min-w-0 space-y-5">
              <ProductTop
                product={product}
              />

              <ProductInfo
                product={product}
              />

              <PromotionBar
                product={product}
              />

              <ProductPurchaseSection
                product={product}
                options={product.options}
                variants={[]}
              />

              <ShippingCard />

              <GuaranteeCard />
            </div>
          </div>

          {/* ===================================================
              TABS
              =================================================== */}
          <div className="border-t border-gray-200">
            <ProductTabs
              product={product}
            />
          </div>
        </div>

        {/* =====================================================
            AVALIAÇÕES
            ===================================================== */}
        <div className="mt-8">
          <ReviewsSection />
        </div>

        {/* =====================================================
            PRODUTOS RELACIONADOS
            ===================================================== */}
        {relatedProducts.length > 0 && (
          <RelatedProducts
            products={relatedProducts}
            storeSlug={store.slug}
          />
        )}
      </div>
    </main>
  );
}
