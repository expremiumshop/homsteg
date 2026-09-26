import { useMemo } from "react";

import { SearchX } from "lucide-react";

import {
  marketDemoCategories,
  type MarketProduct,
} from "../demoData";

import { ProductCard } from "./ProductCard";

type ProductSectionProps = {
  products: MarketProduct[];
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
    ...marketDemoCategories.map(
      (item) => item.name,
    ),
  ];

  return (
    <section
      id="products"
      className="mx-auto w-full max-w-[1400px] px-4 pt-10 sm:px-6"
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Ofertas da semana
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "produto encontrado"
              : "produtos encontrados"}
          </p>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {filters.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onCategory?.(name)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                category === name
                  ? "bg-emerald-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <SearchX className="mb-3 h-9 w-9 text-slate-300" />

          <p className="text-sm font-bold text-slate-700">
            Nenhum produto encontrado
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Tente outra pesquisa ou outra
            categoria.
          </p>

          <button
            type="button"
            onClick={() => {
              onCategory?.("Todos");
              onSearch?.("");
            }}
            className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
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
