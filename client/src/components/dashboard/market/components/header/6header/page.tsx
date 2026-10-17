import { Menu, Search, ShoppingBag } from "lucide-react";

import type { MarketSectionConfig } from "../../../registry";

const categories = ["Novidades", "Moda", "Casa", "Ofertas"];

export default function Header6({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <header className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <Menu size={18} className="text-slate-600" />
        <strong className="text-sm font-black text-slate-900">
          {config?.category.name ?? "URBAN"}
        </strong>
        <div className="ml-auto flex items-center gap-3 text-slate-600">
          <Search size={16} />
          <ShoppingBag size={16} />
        </div>
      </div>
      <nav className="mt-3 flex gap-4 overflow-hidden border-t border-slate-100 pt-2 text-[10px] font-medium text-slate-500">
        {categories.map((item) => <span key={item}>{item}</span>)}
      </nav>
    </header>
  );
}
