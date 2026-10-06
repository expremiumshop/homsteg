import { ArrowRight } from "lucide-react";

import type { MarketSectionConfig } from "../../../registry";

export default function Banner1({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <section className="px-4 sm:px-6">
      <div className="relative min-h-[320px] overflow-hidden rounded-sm bg-[#e7e7e7] text-[#111] sm:min-h-[360px]">
        {/* Imagem principal da campanha */}
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85"
          alt="Campanha de moda"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Camada para integrar o conteúdo à imagem */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

        {/* Conteúdo da campanha */}
        <div className="relative z-10 flex min-h-[320px] max-w-[620px] flex-col justify-center px-6 py-10 text-white sm:min-h-[360px] sm:px-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Store
            </span>

            <span className="h-1 w-1 rounded-full bg-white" />

            <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/80">
              Collection
            </span>
          </div>

          <span className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#ffd814]">
            Oferta especial
          </span>

          <h2 className="max-w-lg text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {config?.category.name ?? "Grandes ofertas, todos os dias"}
          </h2>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/90 sm:text-base">
            Encontre produtos selecionados com preços especiais e aproveite
            ofertas por tempo limitado.
          </p>

          <button
            type="button"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-sm bg-[#ffd814] px-5 py-2.5 text-sm font-bold text-[#111] shadow-md transition hover:bg-[#f7ca00]"
          >
            Ver ofertas
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Informação promocional integrada na campanha */}
        <div className="absolute bottom-5 right-5 z-10 bg-white px-4 py-2 shadow-md sm:bottom-6 sm:right-6">
          <span className="text-sm font-bold text-[#b12704]">
            Até 40% de desconto
          </span>
        </div>
      </div>
    </section>
  );
}