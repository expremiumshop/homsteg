import { useState } from "react";

import ProductVariants, {
  ProductOption,
} from "./ProductVariants";

import ProductActions from "./ProductActions";

interface ProductVariant {
  id: string;
  product_id: string;
  options: Record<string, string> | null;
  name: string | null;
  sku: string | null;
  price: number | null;
  stock: number | null;
  active: boolean;
  position: number;
}

interface ProductPurchaseSectionProps {
  product: any;
  options: ProductOption[];
  variants: ProductVariant[];
}

export default function ProductPurchaseSection({
  product,
  options,
}: ProductPurchaseSectionProps) {
  const [selectedVariants, setSelectedVariants] =
    useState<Record<string, string>>({});

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
      />
    </div>
  );
}