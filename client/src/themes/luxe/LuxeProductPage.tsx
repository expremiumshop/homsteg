import { useMemo } from "react";

import {
  ArrowLeft,
  Crown,
} from "lucide-react";

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
  type LuxeProduct,
} from "./demoData";

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

type LuxePageProduct = Omit<
  LuxeProduct,
  "price" | "oldPrice" | "discount"
> & {
  slug: string;
  price: number;
  oldPrice?: number | null;
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
    params.get("storeSlug")?.trim() ??
    ""
  );
}

export default function LuxeProductPage() {
  const [, setLocation] =
    useLocation();

  const search = useSearch();

  const [, routeParams] = useRoute(
    "/themes/luxe/produto/:slug",
  );

  const productSlug =
    routeParams?.slug?.trim() ?? "";

  const storeSlug =
    getStoreSlugFromSearch(search);

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

  const product: LuxePageProduct | undefined =
    useMemo(() => {
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
          "Geral",
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
        rating: "4.8",
        sold: "",
        badge: "",
        image:
          imageUrls[0] ?? "",
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

  /* CARREGAMENTO */
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-500" />

          <p className="text-sm font-semibold text-slate-500">
            A carregar o produto...
          </p>
        </div>
      </main>
    );
  }

  /* LOJA NÃO ENCONTRADA */
  if (
    !hasStoreSlug ||
    storeQuery.isError ||
    !store
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <Crown className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="text-xl font-black tracking-tight text-slate-950">
            Loja não encontrada
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Não foi possível encontrar a
            loja associada a este produto.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white"
          >
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  /* PRODUTO NÃO ENCONTRADO */
  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <Crown className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="text-xl font-black tracking-tight text-slate-950">
            Produto não encontrado
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
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
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white"
          >
            Voltar à loja
          </button>
        </div>
      </main>
    );
  }

  /* PÁGINA DO PRODUTO */
  return (
    <main className="min-h-screen bg-[#f7f7f5] pb-24">
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-10">
        {/* VOLTAR À LOJA */}
        <div className="mb-6">
          <Link
            href={`/store/${store.slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-red-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à loja
          </Link>
        </div>

        {/* PRODUTO */}
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-4 md:p-8 lg:grid-cols-2 lg:gap-12">
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
          <div className="min-w-0 space-y-7">
            <ProductTop
              product={{
                category:
                  product.category,
                name: product.name,
                rating:
                  product.rating,
                sold: product.sold,
              }}
            />

            <ProductInfo
              product={{
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
                stock: product.stock,
                image: product.image,
              }}
              options={
                product.options
              }
              storeSlug={store.slug}
            />

            <ProductDetails />
          </div>
        </div>

        {/* TABS */}
        <div className="mt-10">
          <ProductTabs
            product={{
              description:
                product.description ??
                null,
              category:
                product.category,
              stock: product.stock,
            }}
          />
        </div>

        {/* AVALIAÇÕES */}
        <div className="mt-10">
          <ReviewsSection />
        </div>

        {/* PRODUTOS RELACIONADOS */}
        {relatedProducts.length >
          0 && (
          <RelatedProducts
            products={
              relatedProducts
            }
            storeSlug={store.slug}
          />
        )}

        {/* RESUMO DEMO */}
        {!storeSlug && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
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
