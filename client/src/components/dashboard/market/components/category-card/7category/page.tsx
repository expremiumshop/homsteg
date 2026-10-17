import { ArrowRight } from "lucide-react";

import type { MarketCategory } from "../../../registry";

export default function Category7({ category }: { category?: MarketCategory }) {
  return (
    <article className="border-l-4 border-rose-500 bg-white px-4 py-3 shadow-sm">
      <p className="text-[9px] uppercase tracking-[0.18em] text-rose-500">Coleção 2026</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <h3 className="truncate font-serif text-base font-bold text-slate-900">{category?.name ?? "Casa & decoração"}</h3>
        <ArrowRight size={16} className="shrink-0 text-rose-500" />
      </div>
    </article>
  );
}
