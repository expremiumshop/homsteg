import { Search, ShoppingCart, UserRound } from "lucide-react";

import type { MarketSectionConfig } from "../../../registry";

export default function Header8({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <header className="rounded-xl bg-emerald-800 px-5 py-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-200">Mercado local</span>
          <strong className="mt-0.5 block text-sm font-black">{config?.category.name ?? "VERDE MARKET"}</strong>
        </div>
        <div className="flex gap-3"><UserRound size={16} /><ShoppingCart size={16} /></div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-slate-400">
        <Search size={13} className="text-emerald-700" /> O que procuras hoje?
      </div>
    </header>
  );
}
