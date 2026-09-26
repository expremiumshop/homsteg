import { useMemo } from "react";

import { ArrowLeft, Store } from "lucide-react";

import {
  Link,
  useLocation,
  useRoute,
  useSearch,
} from "wouter";

import { trpc } from "@/lib/trpc";

import { ProductGallery } from "./product/ProductGallery";
import { ProductTop } from "./product/ProductTop";
import { ProductInfo } from "./product/ProductInfo";
import { ProductPurchaseSection } from "./product/ProductPurchaseSection";
import { ProductDetails } from "./product/ProductDetails";
import { ProductTabs } from "./product/ProductTabs";
import { ReviewsSection } from "./product/ReviewsSection";
import { RelatedProducts } from "./product/RelatedProducts";

import {
  formatPrice,
  type EssenzaProduct,
} from "./demoData";

import { useThemeFonts } from "./useThemeFonts";

type StoreProduct = {
  id: number | string;
  slug: string;
  name: string;
  description?: string | null;
  priceMzn: number;
  compareAtPriceMzn?: number | null;
  stock: number;
  category?: string | null;
  status?:
    | "draft"
    | "active"
    | "archived"
    | string;
  imageUrl?: string | null;
  images?: string[];
  options?: {
    name: string;
    values: string[];
  }[];
};

type EssenzaPageProduct = Omit<
  EssenzaProduct,
  "images"
> & {
  slug: string;
  stock: number;
  images: {
    id: string;
    image_url: string;
  }[];
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
};

function getStoreSlugFromSearch(
  search: string,
): string {
  const params =
    new URLSearchParams(search);

  return (
    params.get("storeSlug")?.trim() ?? ""
  );
}

