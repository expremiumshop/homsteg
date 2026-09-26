import { ArrowRight } from "lucide-react";

export function PromoSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-8">
      <div className="relative overflow-hidden rounded-[34px] bg-neutral-950 px-6 py-12 text-white md:px-12 md:py-16">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/[0.06]" />
        <div className="absolute -bottom-40 right-20 h-96 w-96 rounded-full bg-white/[0.04]" />

        <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
              Oferta especial
            </p>

            <h2 className="mt-4 max-w-[720px] text-4xl font-black tracking-[-0.045em] md:text-6xl">
              Seu próximo favorito pode estar aqui.
            </h2>

            <p className="mt-5 max-w-[560px] text-sm leading-7 text-white/55 md:text-base">
              Aproveite condições especiais em produtos
              selecionados e descubra uma nova forma de
              comprar.
            </p>
          </div>

          <button
            type="button"
            className="flex h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-black text-neutral-950 transition hover:bg-neutral-200"
          >
            Comprar agora
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
