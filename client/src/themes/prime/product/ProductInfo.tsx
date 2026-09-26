import {
  formatPrice,
  type PrimeProduct,
} from "../demoData";

type ProductInfoProduct = Pick<
  PrimeProduct,
  | "price"
  | "oldPrice"
> & {
  stock?: number | null;
};

type ProductInfoProps = {
  product: ProductInfoProduct;
};

export function ProductInfo({
  product,
}: ProductInfoProps) {
  const discount =
    product.oldPrice
      ? Math.round(
          ((product.oldPrice -
            product.price) /
            product.oldPrice) *
            100,
        )
      : 0;

  const stock =
    product.stock ?? 12;

  return (
    <div className="space-y-4">
      {/* PREÇO */}
      <div className="rounded-2xl bg-slate-50 p-5">
        <div className="flex flex-wrap items-center gap-3">
          {product.oldPrice && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(
                product.oldPrice,
              )}
            </span>
          )}

          <span className="text-3xl font-black tracking-tight text-slate-950">
            {formatPrice(
              product.price,
            )}
          </span>

          {discount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>

        <p className="mt-2 text-sm font-medium text-orange-500">
          Oferta especial por tempo
          limitado
        </p>
      </div>

      {/* ESTOQUE */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            stock > 0
              ? "bg-emerald-500"
              : "bg-slate-300"
          }`}
        />

        {stock > 0
          ? `Restam ${stock} unidades disponíveis`
          : "Produto sem stock"}
      </div>

      {/* CUPOM */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4 text-white">
        <div>
          <p className="text-sm font-black">
            Cupom Prime
          </p>

          <p className="text-xs text-slate-400">
            Economize nesta compra
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-orange-500 px-3.5 py-1.5 text-xs font-black text-white"
        >
          Obter
        </button>
      </div>
    </div>
  );
}

export default ProductInfo;
