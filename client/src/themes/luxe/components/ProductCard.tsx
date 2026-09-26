import {
  Heart,
  PackageCheck,
  ShoppingBag,
  Star,
} from "lucide-react";

import { Link } from "wouter";

import { useCart } from "@/contexts/CartContext";

import {
  getLuxeProductSlug,
  type LuxeProduct,
} from "../demoData";

type ProductCardProps = {
  product: LuxeProduct;
  storeSlug?: string;
};

export function ProductCard({
  product,
  storeSlug,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const productSlug =
    getLuxeProductSlug(product);

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  const productHref = `/themes/luxe/produto/${encodeURIComponent(productSlug)}${storeContext}`;

  function handleAddToCart() {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: Number(
        product.price.replace(
          /[^0-9,]/g,
          "",
        ).replace(",", "."),
      ),
      image_url: product.image || undefined,
      storeSlug,
    });
  }

  return (
    <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <Link
        href={productHref}
        className="relative block aspect-square overflow-hidden bg-slate-100"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <PackageCheck className="h-8 w-8" />
          </div>
        )}

        {product.badge && (
          <div className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
            {product.badge}
          </div>
        )}

        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur">
          <Heart className="h-4 w-4" />
        </div>

        {product.discount && (
          <div className="absolute bottom-3 left-3 rounded-md bg-slate-950/85 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
            {product.discount}
          </div>
        )}
      </Link>

      <div className="p-4">
        {(product.rating ||
          product.sold) && (
          <div className="mb-2 flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-current text-amber-400" />

            <span className="font-bold text-slate-700">
              {product.rating}
            </span>

            <span className="text-slate-400">
              ·
            </span>

            <span className="text-slate-400">
              {product.sold}
            </span>
          </div>
        )}

        <Link
          href={productHref}
          className="block"
        >
          <h3 className="min-h-[42px] text-sm font-semibold leading-5 text-slate-800">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-xl font-black tracking-tight text-red-600">
            {product.price}
          </span>

          {product.oldPrice && (
            <span className="pb-0.5 text-xs text-slate-400 line-through">
              {product.oldPrice}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Envio disponível
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Adicionar ao carrinho"
            className="transition hover:text-red-500"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
