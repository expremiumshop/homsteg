import { Search, ShoppingCart, User } from "lucide-react";

import type {
  MarketSectionConfig,
} from "../../../registry";

/* =========================================================
   MARKET — HEADER 3 (Centralizado)
   Logo, pesquisa e ações centrados.
   ========================================================= */

export default function Header3({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <header className="border-b border-gray-200 bg-[#111713]">
      <div className="flex flex-col items-center gap-2 px-4 py-3 sm:px-6">
        <span className="text-base font-black uppercase tracking-[0.3em] text-white">
          Market
        </span>

        <div className="flex w-full max-w-lg items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
          <Search className="h-4 w-4 text-gray-300" />

          <span className="text-xs text-gray-300">
            O que procura hoje?
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-gray-300">
          <button
            type="button"
            className="flex items-center gap-1 transition hover:text-white"
          >
            <User className="h-3.5 w-3.5" />

            Conta
          </button>

          <button
            type="button"
            className="flex items-center gap-1 transition hover:text-white"
          >
            <ShoppingCart className="h-3.5 w-3.5" />

            Carrinho
          </button>
        </div>
      </div>

      {config && (
        <div className="border-t border-white/10 px-4 py-1.5 text-center text-[11px] text-gray-400 sm:px-6">
          {config.category.name}
        </div>
      )}
    </header>
  );
}
