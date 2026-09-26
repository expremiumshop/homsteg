import { useMemo } from "react";
import { ArrowLeft, Store } from "lucide-react";
import { Link, useLocation, useRoute, useSearch } from "wouter";

import { trpc } from "@/lib/trpc";

import {
  KitGuaranteeCard,
  KitProductGallery,
  KitProductPurchaseSection,
  KitProductTabs,
  KitRelatedProducts,
  KitReviewsSection,
  KitShippingCard,
  type KitProductOption,
} from "../product/KitProductPageParts";
import { ThemeStyleScope } from "../ThemeStyleScope";
import type { ThemeConfig } from "../themeConfig";

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

type KitPageProduct = {
  id: number | string;
  slug: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  description: string | null;
  category: string;
  image: string | null;
  image_url?: string | null;
  images: KitGalleryImage[];
  options: KitProductOption[];
};

type KitGalleryImage = {
  id: string;
  image_url: string;
  position: number;
};

type RelatedProduct = {
  id: number | string;
  slug: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  image: string | null;
};

export interface KitProductPageProps {
  theme: ThemeConfig;
}

/**
 * ============================================================
 * PÁGINA DE PRODUTO DA _kit
 * ============================================================
 *
 * Espelho funcional da NovaProductPage: rota
 * /themes/<tema>/produto/:slug?storeSlug=..., contexto da loja
 * pela querystring, relacionados da mesma loja.
 */
