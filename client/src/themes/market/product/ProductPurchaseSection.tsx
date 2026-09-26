import { useState } from "react";

import ProductVariants, {
  type ProductOption,
} from "./ProductVariants";

import ProductActions from "./ProductActions";

type ProductPurchaseSectionProps = {
  product: {
    id: number | string;
    name: string;
    price: number;
    image?: string | null;
    stock: number;
  };
  options: ProductOption[];
  storeSlug?: string;
};

export function ProductPurchaseSection({
  product,
  options,
  storeSlug,
}: ProductPurchaseSectionProps) {
  const [selectedVariants, setSelectedVariants] =
    useState<Record<string, string>>(
      {},
    );

  return (
    <div className="space-y-5">
      {options.length > 0 && (
        <ProductVariants
          options={options}
          onChange={setSelectedVariants}
        />
      )}

      <ProductActions
        product={product}
        productOptions={options}
        selectedVariants={selectedVariants}
        storeSlug={storeSlug}
      />
    </div>
  );
}

export default ProductPurchaseSection;
