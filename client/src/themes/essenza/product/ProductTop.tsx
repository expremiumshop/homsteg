type ProductTopProps = {
  product: {
    category: string;
    sold: number;
  };
};

export function ProductTop({
  product,
}: ProductTopProps) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">
          {product.category}
        </span>

        {product.sold > 0 && (
          <span className="text-[11px] text-neutral-400">
            {product.sold} vendidos
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductTop;