export function KitProductPage({ theme }: KitProductPageProps) {
  const [, setLocation] = useLocation();
  const search = useSearch();

  const [, routeParams] = useRoute(
    `/themes/${theme.key}/produto/:slug`,
  );
  const productSlug = routeParams?.slug?.trim() ?? "";

  const storeSlug =
    new URLSearchParams(search).get("storeSlug")?.trim() ?? "";

  const storeQuery = trpc.stores.bySlug.useQuery(
    { slug: storeSlug },
    {
      enabled: Boolean(storeSlug) && Boolean(productSlug),
    },
  );

  const store = storeQuery.data?.store as
    | {
        id: string;
        name: string;
        slug: string;
        category?: string | null;
        currency?: string | null;
        status?: string | null;
      }
    | undefined;

  const storeProducts = (storeQuery.data?.products ?? []) as StoreProduct[];

  const rawProduct = useMemo(() => {
    if (!productSlug) return undefined;
    return storeProducts.find(
      (product) => String(product.slug) === String(productSlug),
    );
  }, [storeProducts, productSlug]);

  const imageUrls = rawProduct
    ? Array.from(
        new Set(
          [
            ...(rawProduct.images ?? []),
            rawProduct.imageUrl,
          ].filter((v): v is string => Boolean(v?.trim())),
        ),
      )
    : [];

  const product: KitPageProduct | undefined = rawProduct
    ? {
        id: rawProduct.id,
        slug: rawProduct.slug,
        name: rawProduct.name,
        price: Number(rawProduct.priceMzn ?? 0),
        compare_at_price:
          rawProduct.compareAtPriceMzn == null
            ? null
            : Number(rawProduct.compareAtPriceMzn),
        stock: Number(rawProduct.stock ?? 0),
        description: rawProduct.description ?? null,
        category: rawProduct.category ?? "Produtos",
        image: imageUrls[0] ?? null,
        image_url: imageUrls[0] ?? null,
        images: imageUrls.map((url, position) => ({
          id: `product-image-${rawProduct.id}-${position}`,
          image_url: url,
          position,
        })),
        options: (rawProduct.options ?? []).map((option, position) => ({
          id: `product-option-${rawProduct.id}-${position}`,
          name: option.name,
          values: option.values,
        })),
      }
    : undefined;

  const relatedProducts: RelatedProduct[] = storeProducts
    .filter(
      (item) =>
        String(item.slug) !== String(productSlug) &&
        item.status !== "archived",
    )
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: Number(item.priceMzn ?? 0),
      compare_at_price:
        item.compareAtPriceMzn == null
          ? null
          : Number(item.compareAtPriceMzn),
      image: item.imageUrl?.trim() || null,
    }));

  const isLoading =
    Boolean(storeSlug) && Boolean(productSlug) && storeQuery.isLoading;

  const basePath = `/themes/${theme.key}`;

  /* ---------- estados ---------- */

  if (isLoading) {
    return (
      <ThemeStyleScope theme={theme}>
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div
              className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4"
              style={{
                borderColor: "var(--tk-border)",
                borderTopColor: "var(--tk-primary)",
              }}
            />
            <p className="text-sm text-[var(--tk-muted)]">A carregar o produto...</p>
          </div>
        </main>
      </ThemeStyleScope>
    );
  }

  if (!storeSlug || storeQuery.isError || !store) {
    return (
      <ThemeStyleScope theme={theme}>
        <main className="flex min-h-screen items-center justify-center px-4">
          <div
            className="w-full max-w-md p-8 text-center shadow-sm"
            style={{
              background: "var(--tk-surface)",
              borderRadius: "var(--tk-card-radius)",
              border: "1px solid var(--tk-border)",
            }}
          >
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{
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
              Não foi possível encontrar a loja associada a este produto.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center px-5 py-3 text-sm font-semibold"
              style={{
                background: "var(--tk-primary)",
                color: "var(--tk-primary-contrast)",
                borderRadius: "var(--tk-radius)",
              }}
            >
              Voltar
            </Link>
          </div>
        </main>
      </ThemeStyleScope>
    );
  }

  if (!product) {
    return (
      <ThemeStyleScope theme={theme}>
        <main className="flex min-h-screen items-center justify-center px-4">
          <div
            className="w-full max-w-md p-8 text-center shadow-sm"
            style={{
              background: "var(--tk-surface)",
              borderRadius: "var(--tk-card-radius)",
              border: "1px solid var(--tk-border)",
            }}
          >
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                background:
                  "color-mix(in srgb, var(--tk-primary) 12%, transparent)",
                color: "var(--tk-primary)",
              }}
            >
              <Store className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-semibold text-[var(--tk-text)]">
              Produto não encontrado
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">
              Este produto não existe nesta loja ou já não está disponível.
            </p>
            <button
              type="button"
              onClick={() => setLocation(`/store/${store.slug}`)}
              className="mt-6 inline-flex items-center justify-center px-5 py-3 text-sm font-semibold"
              style={{
                background: "var(--tk-primary)",
                color: "var(--tk-primary-contrast)",
                borderRadius: "var(--tk-radius)",
              }}
            >
              Voltar à loja
            </button>
          </div>
        </main>
      </ThemeStyleScope>
    );
  }

  /* ---------- página ---------- */

  return (
    <ThemeStyleScope theme={theme}>
      <main className="min-h-screen pb-24">
        <div className="mx-auto max-w-[1280px] px-3 py-4 md:px-6 md:py-8">
          {/* voltar */}
          <div className="mb-4">
            <Link
              href={`/store/${store.slug}`}
              className="inline-flex items-center gap-2 text-sm text-[var(--tk-muted)] transition hover:text-[var(--tk-primary)]"
            >
              <ArrowLeft size={18} />
              Voltar à loja
            </Link>
          </div>

          {/* produto */}
          <div
            className="overflow-hidden border shadow-sm"
            style={{
              background: "var(--tk-surface)",
              borderColor: "var(--tk-border)",
              borderRadius: "var(--tk-card-radius)",
            }}
          >
            <div className="grid grid-cols-1 gap-6 p-4 md:p-6 xl:grid-cols-[520px_1fr] xl:gap-10">
              <div className="min-w-0">
                <KitProductGallery
                  image={product.image}
                  name={product.name}
                  images={product.images}
                />
              </div>

              <div className="min-w-0 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--tk-muted)]">
                    {product.category}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-[var(--tk-text)] md:text-3xl">
                    {product.name}
                  </h1>

                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-[var(--tk-primary)]">
                      {Number(product.price).toLocaleString("pt-MZ")} MZN
                    </span>
                    {product.compare_at_price != null &&
                      product.compare_at_price > product.price && (
                        <span className="text-sm text-[var(--tk-muted)] line-through">
                          {Number(product.compare_at_price).toLocaleString("pt-MZ")} MZN
                        </span>
                      )}
                  </div>

                  <p className="mt-1 text-xs text-[var(--tk-muted)]">
                    {product.stock > 0
                      ? `${product.stock} unidades em stock`
                      : "Sem stock"}
                  </p>
                </div>

                <KitProductPurchaseSection
                  product={product}
                  options={product.options}
                  storeSlug={store.slug}
                  checkoutPath={`${basePath}/checkout`}
                />

                <KitShippingCard />
                <KitGuaranteeCard />
              </div>
            </div>

            <div className="border-t" style={{ borderColor: "var(--tk-border)" }}>
              <KitProductTabs
                description={product.description}
                category={product.category}
                stock={product.stock}
              />
            </div>
          </div>

          {/* avaliações */}
          <div className="mt-8">
            <KitReviewsSection />
          </div>

          {/* relacionados */}
          {relatedProducts.length > 0 && (
            <div className="mt-8">
              <KitRelatedProducts
                products={relatedProducts}
                basePath={basePath}
                storeSlug={store.slug}
              />
            </div>
          )}
        </div>
      </main>
    </ThemeStyleScope>
  );
}

export default KitProductPage;
