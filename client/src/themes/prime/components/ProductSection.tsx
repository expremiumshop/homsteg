import { useMemo, useState } from "react";

import {
  ChevronDown,
  Flame,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  formatPrice,
  primeCategories,
  type PrimeProduct,
} from "../demoData";

import { ProductCard } from "./ProductCard";

type ProductSectionProps = {
  products: PrimeProduct[];
  category: string;
  onCategory: (category: string) => void;
  search: string;
  onSearch: (value: string) => void;
  storeSlug?: string;
};

export function ProductSection({
  products,
  category,
  onCategory,
  search,
  onSearch,
  storeSlug,
}: ProductSectionProps) {
  const [sort, setSort] =
    useState("featured");
  const [view, setView] = useState<
    "grid" | "list"
  >("grid");
  const [showFilters, setShowFilters] =
    useState(false);
  const [maxPrice, setMaxPrice] =
    useState(7000);

  const filteredProducts =
    useMemo(() => {
      let result = [...products];

      if (category !== "Todos") {
        result = result.filter(
          (product) =>
            product.category ===
            category,
        );
      }

      if (search.trim()) {
        const query =
          search.toLowerCase();

        result = result.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(query) ||
            product.category
              .toLowerCase()
              .includes(query) ||
            product.description
              .toLowerCase()
              .includes(query),
        );
      }

      result = result.filter(
        (product) =>
          product.price <= maxPrice,
      );

      if (sort === "price-low") {
        result.sort(
          (a, b) => a.price - b.price,
        );
      }

      if (sort === "price-high") {
        result.sort(
          (a, b) => b.price - a.price,
        );
      }

      if (sort === "rating") {
        result.sort(
          (a, b) => b.rating - a.rating,
        );
      }

      if (sort === "new") {
        result.sort(
          (a, b) => b.id - a.id,
        );
      }

      return result;
    }, [
      products,
      category,
      search,
      maxPrice,
      sort,
    ]);

  return (
    <section
      id="products"
      className="mx-auto max-w-7xl scroll-mt-32 px-4 pb-16"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />

              <span className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                Seleção Prime
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
              Produtos em destaque
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {
                filteredProducts.length
              }{" "}
              produtos encontrados
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (value) => !value,
                )
              }
              className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition ${
                showFilters
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value,
                  )
                }
                className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-9 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="featured">
                  Destaques
                </option>
                <option value="new">
                  Mais recentes
                </option>
                <option value="rating">
                  Melhor avaliados
                </option>
                <option value="price-low">
                  Menor preço
                </option>
                <option value="price-high">
                  Maior preço
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white sm:flex">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`flex h-10 w-10 items-center justify-center ${
                  view === "grid"
                    ? "bg-slate-950 text-white"
                    : "text-slate-400"
                }`}
              >
                <Grid2X2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setView("list")}
                className={`flex h-10 w-10 items-center justify-center ${
                  view === "list"
                    ? "bg-slate-950 text-white"
                    : "text-slate-400"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <p className="mb-3 text-xs font-black text-slate-900">
                  Categoria
                </p>

                <div className="flex flex-wrap gap-2">
                  {primeCategories.map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          onCategory(item)
                        }
                        className={`rounded-lg px-3 py-2 text-[11px] font-bold ${
                          category === item
                            ? "bg-orange-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <p className="text-xs font-black text-slate-900">
                    Preço máximo
                  </p>

                  <span className="text-xs font-bold text-orange-500">
                    {formatPrice(
                      maxPrice,
                    )}
                  </span>
                </div>

                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="mt-5 w-full accent-orange-500"
                />

                <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                  <span>500 MT</span>
                  <span>10.000 MT</span>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    onCategory("Todos");
                    setMaxPrice(7000);
                    onSearch("");
                    setSort("featured");
                  }}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-600"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white py-20 text-center">
            <Search className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 text-xl font-black">
              Nenhum produto encontrado
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Tente outra pesquisa ou remova
              alguns filtros.
            </p>

            <button
              type="button"
              onClick={() => {
                onSearch("");
                onCategory("Todos");
                setMaxPrice(7000);
              }}
              className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white"
            >
              Limpar pesquisa
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  storeSlug={storeSlug}
                />
              ),
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map(
              (product) => (
                <article
                  key={product.id}
                  className="flex flex-col gap-5 rounded-2xl bg-white p-4 shadow-sm sm:flex-row"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-48 w-full rounded-xl object-cover sm:h-40 sm:w-48"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                        {product.category}
                      </span>

                      <h3 className="mt-1 text-xl font-black">
                        {product.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                        {product.description}
                      </p>

                      <p className="mt-3 text-sm font-black text-slate-950">
                        {formatPrice(
                          product.price,
                        )}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onViewProduct(
                            product,
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 transition hover:border-slate-950"
                      >
                        Ver produto
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function onViewProduct(
  product: PrimeProduct,
) {
  window.location.href = `/themes/prime/produto/${encodeURIComponent(
    product.slug ||
      product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
  )}`;
}

export default ProductSection;
