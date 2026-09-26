import {
  Dumbbell,
  Home,
  LayoutGrid,
  Shirt,
  Smartphone,
  Watch,
} from "lucide-react";

import {
  marketDemoCategories,
} from "../demoData";

const icons = {
  smartphone: Smartphone,
  shirt: Shirt,
  home: Home,
  watch: Watch,
  dumbbell: Dumbbell,
};

type CategoryGridProps = {
  category?: string;
  onCategory?: (category: string) => void;
  onScrollToProducts?: () => void;
};

export function CategoryGrid({
  category = "Todos",
  onCategory,
  onScrollToProducts,
}: CategoryGridProps) {
  function handleSelect(name: string) {
    onCategory?.(name);

    onScrollToProducts?.();
  }

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pt-8 sm:px-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Categorias
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Navegue por departamento
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-6">
        <button
          type="button"
          onClick={() => handleSelect("Todos")}
          className={`flex min-w-0 flex-col items-center gap-2.5 rounded-2xl border p-4 transition ${
            category === "Todos"
              ? "border-emerald-600 bg-emerald-50"
              : "border-slate-200 bg-white hover:border-emerald-300"
          }`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              category === "Todos"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            <LayoutGrid size={22} />
          </div>

          <span className="w-full truncate text-center text-xs font-bold text-slate-800">
            Todos
          </span>
        </button>

        {marketDemoCategories.map((item) => {
          const Icon =
            icons[item.icon as keyof typeof icons] ??
            LayoutGrid;

          const isActive = category === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => handleSelect(item.name)}
              className={`flex min-w-0 flex-col items-center gap-2.5 rounded-2xl border p-4 transition ${
                isActive
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-emerald-300"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <Icon size={22} />
              </div>

              <span className="w-full truncate text-center text-xs font-bold text-slate-800">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryGrid;
