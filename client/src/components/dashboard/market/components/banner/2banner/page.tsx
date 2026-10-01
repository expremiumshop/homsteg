import { ArrowRight } from "lucide-react";

import type {
  MarketSectionConfig,
} from "../../../registry";

/* =========================================================
   MARKET — BANNER 2 (Split)
   Texto à esquerda, imagem à direita.
   ========================================================= */

export default function Banner2({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <section className="px-4 sm:px-6">
      <div className="grid min-h-[180px] grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white sm:grid-cols-2">
        <div className="flex flex-col justify-center gap-3 p-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
            Nova coleção
          </span>

          <h2 className="text-xl font-black leading-tight text-[#111713] sm:text-2xl">
            {config?.category.name ??
              "Explore a nova coleção"}
          </h2>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#111713] px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Descobrir

            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 sm:flex">
          {config?.category.imageUrl ? (
            <img
              src={config.category.imageUrl}
              alt={config.category.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-gray-400">
              Imagem do banner
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
