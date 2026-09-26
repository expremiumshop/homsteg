import { ArrowRight, TicketPercent } from "lucide-react";

type PromoBannerProps = {
  onCta: () => void;
};

export function PromoBanner({
  onCta,
}: PromoBannerProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-7 text-white md:p-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">
              <TicketPercent className="h-3.5 w-3.5" />
              Oferta especial
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              Mais estilo. Mais tecnologia. Mais Prime.
            </h2>

            <p className="mt-3 text-sm leading-6 text-orange-50">
              Encontre produtos selecionados para deixar o
              seu dia mais simples, bonito e completo.
            </p>
          </div>

          <button
            type="button"
            onClick={onCta}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-orange-600"
          >
            Explorar ofertas
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;
