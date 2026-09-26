import { useMemo } from "react";

import { ArrowLeft, Store } from "lucide-react";

import { Link, useLocation, useRoute, useSearch } from "wouter";

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
  formatPriceMzn,
  slugify,
  type UrbanProduct,
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

type UrbanPageProduct = UrbanProduct & {
  slug: string;
  description: string | null;
  stock: number;
  storeName: string;
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

export default function UrbanProductPage() {
  const [, setLocation] =
    useLocation();
  const search = useSearch();

  /*
   * Rota da página do produto:
   * /themes/urban/produto/:slug?storeSlug=...
   */
  const [, routeParams] = useRoute(
    "/themes/urban/produto/:slug",
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

  const product: UrbanPageProduct | undefined =
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

      const image = imageUrls[0] ?? null;

      return {
        id: String(rawProduct.id),
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
        image: image ?? "",
        rating: 4.8,
        description:
          rawProduct.description ?? null,
        stock: Number(
          rawProduct.stock ?? 0,
        ),
        storeName:
          store?.name ?? "Urban",
        images: imageUrls.map(
          (imageUrl, position) => ({
            id: `product-image-${rawProduct.id}-${position}`,
            image_url: imageUrl,
          }),
        ),
        options: (
          rawProduct.options ?? []
        ).map((option, position) => ({
          id: `product-option-${rawProduct.id}-${position}`,
          name: option.name,
          values: option.values,
        })),
      };
    }, [rawProduct, store?.name]);

  const relatedProducts = useMemo(
    () =>
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
          oldPrice:
            item.compareAtPriceMzn == null
              ? null
              : Number(
                  item.compareAtPriceMzn,
                ),
          image:
            item.imageUrl?.trim() ||
            null,
        })),
    [storeProducts, productSlug],
  );

  const isLoading =
    Boolean(storeSlug) &&
    Boolean(productSlug) &&
    storeQuery.isLoading;

  const hasStoreSlug =
    Boolean(storeSlug);

  /*
   * CARREGAMENTO
   */
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-950" />

          <p className="text-sm font-semibold text-neutral-500">
            A carregar o produto...
          </p>
        </div>
      </main>
    );
  }

  /*
   * LOJA NÃO ENCONTRADA
   */
  if (
    !hasStoreSlug ||
    storeQuery.isError ||
    !store
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-[28px] bg-neutral-100 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white">
            <Store className="h-7 w-7" />
          </div>

          <h1 className="text-xl font-black tracking-[-0.03em] text-neutral-950">
            Loja não encontrada
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Não foi possível encontrar a
            loja associada a este produto.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  /*
   * PRODUTO NÃO ENCONTRADO
   */
  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-[28px] bg-neutral-100 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white">
            <Store className="h-7 w-7" />
          </div>

          <h1 className="text-xl font-black tracking-[-0.03em] text-neutral-950">
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
            className="mt-6 inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            Voltar à loja
          </button>
        </div>
      </main>
    );
  }

  /*
   * PÁGINA DO PRODUTO
   */
  return (
    <main className="min-h-screen bg-white pb-24">
      <div className="mx-auto max-w-[1200px] px-5 py-6 md:px-8 md:py-10">
        {/* VOLTAR À LOJA */}
        <div className="mb-6">
          <Link
            href={`/store/${store.slug}`}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-neutral-400 transition hover:text-neutral-950"
          >
            <ArrowLeft className="h-4 w-4" />
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
          <div className="min-w-0 space-y-7">
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

            <ProductDetails />
          </div>
        </div>

        {/* TABS */}
        <div className="mt-14 border-t border-neutral-100 pt-10">
          <ProductTabs
            product={product}
          />
        </div>

        {/* AVALIAÇÕES */}
        <div className="mt-12">
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

        {/* FALLBACK DEMO */}
        {!storeSlug && (
          <div className="mt-12 rounded-[28px] bg-neutral-100 p-6 text-sm text-neutral-500">
            Produto de demonstração —{" "}
            {formatPriceMzn(
              product.price,
            )}{" "}
            · {slugify(product.name)}
          </div>
        )}
      </div>
    </main>
  );
}
