import { Plus } from "lucide-react";

import { Link } from "wouter";

import { useCart } from "@/contexts/CartContext";

import {
  discountPercent,
  formatPrice,
  getChazucaProductSlug,
  type ChazucaProduct,
} from "../demoData";

import {
  chazucaColors,
  chazucaHeadingFont,
  chazucaBodyFont,
} from "../theme";

type ProductCardProps = {
  product: ChazucaProduct;
  storeSlug?: string;
};

export function ProductCard({
  product,
  storeSlug,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const productSlug =
    getChazucaProductSlug(product);

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  const productHref = `/themes/chazuca/produto/${encodeURIComponent(productSlug)}${storeContext}`;

  const discount = discountPercent(
    Number(product.price),
    product.oldPrice,
  );

  function handleAddToCart() {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: Number(product.price),
      image_url: product.image ?? undefined,
      storeSlug,
    });
  }

  return (
    <article
      className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border transition-shadow hover:shadow-lg hover:shadow-violet-100"
      style={{
        background: chazucaColors.surface,
        borderColor: chazucaColors.border,
        fontFamily: chazucaBodyFont,
      }}
    >
      {/* IMAGEM */}

      <div
        className="relative aspect-square overflow-hidden"
        style={{
          background: chazucaColors.bg,
        }}
      >
        <Link
          href={productHref}
          aria-label={product.name}
          className="absolute inset-0"
        >
          <img
            src={
              product.image?.trim() ||
              "/placeholder.svg"
            }
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
        </Link>

        {/* ETIQUETAS */}

        {discount !== null && (
          <span
            className="pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
            style={{
              background:
                chazucaColors.accent,
              color:
                chazucaColors.accentContrast,
            }}
          >
            -{discount}%
          </span>
        )}

        {product.featured && (
          <span
            className="pointer-events-none absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{
              background:
                chazucaColors.primary,
              color:
                chazucaColors.primaryContrast,
            }}
          >
            Hype
          </span>
        )}

        {/* AÇÃO DISCRETA */}

        <button
          type="button"
          onClick={handleAddToCart}
          aria-label="Adicionar ao carrinho"
          className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          style={{
            background: chazucaColors.surface,
            color: chazucaColors.text,
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* INFORMAÇÕES */}

      <div className="min-w-0 px-4 pb-4 pt-3.5">
        <p
          className="text-[10px] uppercase tracking-[0.18em]"
          style={{
            color: chazucaColors.textMuted,
          }}
        >
          {product.category}
        </p>

        <Link href={productHref} className="mt-1.5 block">
          <h3
            className="mx-auto max-w-full break-words text-base leading-snug transition hover:opacity-70 [overflow-wrap:anywhere]"
            style={{
              fontFamily:
                chazucaHeadingFont,
              fontWeight: 600,
              color: chazucaColors.text,
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span
            className="text-sm font-semibold"
            style={{
              color: chazucaColors.primary,
            }}
          >
            {formatPrice(product.price)}
          </span>

          {product.oldPrice != null &&
            product.oldPrice >
              Number(product.price) && (
              <span
                className="text-xs line-through"
                style={{
                  color:
                    chazucaColors.textMuted,
                }}
              >
                {formatPrice(
                  product.oldPrice,
                )}
              </span>
            )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
