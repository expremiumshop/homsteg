import { Search, ShoppingCart, Store } from "lucide-react";

import type {
  MarketSectionConfig,
} from "../../../registry";

/* =========================================================
   MARKET — HEADER 1 (Clássico)
   Topbar escuro + barra principal com pesquisa central.
   ========================================================= */

export default function Header1({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <header className="border-b border-gray-200 bg-white">
      {/* Topbar */}
      <div className="flex h-9 items-center justify-between bg-[#111713] px-4 text-xs text-gray-300 sm:px-6">
        <span>Entregas em todo o país</span>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="transition hover:text-white"
          >
            Ajuda
          </button>

          <button
            type="button"
            className="transition hover:text-white"
          >
            Rastrear pedido
          </button>
        </div>
      </div>

      {/* Barra principal */}
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111713] text-sm font-black text-white">
            M
          </div>

          <span className="text-base font-black tracking-tight text-[#111713]">
            MARKET
          </span>
        </div>

        <div className="mx-auto hidden max-w-md flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 md:flex">
          <Search className="h-4 w-4 text-gray-400" />

          <span className="text-sm text-gray-400">
            Pesquisar produtos...
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Loja"
            className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100"
          >
            <Store className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            aria-label="Carrinho"
            className="relative rounded-xl p-2 text-gray-600 transition hover:bg-gray-100"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />

            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-lime-400 text-[10px] font-bold text-[#111713]">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Dados reais (opcional) */}
      {config && (
        <div className="border-t border-gray-100 px-4 py-1.5 text-[11px] text-gray-400 sm:px-6">
          {config.category.name}
        </div>
      )}
    </header>
  );
}
