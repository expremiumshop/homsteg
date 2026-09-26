import { useState } from "react";

import { Heart, ShoppingBag } from "lucide-react";

import { Link } from "wouter";

import { useCart } from "@/contexts/CartContext";

import {
  formatPrice,
  getUrbanProductSlug,
  type UrbanProduct,
} from "../demoData";

import { Rating } from "./Rating";

type ProductCardProps = {
  product: UrbanProduct;
  storeSlug?: string;
};

export function ProductCard({
  product,
  storeSlug,
}: ProductCardProps) {
  const [favorite, setFavorite] = useState(false);
  const { addToCart } = useCart();

  const productSlug =
    getUrbanProductSlug(product);

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-[28px] bg-neutral-100">
        <div className="aspect-[0.84] overflow-hidden">
          <Link href={`/themes/urban/produto/${encodeURIComponent(productSlug)}${storeContext}`}>
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </Link>
        </div>

        {product.badge && (
          <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-neutral-950 shadow-sm">
            {product.badge}
          </div>
        )}

        <button
          type="button"
          onClick={() => setFavorite((current) => !current)}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur"
          aria-label={
            favorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
        >
          <Heart
            className={`h-4 w-4 transition ${
              favorite
                ? "fill-current text-neutral-950"
                : "text-neutral-700"
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() =>
            addToCart({
              id: String(product.id),
              name: product.name,
              price: Number(product.price),
              image_url: product.image,
              storeSlug,
            })
          }
          className="absolute bottom-4 left-4 right-4 hidden h-12 items-center justify-center gap-2 rounded-full bg-neutral-950 text-sm font-bold text-white opacity-0 shadow-xl transition group-hover:flex group-hover:opacity-100"
        >
          Adicionar ao carrinho
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-neutral-400">
              {product.category}
            </p>

            <Link
              href={`/themes/urban/produto/${encodeURIComponent(productSlug)}${storeContext}`}
              className="mt-1.5 block"
            >
              <h3 className="text-sm font-bold leading-5 text-neutral-950 md:text-[15px]">
                {product.name}
              </h3>
            </Link>
          </div>

          <Rating value={product.rating} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-black text-neutral-950">
            {formatPrice(product.price)}
          </span>

          {product.oldPrice && (
            <span className="text-xs font-medium text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
