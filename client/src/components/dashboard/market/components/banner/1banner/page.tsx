import { ArrowRight } from "lucide-react";

import type {
  MarketSectionConfig,
} from "../../../registry";

/* =========================================================
   MARKET — BANNER 1 (Gradiente)
   Fundo em gradiente, título grande e CTA.
   ========================================================= */

export default function Banner1({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <section className="px-4 sm:px-6">
      <div className="flex min-h-[180px] flex-col justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#111713] via-emerald-900 to-emerald-700 p-8 text-white">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime-300">
          Destaque da semana
        </span>

        <h2 className="max-w-md text-2xl font-black leading-tight sm:text-3xl">
          {config?.category.name ??
            "Grandes ofertas, todos os dias"}
        </h2>

        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#111713] transition hover:bg-lime-300"
        >
          Ver agora

          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
