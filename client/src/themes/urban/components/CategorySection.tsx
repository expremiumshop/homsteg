import { ArrowRight } from "lucide-react";

import { urbanDemoCategories } from "../demoData";

export function CategorySection() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-24">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Explore
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-neutral-950 md:text-5xl">
            Encontre seu estilo
          </h2>
        </div>

        <button
          type="button"
          className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-neutral-950 sm:flex"
        >
          Ver tudo
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {urbanDemoCategories.map((category) => (
          <button
            type="button"
            key={category.name}
            className="group relative aspect-[0.82] overflow-hidden rounded-[28px] bg-neutral-100 text-left"
          >
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5">
              <div className="text-lg font-black text-white md:text-2xl">
                {category.name}
              </div>

              <div className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
                Explorar
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
