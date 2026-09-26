import { useMemo } from "react";

import {
  type CalizaProduct,
} from "../demoData";

import { ProductCard } from "./ProductCard";

import {
  calizaColors,
  calizaHeadingFont,
  calizaBodyFont,
} from "../theme";

type ProductSectionProps = {
  products: CalizaProduct[];
  categories: string[];
  category?: string;
  onCategory?: (category: string) => void;
  search?: string;
  onSearch?: (search: string) => void;
  storeSlug?: string;
  loading?: boolean;
  error?: string | null;
};

export function ProductSection({
  products,
  categories,
  category = "Todos",
  onCategory,
  search,
  onSearch,
  storeSlug,
  loading = false,
  error = null,
}: ProductSectionProps) {
  const filteredProducts = useMemo(() => {
    const term =
      search?.trim().toLowerCase() ?? "";

    return products.filter((product) => {
      const matchesCategory =
        category === "Todos" ||
        product.category === category;

      const matchesSearch =
        !term ||
        product.name
          .toLowerCase()
          .includes(term) ||
        (product.description ?? "")
          .toLowerCase()
          .includes(term);

      return (
        matchesCategory && matchesSearch
      );
    });
  }, [products, category, search]);

  return (
    <section
      id="products"
      className="mx-auto w-full max-w-[1440px] px-5 pt-12 sm:px-8"
      style={{
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="mb-8 text-center">
        <p
          className="text-[11px] uppercase tracking-[0.28em]"
          style={{
            color: calizaColors.textMuted,
          }}
        >
          Coleção
        </p>

        <h2
          className="mt-2 text-2xl sm:text-3xl"
          style={{
            fontFamily: calizaHeadingFont,
            fontWeight: 500,
            color: calizaColors.text,
          }}
        >
          Peças selecionadas
        </h2>

        <p
          className="mt-2 text-sm"
          style={{
            color: calizaColors.textMuted,
          }}
        >
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "peça"
            : "peças"}
        </p>
      </div>

      {/* FILTROS */}

      <div className="mb-8 flex flex-wrap items-center justify-center gap-2.5">
        {categories.map((name) => {
          const isActive = category === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => onCategory?.(name)}
              className="rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition"
              style={{
                background: isActive
                  ? calizaColors.primary
                  : calizaColors.surface,
                color: isActive
                  ? calizaColors.primaryContrast
                  : calizaColors.text,
                borderColor: isActive
                  ? calizaColors.primary
                  : calizaColors.border,
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* CONTEÚDO */}

      {loading ? (
        <div
          className="rounded-xl border border-dashed py-16 text-center text-sm"
          style={{
            borderColor:
              calizaColors.border,
            color: calizaColors.textMuted,
          }}
        >
          A carregar peças...
        </div>
      ) : error ? (
        <div
          className="rounded-xl border py-8 text-center text-sm"
          style={{
            borderColor:
              calizaColors.border,
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          className="rounded-xl border py-16 text-center"
          style={{
            borderColor:
              calizaColors.border,
          }}
        >
          <p
            className="text-xl"
            style={{
              fontFamily:
                calizaHeadingFont,
              fontWeight: 500,
              color: calizaColors.text,
            }}
          >
            Nada encontrado
          </p>

          <p
            className="mx-auto mt-2 max-w-sm text-sm leading-6"
            style={{
              color:
                calizaColors.textMuted,
            }}
          >
            Nenhuma peça corresponde à sua
            pesquisa neste momento.
          </p>

          <button
            type="button"
            onClick={() => {
              onCategory?.("Todos");
              onSearch?.("");
            }}
            className="mt-6 rounded-full border px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition"
            style={{
              borderColor:
                calizaColors.primary,
              color: calizaColors.primary,
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={String(product.id)}
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
