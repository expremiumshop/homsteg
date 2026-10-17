import { CircleArrowRight, Shirt } from "lucide-react";

import type { MarketCategory } from "../../../registry";

export default function Category6({ category }: { category?: MarketCategory }) {
  return (
    <article className="flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 p-2 pr-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-200 text-amber-950"><Shirt size={19} /></span>
      <span className="min-w-0 flex-1"><strong className="block truncate text-sm text-amber-950">{category?.name ?? "Moda"}</strong><small className="text-[10px] text-amber-700">Ver coleção</small></span>
      <CircleArrowRight size={19} className="text-amber-700" />
    </article>
  );
}
