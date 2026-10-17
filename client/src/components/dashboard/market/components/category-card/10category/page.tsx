import { ArrowUpRight } from "lucide-react";

import type { MarketCategory } from "../../../registry";

export default function Category10({ category }: { category?: MarketCategory }) {
  return (
    <article className="rounded-xl border border-emerald-200 bg-white p-4">
      <div className="flex items-start justify-between"><span className="rounded-md bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-800">01 / 04</span><ArrowUpRight size={16} className="text-emerald-700" /></div>
      <h3 className="mt-5 text-base font-black tracking-tight text-slate-900">{category?.name ?? "Essenciais"}</h3>
      <div className="mt-2 h-1 w-10 rounded-full bg-emerald-500" />
    </article>
  );
}
