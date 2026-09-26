import {
  BadgePercent,
  Clock3,
  Sparkles,
} from "lucide-react";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid min-h-[430px] overflow-hidden rounded-3xl bg-slate-950 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=90"
              alt="Luxe collection"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

            <div className="relative z-10 flex min-h-[430px] max-w-2xl flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
              <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-amber-300">
                <Sparkles className="h-4 w-4" />
                Luxe Collection
              </div>

              <h1 className="max-w-xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                O luxo começa
                <br />
                nos detalhes.
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-6 text-white/70 sm:text-base">
                Descubra uma seleção exclusiva de
                moda, tecnologia, beleza e
                acessórios escolhidos para quem
                não abre mão de estilo.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-lg bg-white px-5 py-3 text-xs font-black text-slate-950">
                  EXPLORAR COLEÇÃO
                </div>

                <div className="rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-xs font-black text-white backdrop-blur">
                  ATÉ 50% OFF
                </div>
              </div>

              <div className="mt-10 flex items-center gap-6 text-[10px] font-bold uppercase tracking-wide text-white/50">
                <span>Entrega nacional</span>
                <span>Pagamento seguro</span>
                <span>Produtos selecionados</span>
              </div>
            </div>
          </div>

          <div className="hidden bg-gradient-to-br from-amber-200 via-yellow-100 to-white p-8 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-700">
                <BadgePercent className="h-4 w-4" />
                Oferta especial
              </div>

              <p className="mt-8 text-sm font-bold text-slate-600">
                Semana Luxe
              </p>

              <p className="mt-2 text-6xl font-black tracking-tighter text-slate-950">
                50%
              </p>

              <p className="text-2xl font-black uppercase tracking-tight text-slate-950">
                OFF
              </p>

              <p className="mt-4 max-w-xs text-xs leading-5 text-slate-600">
                Descontos especiais em produtos
                selecionados durante a campanha.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 text-white">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Clock3 className="h-4 w-4 text-amber-300" />
                Termina em
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-white/10 p-2">
                  <div className="text-xl font-black">
                    12
                  </div>

                  <div className="text-[8px] uppercase text-white/50">
                    Horas
                  </div>
                </div>

                <div className="rounded-lg bg-white/10 p-2">
                  <div className="text-xl font-black">
                    42
                  </div>

                  <div className="text-[8px] uppercase text-white/50">
                    Min
                  </div>
                </div>

                <div className="rounded-lg bg-white/10 p-2">
                  <div className="text-xl font-black">
                    18
                  </div>

                  <div className="text-[8px] uppercase text-white/50">
                    Seg
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
