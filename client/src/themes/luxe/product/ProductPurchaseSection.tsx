import { useState } from "react";

import ProductVariants, {
  type LuxeProductOption,
} from "./ProductVariants";

import ProductActions from "./ProductActions";

type ProductPurchaseSectionProps = {
  product: any;
  options: LuxeProductOption[];
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
    <div className="space-y-6">
      {options.length > 0 && (
        <ProductVariants
          options={options}
          onChange={
            setSelectedVariants
          }
        />
      )}

      <ProductActions
        product={product}
        productOptions={options}
        selectedVariants={
          selectedVariants
        }
        storeSlug={storeSlug}
      />
    </div>
  );
}

export default ProductPurchaseSection;
