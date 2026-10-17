import { ArrowUpRight } from "lucide-react";

import type { MarketCategory } from "../../../registry";

export default function Category4({ category }: { category?: MarketCategory }) {
  return (
    <article className="flex items-center gap-4 rounded-xl border border-sky-100 bg-sky-50 p-4">
      <span className="text-3xl font-black leading-none text-sky-200">01</span>
      <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold text-sky-950">{category?.name ?? "Novidades"}</h3><p className="mt-1 text-[10px] text-sky-700">Explore a seleção da semana</p></div>
      <ArrowUpRight size={18} className="text-sky-700" />
    </article>
  );
}