export default function EssenzaProductPage() {
  useThemeFonts();

  const [, setLocation] =
    useLocation();

  const search = useSearch();

  /*
   * Rota da página do produto:
   * /themes/essenza/produto/:slug?storeSlug=...
   */
  const [, routeParams] = useRoute(
    "/themes/essenza/produto/:slug",
  );

  const productSlug =
    routeParams?.slug?.trim() ?? "";

  const storeSlug =
    getStoreSlugFromSearch(search);

  const storeQuery =
    trpc.stores.bySlug.useQuery(
      { slug: storeSlug },
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
        }
      | undefined;

  const storeProducts =
    (storeQuery.data?.products ??
      []) as StoreProduct[];

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

  const product:
    | EssenzaPageProduct
    | undefined = useMemo(() => {
    if (!rawProduct) {
      return undefined;
    }

    const imageUrls = Array.from(
      new Set(
        [
          ...(rawProduct.images ?? []),
          rawProduct.imageUrl,
        ].filter(
          (value): value is string =>
            Boolean(value?.trim()),
        ),
      ),
    );

    return {
      id: Number(rawProduct.id),
      slug: rawProduct.slug,
      name: rawProduct.name,
      category:
        rawProduct.category ??
        "Produtos",
      price: Number(
        rawProduct.priceMzn ?? 0,
      ),
      oldPrice:
        rawProduct.compareAtPriceMzn ==
        null
          ? undefined
          : Number(
              rawProduct.compareAtPriceMzn,
            ),
      rating: 4.9,
      reviews: 0,
      sold: 0,
      image:
        imageUrls[0] ??
        "/placeholder.svg",
      description:
        rawProduct.description ??
        "Peça disponível nesta loja Essenza.",
      stock: Number(
        rawProduct.stock ?? 0,
      ),
      images: imageUrls.map(
        (
          imageUrl,
          position,
        ) => ({
          id: `product-image-${rawProduct.id}-${position}`,
          image_url: imageUrl,
        }),
      ),
      options: (
        rawProduct.options ?? []
      ).map(
        (
          option,
          position,
        ) => ({
          id: `product-option-${rawProduct.id}-${position}`,
          name: option.name,
          values: option.values,
        }),
      ),
    };
  }, [rawProduct]);

  const relatedProducts =
    useMemo(
      () =>
        storeProducts
          .filter(
            (item) =>
              String(item.slug) !==
                String(
                  productSlug,
                ) &&
              item.status !==
                "archived",
          )
          .slice(0, 6)
          .map((item) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            price: Number(
              item.priceMzn ?? 0,
            ),
            oldPrice:
              item.compareAtPriceMzn ==
              null
                ? null
                : Number(
                    item.compareAtPriceMzn,
                  ),
            image:
              item.imageUrl?.trim() ||
              null,
          })),
      [
        storeProducts,
        productSlug,
      ],
    );

  const isLoading =
    Boolean(storeSlug) &&
    Boolean(productSlug) &&
    storeQuery.isLoading;

  const hasStoreSlug =
    Boolean(storeSlug);

  /* ============================================================
     CARREGAMENTO
     ============================================================ */

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-5">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border border-neutral-200 border-t-neutral-950" />

          <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">
            A carregar
          </p>
        </div>
      </main>
    );
  }

  /* ============================================================
     LOJA NÃO ENCONTRADA
     ============================================================ */

  if (
    !hasStoreSlug ||
    storeQuery.isError ||
    !store
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-5">
        <div className="w-full max-w-md border border-neutral-200 bg-white p-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-neutral-200">
            <Store
              size={26}
              strokeWidth={1.5}
              className="text-neutral-950"
            />
          </div>

          <h1
            className="text-2xl text-neutral-950"
            style={{
              fontFamily:
                "'Playfair Display', Georgia, serif",
              fontWeight: 500,
            }}
          >
            Loja não encontrada
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Não foi possível encontrar a
            loja associada a este produto.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center justify-center border border-neutral-950 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
          >
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  /* ============================================================
     PRODUTO NÃO ENCONTRADO
     ============================================================ */

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-5">
        <div className="w-full max-w-md border border-neutral-200 bg-white p-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-neutral-200">
            <Store
              size={26}
              strokeWidth={1.5}
              className="text-neutral-950"
            />
          </div>

          <h1
            className="text-2xl text-neutral-950"
            style={{
              fontFamily:
                "'Playfair Display', Georgia, serif",
              fontWeight: 500,
            }}
          >
            Produto não encontrado
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
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
            className="mt-7 inline-flex items-center justify-center border border-neutral-950 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
          >
            Voltar à loja
          </button>
        </div>
      </main>
    );
  }

  /* ============================================================
     PÁGINA DO PRODUTO
     ============================================================ */

  return (
    <main className="min-h-screen bg-white pb-24">
      <div
        className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-12"
        style={{
          fontFamily:
            "'Inter', system-ui, sans-serif",
        }}
      >
        {/* VOLTAR À LOJA */}

        <div className="mb-8">
          <Link
            href={`/store/${store.slug}`}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-neutral-400 transition hover:text-neutral-950"
          >
            <ArrowLeft size={14} />
            Voltar à loja
          </Link>
        </div>

        {/* PRODUTO */}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* GALERIA */}

          <div className="min-w-0">
            <ProductGallery
              image={product.image}
              name={product.name}
              images={
                product.images
              }
            />
          </div>

          {/* INFORMAÇÕES */}

          <div className="min-w-0 space-y-8">
            <ProductTop
              product={product}
            />

            <ProductInfo
              product={product}
            />

            <ProductPurchaseSection
              product={product}
              options={
                product.options
              }
              storeSlug={store.slug}
            />

            <ProductDetails
              product={product}
            />
          </div>
        </div>

        {/* TABS */}

        <div className="mt-16">
          <ProductTabs
            product={product}
          />
        </div>

        {/* AVALIAÇÕES */}

        <div className="mt-14">
          <ReviewsSection />
        </div>

        {/* PRODUTOS RELACIONADOS */}

        {relatedProducts.length >
          0 && (
          <div className="mt-14">
            <RelatedProducts
              products={
                relatedProducts
              }
              storeSlug={store.slug}
            />
          </div>
        )}

        {/* RESUMO DEMO (sem loja real) */}

        {!storeSlug && (
          <div className="mt-14 border border-neutral-200 p-6 text-sm text-neutral-500">
            Produto de demonstração —{" "}
            {formatPrice(
              product.price,
            )}
          </div>
        )}
      </div>
    </main>
  );
}
