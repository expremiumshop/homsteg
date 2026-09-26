import {
  calizaColors,
  calizaHeadingFont,
  calizaBodyFont,
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
        fontFamily: calizaBodyFont,
      }}
    >
      <h1
        className="min-w-0 max-w-full break-words text-3xl leading-tight [overflow-wrap:anywhere] sm:text-4xl"
        style={{
          fontFamily: calizaHeadingFont,
          fontWeight: 500,
          color: calizaColors.text,
        }}
      >
        {product.name}
      </h1>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span
          className="text-xl font-semibold"
          style={{
            color: calizaColors.primary,
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
                  calizaColors.textMuted,
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
          color: calizaColors.textMuted,
        }}
      >
        Impostos incluídos ·{" "}
        <span
          style={{
            color: inStock
              ? calizaColors.text
              : "#b91c1c",
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
