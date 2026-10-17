import { ArrowRight, Tag } from "lucide-react";

import type { MarketCategory } from "../../../registry";

export default function Category8({ category }: { category?: MarketCategory }) {
  return (
    <article className="grid grid-cols-[1fr_auto] overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="p-4"><span className="text-[9px] font-bold uppercase tracking-wider text-teal-700">Categoria em foco</span><h3 className="mt-1 text-sm font-black text-slate-900">{category?.name ?? "Eletrónica"}</h3><p className="mt-1 text-[10px] text-slate-500">Tecnologia para o teu dia</p></div>
      <div className="flex w-14 flex-col items-center justify-center gap-2 bg-teal-700 text-white"><Tag size={17} /><ArrowRight size={14} /></div>
    </article>
  );
}
