import { Search, ShoppingCart } from "lucide-react";

import type { MarketSectionConfig } from "../../../registry";

export default function Header4({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <header className="overflow-hidden rounded-xl border border-orange-200 bg-white">
      <div className="bg-orange-500 px-4 py-1 text-center text-[10px] font-bold uppercase tracking-widest text-white">
        Entrega grátis em compras selecionadas
      </div>
      <div className="flex items-center gap-3 px-4 py-4">
        <strong className="text-sm text-slate-900">{config?.category.name ?? "NOVA STORE"}</strong>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-400">
          <Search size={13} /> Pesquisar produtos
        </div>
        <ShoppingCart size={17} className="text-orange-600" />
      </div>
    </header>
  );
}
