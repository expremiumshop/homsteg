import { Search, ShoppingCart, UserRound } from "lucide-react";

import type { MarketSectionConfig } from "../../../registry";

const links = ["Início", "Produtos", "Sobre", "Contacto"];

export default function Header10({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <header className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
      <div className="flex items-center gap-5">
        <strong className="shrink-0 text-sm font-black text-slate-900">{config?.category.name ?? "CASA & CIA"}</strong>
        <nav className="flex flex-1 justify-center gap-4 text-[10px] font-medium text-slate-600">
          {links.map((link) => <span key={link}>{link}</span>)}
        </nav>
        <div className="flex gap-2 text-slate-500"><Search size={15} /><UserRound size={15} /><ShoppingCart size={15} /></div>
      </div>
    </header>
  );
}
