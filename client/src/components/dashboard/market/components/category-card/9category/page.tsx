import { ChevronRight } from "lucide-react";

import type { MarketCategory } from "../../../registry";

export default function Category9({ category }: { category?: MarketCategory }) {
  return (
    <article className="flex items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-white">
      <span className="h-2 w-2 rounded-full bg-lime-400" />
      <h3 className="flex-1 text-xs font-semibold">{category?.name ?? "Acessórios"}</h3>
      <span className="text-[9px] text-slate-300">12 produtos</span>
      <ChevronRight size={15} className="text-lime-300" />
    </article>
  );
}
