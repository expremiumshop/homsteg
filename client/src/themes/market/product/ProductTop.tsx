import { Star } from "lucide-react";

type ProductTopProps = {
  product: {
    category: string;
    rating: number;
    reviews: number;
    sold: number;
  };
};

export function ProductTop({
  product,
}: ProductTopProps) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-700">
          {product.category}
        </span>

        <span className="text-[11px] font-semibold text-slate-400">
          {product.sold} vendidos
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <=
                Math.round(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-200"
              }`}
            />
          ))}
        </div>

        <span className="text-sm font-bold text-slate-900">
          {product.rating.toFixed(1)}
        </span>

        <span className="text-xs text-slate-400">
          ({product.reviews}{" "}
          avaliações)
        </span>
      </div>
    </div>
  );
}

export default ProductTop;
