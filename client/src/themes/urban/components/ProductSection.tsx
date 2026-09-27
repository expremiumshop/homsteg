import { useMemo, useState } from "react";

import { PackageSearch } from "lucide-react";

import {
  urbanProductFilters,
  type UrbanProduct,
} from "../demoData";

import { ProductCard } from "./ProductCard";
import { SectionHeading } from "./SectionHeading";

type ProductSectionProps = {
  products: UrbanProduct[];
  storeSlug?: string;
  /*
   * Em loja real, um array vazio significa
   * "loja sem produtos" → estado vazio dedicado.
   * Em preview/demo o tema mantém os seus produtos.
   */
  showEmptyState?: boolean;
};

export function ProductSection({
  products,
  storeSlug,
  showEmptyState = false,
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

      {showEmptyState &&
      visibleProducts.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-[28px] border border-dashed border-neutral-200 bg-white py-20 text-center">
          <PackageSearch className="mb-4 h-10 w-10 text-neutral-300" />

          <h3 className="text-lg font-black text-neutral-950">
            Ainda não há produtos
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
            Esta loja ainda não adicionou
            produtos. Volte em breve para ver
            as novidades.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeSlug={storeSlug}
            />
          ))}
        </div>
      )}
    </section>
  );
}
