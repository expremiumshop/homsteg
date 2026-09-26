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
  const inStock = product.stock > 0;

  return (
    <div className="min-w-0">
      <h1
        className="min-w-0 max-w-full break-words text-3xl leading-tight text-neutral-950 [overflow-wrap:anywhere] sm:text-4xl"
        style={{
          fontFamily:
            "'Playfair Display', Georgia, serif",
          fontWeight: 500,
        }}
      >
        {product.name}
      </h1>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span className="text-xl font-medium text-neutral-950">
          {formatPrice(product.price)}
        </span>

        {product.oldPrice && (
          <span className="text-sm text-neutral-400 line-through">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>

      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-neutral-400">
        Impostos incluídos ·{" "}
        <span
          className={
            inStock
              ? "text-neutral-950"
              : "text-red-600"
          }
        >
          {inStock
            ? `${product.stock} em stock`
            : "Esgotado"}
        </span>
      </p>
    </div>
  );
}

export default ProductInfo;
