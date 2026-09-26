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
  type CalizaProduct,
} from "./demoData";

import { useThemeFonts } from "./useThemeFonts";

import {
  calizaColors,
  calizaBodyFont,
} from "./theme";

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

type CalizaPageProduct = Omit<
  CalizaProduct,
  "images"
> & {
  slug: string;
  stock: number;
  sold?: number;
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

export default function CalizaProductPage() {
  useThemeFonts();

  const [, setLocation] =
    useLocation();

  const search = useSearch();

  /*
   * Rota da página do produto:
   * /themes/caliza/produto/:slug?storeSlug=...
   */
  const [, routeParams] = useRoute(
    "/themes/caliza/produto/:slug",
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
    | CalizaPageProduct
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
      id: rawProduct.id,
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
          ? null
          : Number(
              rawProduct.compareAtPriceMzn,
            ),
      image:
        imageUrls[0] ?? null,
      description:
        rawProduct.description ??
        "Peça disponível nesta loja Caliza.",
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
      <main
        className="flex min-h-screen items-center justify-center px-5"
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
      <main
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
            loja associada a este produto.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center justify-center rounded-full px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90"
            style={{
              background:
                calizaColors.primary,
              color:
                calizaColors.primaryContrast,
            }}
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
      <main
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
            Produto não encontrado
          </h1>

          <p
            className="mt-2 text-sm leading-6"
            style={{
              color:
                calizaColors.textMuted,
            }}
          >
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
            className="mt-7 inline-flex items-center justify-center rounded-full px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90"
            style={{
              background:
                calizaColors.primary,
              color:
                calizaColors.primaryContrast,
            }}
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
    <main
      className="min-h-screen pb-24"
      style={{
        background: calizaColors.bg,
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-12">
        {/* VOLTAR À LOJA */}

        <div className="mb-8">
          <Link
            href={`/store/${store.slug}`}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] transition hover:opacity-60"
            style={{
              color:
                calizaColors.textMuted,
            }}
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
              product={{
                category:
                  product.category,
                sold: product.sold,
              }}
            />

            <ProductInfo
              product={{
                name: product.name,
                price: product.price,
                oldPrice:
                  product.oldPrice,
                stock: product.stock,
              }}
            />

            <ProductPurchaseSection
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
              }}
              options={
                product.options
              }
              storeSlug={store.slug}
            />

            <ProductDetails
              product={{
                description:
                  product.description,
              }}
            />
          </div>
        </div>

        {/* TABS */}

        <div className="mt-16">
          <ProductTabs
            product={{
              description:
                product.description,
              category:
                product.category,
              stock: product.stock,
            }}
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
          <div
            className="mt-14 rounded-2xl border p-6 text-sm"
            style={{
              borderColor:
                calizaColors.border,
              color:
                calizaColors.textMuted,
            }}
          >
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
