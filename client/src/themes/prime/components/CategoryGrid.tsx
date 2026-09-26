import { ArrowRight } from "lucide-react";

import { CategoryIcon } from "./CategoryIcon";

import { primeCategories } from "../demoData";

type CategoryGridProps = {
  category: string;
  onCategory: (category: string) => void;
  onScrollToProducts: () => void;
};

export function CategoryGrid({
  category,
  onCategory,
  onScrollToProducts,
}: CategoryGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
            Explore
          </span>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
            Compre por categoria
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            onCategory("Todos");
            onScrollToProducts();
          }}
          className="hidden items-center gap-1 text-xs font-bold text-slate-500 hover:text-orange-500 sm:flex"
        >
          Ver tudo
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
        {primeCategories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              onCategory(item);
              onScrollToProducts();
            }}
            className={`flex min-w-[120px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl px-4 py-5 transition ${
              category === item
                ? "bg-slate-950 text-white shadow-xl"
                : "bg-white text-slate-600 shadow-sm hover:-translate-y-1 hover:shadow-lg"
            }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                category === item
                  ? "bg-white/10 text-orange-400"
                  : "bg-orange-50 text-orange-500"
              }`}
            >
              <CategoryIcon
                name={item}
                className="h-5 w-5"
              />
            </span>

            <span className="text-xs font-bold">
              {item}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;
