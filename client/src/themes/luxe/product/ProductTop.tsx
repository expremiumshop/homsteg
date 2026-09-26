import { Share2, Star } from "lucide-react";

type ProductTopProduct = {
  category: string;
  name: string;
  rating: string;
  sold: string;
};

type ProductTopProps = {
  product: ProductTopProduct;
};

export function ProductTop({
  product,
}: ProductTopProps) {
  return (
    <div className="w-full min-w-0 space-y-4">
      {/* CATEGORIA */}
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
        {product.category}
      </p>

      {/* NOME DO PRODUTO */}
      <h1
        title={product.name}
        className="block w-full min-w-0 max-w-full break-words text-3xl font-black leading-[1.05] tracking-tight text-slate-950 md:text-4xl"
      >
        {product.name}
      </h1>

      {/* AVALIAÇÃO */}
      {(product.rating ||
        product.sold) && (
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="h-4 w-4 fill-current text-amber-400" />

          <span className="font-bold text-slate-700">
            {product.rating || "4.8"}
          </span>

          {product.sold && (
            <>
              <span className="text-slate-400">
                ·
              </span>

              <span className="text-slate-400">
                {product.sold}
              </span>
            </>
          )}
        </div>
      )}

      {/* COMPARTILHAR */}
      <button
        type="button"
        className="flex shrink-0 items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-red-500 active:scale-95"
      >
        <Share2 className="h-4 w-4" />
        Compartilhar
      </button>
    </div>
  );
}

export default ProductTop;
