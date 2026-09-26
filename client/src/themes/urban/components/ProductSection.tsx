import { useMemo, useState } from "react";

import {
  urbanDemoProducts,
  urbanProductFilters,
  type UrbanProduct,
} from "../demoData";

import { ProductCard } from "./ProductCard";
import { SectionHeading } from "./SectionHeading";

type ProductSectionProps = {
  products?: UrbanProduct[];
  storeSlug?: string;
};

export function ProductSection({
  products = urbanDemoProducts,
  storeSlug,
}: ProductSectionProps) {
  const [filter, setFilter] = useState("Todos");

  const visibleProducts = useMemo(() => {
    if (filter === "Todos") {
      return products;
    }

    return products.filter(
      (product) => product.category === filter,
    );
  }, [filter, products]);

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-8">
      <SectionHeading
        eyebrow="Seleção"
        title="Mais desejados"
        action="Ver coleção"
      />

      <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
        {urbanProductFilters.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setFilter(item)}
            className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${
              filter === item
                ? "bg-neutral-950 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            storeSlug={storeSlug}
          />
        ))}
      </div>
    </section>
  );
}
