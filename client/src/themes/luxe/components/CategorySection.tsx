import { ArrowRight } from "lucide-react";

import {
  categoryCards,
  type LuxeCategoryCard,
} from "../demoData";

function CategoryCard({
  item,
}: {
  item: LuxeCategoryCard;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-slate-100">
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 pt-16">
        <h3 className="text-lg font-black text-white">
          {item.name}
        </h3>

        <p className="mt-1 text-xs font-medium text-white/70">
          {item.count}
        </p>
      </div>
    </article>
  );
}

export function CategorySection() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
              Explore
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Compre por categoria
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Encontre exatamente o que
              procura.
            </p>
          </div>

          <div className="hidden items-center gap-1 text-xs font-bold text-slate-500 sm:flex">
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categoryCards.map((item) => (
            <CategoryCard
              key={item.name}
              item={item}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
