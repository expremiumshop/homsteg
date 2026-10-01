import { ArrowRight, Store } from "lucide-react";
import { Link } from "wouter";

import type { MarketSectionKind } from "./registry";
import {
  MARKET_SECTION_LABELS,
  MARKET_SECTION_ORDER,
} from "./registry";

/* =========================================================
   MARKET — CARTÃO DE ACESSO RÁPIDO
   Exibido no topo da página "Personalizar loja",
   acima do cartão do Logo. Abre o módulo Market.
   ========================================================= */

export default function MarketQuickCard({
  storeId,
}: {
  storeId?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111713] text-white">
            <Store className="h-5 w-5" />
          </span>

          <div>
            <h3 className="text-sm font-bold text-[#111713]">
              Market
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Personalize o cabeçalho, banners, cartões
              e rodapé da loja Market.
            </p>
          </div>
        </div>

        <Link
          href={
            storeId
              ? `/app/market?storeId=${storeId}`
              : "/app/market"
          }
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#111713] px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Abrir Market

          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Resumo das secções editáveis */}
      <div className="mt-4 flex flex-wrap gap-2">
        {MARKET_SECTION_ORDER.map((kind) => (
          <span
            key={kind}
            className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600"
          >
            {MARKET_SECTION_LABELS[kind]}
          </span>
        ))}
      </div>
    </div>
  );
}
