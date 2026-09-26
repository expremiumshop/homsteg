import { useMemo } from "react";

import {
  essenzaDemoCategories,
  type EssenzaProduct,
} from "../demoData";

import { ProductCard } from "./ProductCard";

type ProductSectionProps = {
  products: EssenzaProduct[];
  category?: string;
  onCategory?: (category: string) => void;
  search?: string;
  onSearch?: (search: string) => void;
  storeSlug?: string;
};

export function ProductSection({
  products,
  category = "Todos",
  onCategory,
  search,
  onSearch,
  storeSlug,
}: ProductSectionProps) {
  const filteredProducts = useMemo(() => {
    const term = search?.trim().toLowerCase() ?? "";

    return products.filter((product) => {
      const matchesCategory =
        category === "Todos" ||
        product.category === category;

      const matchesSearch =
        !term ||
        product.name
          .toLowerCase()
          .includes(term) ||
        product.description
          .toLowerCase()
          .includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const filters = [
    "Todos",
    ...essenzaDemoCategories.map(
      (item) => item.name,
    ),
  ];

  return (
    <section
      id="products"
      className="mx-auto w-full max-w-[1440px] px-5 pt-16 sm:px-8"
    >
      <div className="mb-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
          Coleção
        </p>

        <h2
          className="mt-2 text-2xl text-neutral-950 sm:text-3xl"
          style={{
            fontFamily:
              "'Playfair Display', Georgia, serif",
            fontWeight: 500,
          }}
        >
          Produtos selecionados
        </h2>

        <p className="mt-2 text-sm text-neutral-400">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "peça"
            : "peças"}
        </p>

        {/* FILTROS — TEXTO SUBLINHADO */}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {filters.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onCategory?.(name)}
              className={`text-[11px] uppercase tracking-[0.16em] transition ${
                category === name
                  ? "text-neutral-950 underline underline-offset-[6px]"
                  : "text-neutral-400 hover:text-neutral-950"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="border border-neutral-200 py-20 text-center">
          <p
            className="text-xl text-neutral-950"
            style={{
              fontFamily:
                "'Playfair Display', Georgia, serif",
              fontWeight: 500,
            }}
          >
            Nada encontrado
          </p>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-400">
            Nenhuma peça corresponde à sua
            pesquisa neste momento.
          </p>

          <button
            type="button"
            onClick={() => {
              onCategory?.("Todos");
              onSearch?.("");
            }}
            className="mt-6 border border-neutral-950 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
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

export default ProductSection;
