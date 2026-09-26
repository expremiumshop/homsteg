import { Link } from "wouter";

import { discountPercent, formatMzn } from "../lib";
import { TkBadge } from "../ui";

export interface KitProduct {
  id: string | number;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  price: number | string;
  compare_at_price?: number | string | null;
  featured?: boolean;
  active?: boolean;
}

interface KitProductCardProps {
  product: KitProduct;
  storeName?: string;
  /** rota base da página de produto do tema, ex.: /themes/market */
  basePath: string;
  storeSlug?: string;
}

/**
 * Cartão de produto da _kit — mesmas informações da Nova
 * (imagem, oferta, destaque, nome, descrição, loja ✓, preço).
 */
export function KitProductCard({
  product,
  storeName = "LOJA",
  basePath,
  storeSlug,
}: KitProductCardProps) {
  const current = Number(product.price);
  const previous =
    product.compare_at_price == null
      ? null
      : Number(product.compare_at_price);
  const discount = discountPercent(current, previous);

  const ctx = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";
  const href = `${basePath}/produto/${encodeURIComponent(product.slug)}${ctx}`;

  return (
    <div
      className="group overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        background: "var(--tk-surface)",
        borderRadius: "var(--tk-card-radius)",
        border: "1px solid var(--tk-border)",
      }}
    >
      <Link href={href}>
        <div className="relative aspect-square overflow-hidden" style={{ background: "var(--tk-bg)" }}>
          <img
            src={product.image?.trim() || "/placeholder.svg"}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {discount !== null && (
            <div className="absolute left-1.5 top-1.5">
              <TkBadge tone="danger">-{discount}%</TkBadge>
            </div>
          )}
          {product.featured && (
            <div className="absolute right-1.5 top-1.5">
              <TkBadge tone="muted">Destaque</TkBadge>
            </div>
          )}
        </div>
      </Link>

      <div className="px-3 py-2.5">
        <Link href={href}>
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--tk-text)] sm:text-sm">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-0.5 truncate text-[11px] text-[var(--tk-muted)]">
            {product.description}
          </p>
        )}

        <div className="mt-1 flex items-center gap-1">
          <span className="text-[11px] font-medium text-[var(--tk-muted)]">
            {storeName}
          </span>
          <span
            title="Loja verificada"
            className="flex h-[13px] w-[13px] items-center justify-center rounded-full bg-blue-500 text-[8px] font-bold leading-none text-white"
          >
            ✓
          </span>
        </div>

        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-[var(--tk-text)] sm:text-base">
            {formatMzn(current)} MZN
          </span>
          {previous !== null && previous > current && (
            <span className="text-[10px] text-[var(--tk-muted)] line-through">
              {formatMzn(previous)} MZN
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Grelha de produtos — mesma disposição responsiva da Nova
 * (2 → 4 → 6 colunas), com container queries para previews.
 */
export function KitProductGrid({
  products,
  basePath,
  storeName,
  storeSlug,
  loading = false,
  error = null,
  title = "Produtos em destaque",
  subtitle = "Produtos selecionados especialmente para si",
}: {
  products?: KitProduct[];
  basePath: string;
  storeName?: string;
  storeSlug?: string;
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="@container w-full px-3 py-3 sm:px-4 md:py-4">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-[var(--tk-text)] md:text-2xl">
            {title}
          </h2>
          <p className="text-sm text-[var(--tk-muted)]">{subtitle}</p>
        </div>

        {loading && (
          <div
            className="p-10 text-center text-sm text-[var(--tk-muted)]"
            style={{
              background: "var(--tk-surface)",
              borderRadius: "var(--tk-card-radius)",
              border: "1px dashed var(--tk-border)",
            }}
          >
            Carregando produtos...
          </div>
        )}

        {!loading && error && (
          <div
            className="p-4 text-sm text-red-700"
            style={{
              background: "var(--tk-surface)",
              borderRadius: "var(--tk-card-radius)",
              border: "1px solid var(--tk-border)",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && products!.length === 0 && (
          <div
            className="p-10 text-center text-sm text-[var(--tk-muted)]"
            style={{
              background: "var(--tk-surface)",
              borderRadius: "var(--tk-card-radius)",
              border: "1px dashed var(--tk-border)",
            }}
          >
            Ainda não há produtos na loja.
            <br />
            Adicione produtos no painel de administração.
          </div>
        )}

        {!loading && !error && products!.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 @[720px]:grid-cols-4 @[720px]:gap-4 @[1024px]:grid-cols-6">
            {products!.map((product) => (
              <KitProductCard
                key={product.id}
                product={product}
                basePath={basePath}
                storeName={storeName}
                storeSlug={storeSlug}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
