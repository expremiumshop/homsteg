import { Search, ShoppingCart } from "lucide-react";

import type {
  MarketSectionConfig,
} from "../../../registry";

/* =========================================================
   MARKET — HEADER 2 (Minimal)
   Logo à esquerda, pesquisa à direita, sem topbar.
   ========================================================= */

export default function Header2({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 text-sm font-black text-[#111713]">
            M
          </span>

          <span className="text-base font-bold tracking-tight text-[#111713]">
            Market
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 sm:flex">
            <Search className="h-4 w-4 text-gray-400" />

            <span className="text-xs text-gray-400">
              Pesquisar
            </span>
          </div>

          <button
            type="button"
            aria-label="Carrinho"
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {config && (
        <div className="px-4 pb-2 text-[11px] text-gray-400 sm:px-6">
          {config.category.name}
        </div>
      )}
    </header>
  );
}
