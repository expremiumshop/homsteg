import { calizaColors, calizaBodyFont } from "../theme";

type ProductTopProps = {
  product: {
    category: string;
    sold?: number;
  };
};

export function ProductTop({
  product,
}: ProductTopProps) {
  return (
    <div
      className="min-w-0"
      style={{
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span
          className="text-[11px] uppercase tracking-[0.18em]"
          style={{
            color:
              calizaColors.textMuted,
          }}
        >
          {product.category}
        </span>

        {(product.sold ?? 0) > 0 && (
          <span
            className="text-[11px]"
            style={{
              color:
                calizaColors.textMuted,
            }}
          >
            {product.sold} vendidos
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductTop;
