import { Search, UserRound } from "lucide-react";

import type { MarketSectionConfig } from "../../../registry";

export default function Header5({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <header className="rounded-xl border border-stone-200 bg-[#faf8f4] px-5 py-5">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-stone-500">
        <span>Coleção cuidadosamente selecionada</span>
        <span>Moçambique · 2026</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-y border-stone-200 py-4">
        <Search size={18} className="text-stone-500" />
        <strong className="font-serif text-xl tracking-wide text-stone-900">
          {config?.category.name ?? "ATELIER"}
        </strong>
        <UserRound size={18} className="text-stone-500" />
      </div>
    </header>
  );
}
