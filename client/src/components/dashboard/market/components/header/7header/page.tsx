import { Heart, Search, ShoppingCart } from "lucide-react";

import type { MarketSectionConfig } from "../../../registry";

export default function Header7({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <header className="rounded-xl border border-slate-200 bg-white px-4 py-4">
      <div className="grid grid-cols-3 items-center">
        <div className="flex gap-3 text-slate-500"><Search size={16} /><Heart size={16} /></div>
        <strong className="text-center text-sm font-black tracking-[0.18em] text-slate-900">
          {config?.category.name ?? "NOVA"}
        </strong>
        <div className="flex justify-end text-slate-600"><ShoppingCart size={16} /></div>
      </div>
      <p className="mt-2 text-center text-[9px] uppercase tracking-[0.22em] text-slate-400">Estilo que inspira</p>
    </header>
  );
}
