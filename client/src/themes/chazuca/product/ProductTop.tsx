import { chazucaColors, chazucaBodyFont } from "../theme";

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
        fontFamily: chazucaBodyFont,
      }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span
          className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{
            background:
              "color-mix(in srgb, #7c3aed 10%, transparent)",
            color: "#7c3aed",
          }}
        >
          {product.category}
        </span>

        {(product.sold ?? 0) > 0 && (
          <span
            className="text-[11px]"
            style={{
              color:
                chazucaColors.textMuted,
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
