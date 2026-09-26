import { formatPrice } from "../demoData";

type ProductInfoProps = {
  product: {
    name: string;
    price: number;
    oldPrice?: number;
    stock: number;
  };
};

export function ProductInfo({
  product,
}: ProductInfoProps) {
  const discount = product.oldPrice
    ? Math.round(
        ((product.oldPrice -
          product.price) /
          product.oldPrice) *
          100,
      )
    : 0;

  const inStock = product.stock > 0;

  return (
    <div className="min-w-0">
      <h1 className="min-w-0 max-w-full break-words text-2xl font-black leading-tight tracking-tight text-slate-900 [overflow-wrap:anywhere] md:text-3xl">
        {product.name}
      </h1>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <span className="text-3xl font-black tracking-tight text-emerald-600">
          {formatPrice(
            product.price,
          )}
        </span>

        {product.oldPrice && (
          <span className="pb-1 text-base text-slate-400 line-through">
            {formatPrice(
              product.oldPrice,
            )}
          </span>
        )}

        {discount > 0 && (
          <span className="mb-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-black text-white">
            -{discount}%
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Preço com impostos incluídos ·{" "}
        <span
          className={
            inStock
              ? "font-semibold text-emerald-600"
              : "font-semibold text-red-500"
          }
        >
          {inStock
            ? `${product.stock} em stock`
            : "Sem stock"}
        </span>
      </p>
    </div>
  );
}

export default ProductInfo;
