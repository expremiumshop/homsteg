import { useState } from "react";

import {
  Heart,
  Percent,
  ShoppingCart,
  Star,
} from "lucide-react";

import { Link } from "wouter";

import { useCart } from "@/contexts/CartContext";

import {
  formatPrice,
  getMarketProductSlug,
  type MarketProduct,
} from "../demoData";

type ProductCardProps = {
  product: MarketProduct;
  storeSlug?: string;
};

export function ProductCard({
  product,
  storeSlug,
}: ProductCardProps) {
  const [favorite, setFavorite] =
    useState(false);

  const { addToCart } = useCart();

  const discount = product.oldPrice
    ? Math.round(
        ((product.oldPrice -
          product.price) /
          product.oldPrice) *
          100,
      )
    : 0;

  const productSlug =
    getMarketProductSlug(product);

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  const productHref = `/themes/market/produto/${encodeURIComponent(productSlug)}${storeContext}`;

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
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_18px_45px_rgba(5,150,105,0.12)]">
      <Link
        href={productHref}
        className="relative block aspect-square overflow-hidden bg-slate-100"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <span className="w-fit rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}

          {discount > 0 && (
            <span className="flex w-fit items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black text-white">
              <Percent className="h-3 w-3" />
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() =>
          setFavorite(
            (current) => !current,
          )
        }
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition ${
          favorite
            ? "text-red-500"
            : "text-slate-500 hover:text-red-500"
        }`}
        aria-label="Favoritar"
      >
        <Heart
          className={`h-4.5 w-4.5 ${
            favorite
              ? "fill-current"
              : ""
          }`}
        />
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-bold uppercase tracking-wide text-emerald-600">
            {product.category}
          </span>

          <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-slate-400">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <Link
          href={productHref}
          className="block w-full text-left"
        >
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-slate-900 transition hover:text-emerald-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="min-w-0">
            {product.oldPrice && (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(
                  product.oldPrice,
                )}
              </p>
            )}

            <p className="text-lg font-black tracking-tight text-slate-900">
              {formatPrice(
                product.price,
              )}
            </p>
          </div>

          <span className="shrink-0 text-[10px] text-slate-400">
            {product.sold} vendidos
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white transition hover:bg-emerald-700"
        >
          <ShoppingCart className="h-4 w-4" />
          Adicionar
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
