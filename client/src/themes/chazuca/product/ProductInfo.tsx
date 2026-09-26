import {
  chazucaColors,
  chazucaHeadingFont,
  chazucaBodyFont,
} from "../theme";

import { formatPrice } from "../demoData";

type ProductInfoProps = {
  product: {
    name: string;
    price: number;
    oldPrice?: number | null;
    stock: number;
  };
};

export function ProductInfo({
  product,
}: ProductInfoProps) {
  const inStock = product.stock > 0;

  return (
    <div
      className="min-w-0"
      style={{
        fontFamily: chazucaBodyFont,
      }}
    >
      <h1
        className="min-w-0 max-w-full break-words text-3xl leading-tight [overflow-wrap:anywhere] sm:text-4xl"
        style={{
          fontFamily: chazucaHeadingFont,
          fontWeight: 700,
          color: chazucaColors.text,
        }}
      >
        {product.name}
      </h1>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span
          className="text-xl font-semibold"
          style={{
            color: chazucaColors.primary,
          }}
        >
          {formatPrice(product.price)}
        </span>

        {product.oldPrice != null &&
          product.oldPrice >
            product.price && (
            <span
              className="text-sm line-through"
              style={{
                color:
                  chazucaColors.textMuted,
              }}
            >
              {formatPrice(
                product.oldPrice,
              )}
            </span>
          )}
      </div>

      <p
        className="mt-2 text-[11px] uppercase tracking-[0.14em]"
        style={{
          color: chazucaColors.textMuted,
        }}
      >
        Impostos incluídos ·{" "}
        <span
          style={{
            color: inStock
              ? chazucaColors.text
              : "#be185d",
          }}
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
