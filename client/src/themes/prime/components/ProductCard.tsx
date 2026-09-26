import { useState } from "react";

import {
  Heart,
  Percent,
  ShoppingCart,
} from "lucide-react";

import { Link } from "wouter";

import { useCart } from "@/contexts/CartContext";

import {
  formatPrice,
  getPrimeProductSlug,
  type PrimeProduct,
} from "../demoData";

import { Rating } from "./Rating";

type ProductCardProps = {
  product: PrimeProduct;
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
    getPrimeProductSlug(product);

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  const productHref = `/themes/prime/produto/${encodeURIComponent(productSlug)}${storeContext}`;

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
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
      <Link
        href={productHref}
        className="relative block aspect-[4/4.7] overflow-hidden bg-slate-100"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}

          {discount > 0 && (
            <span className="flex w-fit items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold text-white">
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
        className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition ${
          favorite
            ? "text-red-500"
            : "text-slate-500 hover:text-red-500"
        }`}
        aria-label="Favoritar"
      >
        <Heart
          className={`h-5 w-5 ${
            favorite
              ? "fill-current"
              : ""
          }`}
        />
      </button>

      <div className="absolute inset-x-3 bottom-[132px] hidden translate-y-16 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-orange-500"
        >
          <ShoppingCart className="h-4 w-4" />
          Adicionar ao carrinho
        </button>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-orange-500">
            {product.category}
          </span>

          {product.shipping && (
            <span className="text-[10px] font-medium text-emerald-600">
              {product.shipping}
            </span>
          )}
        </div>

        <Link
          href={productHref}
          className="block w-full text-left"
        >
          <h3 className="line-clamp-2 min-h-[42px] text-sm font-bold leading-5 text-slate-900 transition hover:text-orange-500">
            {product.name}
          </h3>
        </Link>

        <Rating
          value={product.rating}
          reviews={
            product.reviews
          }
        />

        <div className="flex items-end justify-between gap-2 pt-1">
          <div>
            {product.oldPrice && (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(
                  product.oldPrice,
                )}
              </p>
            )}

            <p className="text-xl font-black tracking-tight text-slate-950">
              {formatPrice(
                product.price,
              )}
            </p>
          </div>

          <span className="text-[10px] text-slate-400">
            {product.sold} vendidos
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-800 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white sm:hidden"
        >
          <ShoppingCart className="h-4 w-4" />
          Adicionar
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
