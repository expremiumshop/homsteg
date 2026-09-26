import {
  formatPriceMzn,
  type UrbanProduct,
} from "../demoData";

type ProductInfoProps = {
  product: UrbanProduct;
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
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-3xl font-black tracking-tight text-neutral-950">
          {formatPriceMzn(
            product.price,
          )}
        </span>

        {product.oldPrice && (
          <span className="text-sm font-medium text-neutral-400 line-through">
            {formatPriceMzn(
              product.oldPrice,
            )}
          </span>
        )}

        {discount > 0 && (
          <span className="rounded-full bg-neutral-950 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">
            -{discount}%
          </span>
        )}
      </div>

      {/* PARCELAS / OFERTA */}
      <p className="text-sm text-neutral-500">
        Oferta especial por tempo
        limitado.
      </p>

      {/* ESTOQUE */}
      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            stock > 0
              ? "bg-neutral-950"
              : "bg-neutral-300"
          }`}
        />
        {stock > 0
          ? `Restam ${stock} unidades disponíveis`
          : "Produto sem stock"}
      </div>
    </div>
  );
}

export default ProductInfo;
