import {
  BadgeCheck,
  Share2,
} from "lucide-react";

import type {
  PrimeProduct,
} from "../demoData";

import { Rating } from "../components/Rating";

type ProductTopProduct = Pick<
  PrimeProduct,
  | "category"
  | "name"
  | "rating"
  | "reviews"
>;

type ProductTopProps = {
  product: ProductTopProduct;
};

export function ProductTop({
  product,
}: ProductTopProps) {
  return (
    <div className="w-full min-w-0 space-y-4">
      {/* CATEGORIA */}
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
        {product.category}
      </span>

      {/* NOME DO PRODUTO */}
      <h1
        title={product.name}
        className="block w-full min-w-0 max-w-full break-words text-3xl font-black leading-[1.05] tracking-tight text-slate-950 md:text-4xl"
      >
        {product.name}
      </h1>

      {/* AVALIAÇÃO */}
      <Rating
        value={product.rating}
        reviews={product.reviews}
      />

      {/* STATUS + COMPARTILHAR */}
      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 max-w-full items-center gap-2.5 rounded-xl bg-emerald-50 px-4 py-2.5">
          <BadgeCheck className="h-4.5 w-4.5 shrink-0 text-emerald-500" />

          <p className="min-w-0 max-w-full break-words text-xs font-bold text-emerald-600">
            Produto verificado
          </p>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-orange-500 active:scale-95"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </button>
      </div>
    </div>
  );
}

export default ProductTop;
