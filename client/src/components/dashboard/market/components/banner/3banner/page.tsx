import { ArrowRight } from "lucide-react";

import type {
  MarketSectionConfig,
} from "../../../registry";

/* =========================================================
   MARKET — BANNER 3 (Faixa)
   Faixa compacta com chamada e seta.
   ========================================================= */

export default function Banner3({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <section className="px-4 sm:px-6">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 rounded-xl bg-lime-300 px-5 py-4 text-left transition hover:bg-lime-400"
      >
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#111713]">
            {config?.category.name ??
              "Frete grátis acima de 5.000 MT"}
          </p>

          <p className="mt-0.5 text-xs text-emerald-900">
            Válido em toda a loja
          </p>
        </div>

        <ArrowRight className="h-5 w-5 shrink-0 text-[#111713]" />
      </button>
    </section>
  );
}
