import { Search, ShoppingCart } from "lucide-react";

import type { MarketSectionConfig } from "../../../registry";

export default function Header9({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <header className="rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <strong className="text-sm font-bold text-indigo-950">{config?.category.name ?? "DESCOBRE"}</strong>
        <ShoppingCart size={17} className="text-indigo-700" />
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white px-4 py-3 shadow-sm">
        <Search size={17} className="text-indigo-500" />
        <span className="text-xs text-slate-400">Encontra o teu próximo favorito</span>
        <span className="ml-auto rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] font-bold text-white">Buscar</span>
      </div>
    </header>
  );
}
