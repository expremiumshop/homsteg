import {
  formatPrice,
} from "../demoData";

type ProductInfoProduct = {
  price: number;
  oldPrice?: number | null;
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
          <span className="text-3xl font-black tracking-tight text-red-600">
            {formatPrice(
              product.price,
            )}
          </span>

          {product.oldPrice && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(
                product.oldPrice,
              )}
            </span>
          )}

          {discount > 0 && (
            <span className="rounded-md bg-slate-950/85 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
              -{discount}%
            </span>
          )}
        </div>

        <p className="mt-2 text-sm font-medium text-red-500">
          Oferta especial por tempo
          limitado
        </p>
      </div>

      {/* ESTOQUE */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            stock > 0
              ? "bg-red-500"
              : "bg-slate-300"
          }`}
        />

        {stock > 0
          ? `Restam ${stock} unidades disponíveis`
          : "Produto sem stock"}
      </div>

      {/* CUPOM */}
      <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 p-4">
        <div>
          <p className="text-sm font-black text-red-600">
            Cupom Luxe
          </p>

          <p className="text-xs text-slate-500">
            Economize nesta compra
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg bg-red-500 px-3.5 py-1.5 text-xs font-black text-white"
        >
          Obter
        </button>
      </div>
    </div>
  );
}

export default ProductInfo;
