import { ArrowRight } from "lucide-react";

import {
  essenzaDemoCategories,
} from "../demoData";

type CategoryListProps = {
  category?: string;
  onCategory?: (category: string) => void;
  onScrollToProducts?: () => void;
};

export function CategoryList({
  category = "Todos",
  onCategory,
  onScrollToProducts,
}: CategoryListProps) {
  function handleSelect(name: string) {
    onCategory?.(name);

    onScrollToProducts?.();
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-14 sm:px-8">
      <div className="mb-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
          Departamentos
        </p>

        <h2
          className="mt-2 text-2xl text-neutral-950 sm:text-3xl"
          style={{
            fontFamily:
              "'Playfair Display', Georgia, serif",
            fontWeight: 500,
          }}
        >
          Navegue por categoria
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-px bg-neutral-200 sm:grid-cols-3 lg:grid-cols-6">
        <button
          type="button"
          onClick={() => handleSelect("Todos")}
          className={`group flex min-w-0 flex-col items-center gap-3 bg-white px-4 py-8 transition hover:bg-neutral-50 ${
            category === "Todos"
              ? "bg-neutral-50"
              : ""
          }`}
        >
          <span
            className={`text-[11px] uppercase tracking-[0.16em] transition ${
              category === "Todos"
                ? "text-neutral-950 underline underline-offset-4"
                : "text-neutral-500 group-hover:text-neutral-950"
            }`}
          >
            Todos
          </span>
        </button>

        {essenzaDemoCategories.map((item) => {
          const isActive = category === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => handleSelect(item.name)}
              className={`group flex min-w-0 flex-col items-center gap-3 bg-white px-4 py-8 transition hover:bg-neutral-50 ${
                isActive ? "bg-neutral-50" : ""
              }`}
            >
              <span
                className={`text-center text-[11px] uppercase tracking-[0.16em] transition ${
                  isActive
                    ? "text-neutral-950 underline underline-offset-4"
                    : "text-neutral-500 group-hover:text-neutral-950"
                }`}
              >
                {item.name}
              </span>

              <ArrowRight
                size={13}
                className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-950"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryList;
