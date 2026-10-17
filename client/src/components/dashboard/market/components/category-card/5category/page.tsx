import { Sparkles } from "lucide-react";

import type { MarketCategory } from "../../../registry";

export default function Category5({ category }: { category?: MarketCategory }) {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-700 to-purple-950 p-5 text-white">
      <Sparkles className="absolute right-4 top-4 text-fuchsia-200" size={20} />
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-fuchsia-200">Curadoria especial</span>
      <h3 className="mt-5 text-lg font-black">{category?.name ?? "Mais procurados"}</h3>
      <p className="mt-1 text-xs text-white/75">Peças escolhidas para ti</p>
    </article>
  );
}
