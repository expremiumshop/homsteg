import { Plus } from "lucide-react";

import { Link } from "wouter";

import { useCart } from "@/contexts/CartContext";

import {
  formatPrice,
  getEssenzaProductSlug,
  type EssenzaProduct,
} from "../demoData";

type ProductCardProps = {
  product: EssenzaProduct;
  storeSlug?: string;
};

export function ProductCard({
  product,
  storeSlug,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const productSlug =
    getEssenzaProductSlug(product);

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  const productHref = `/themes/essenza/produto/${encodeURIComponent(productSlug)}${storeContext}`;

  function handleAddToCart() {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: Number(product.price),
      image_url: product.image,
      storeSlug,
    });
  }

  return (
    <article className="group flex min-w-0 flex-col">
      {/* IMAGEM */}

      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <Link
          href={productHref}
          aria-label={product.name}
          className="absolute inset-0"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-950">
            {product.badge}
          </span>
        )}

        {/* AÇÃO DISCRETA */}

        <button
          type="button"
          onClick={handleAddToCart}
          aria-label="Adicionar ao carrinho"
          className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-1 items-center justify-center bg-white text-neutral-950 opacity-0 shadow-sm transition duration-300 hover:bg-neutral-950 hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* INFORMAÇÕES */}

      <div className="min-w-0 pt-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
          {product.category}
        </p>

        <Link href={productHref} className="mt-1.5 block">
          <h3
            className="mx-auto max-w-full break-words text-base leading-snug text-neutral-950 transition hover:opacity-60 [overflow-wrap:anywhere]"
            style={{
              fontFamily:
                "'Playfair Display', Georgia, serif",
              fontWeight: 500,
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-center gap-2.5">
          {product.oldPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}

          <span className="text-sm font-medium text-neutral-950">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
