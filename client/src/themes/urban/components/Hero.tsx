import { useState } from "react";

import { ArrowRight } from "lucide-react";

import type { UrbanStore } from "../demoData";

type HeroProps = {
  store: UrbanStore;
};

export function Hero({ store }: HeroProps) {
  const [loaded, setLoaded] = useState(false);

  const title = store.bannerUrl
    ? "Seu estilo começa aqui"
    : "O seu estilo.\nDo seu jeito.";

  const subtitle =
    store.description ||
    "Descubra peças selecionadas para quem gosta de design, atitude e personalidade.";

  return (
    <section className="relative overflow-hidden bg-neutral-100">
      <div className="mx-auto grid min-h-[620px] max-w-[1440px] lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-16 md:px-10 lg:px-16">
          <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
            Coleção 2026
          </div>

          <h1 className="max-w-[620px] whitespace-pre-line text-5xl font-black leading-[0.95] tracking-[-0.045em] text-neutral-950 sm:text-6xl md:text-7xl lg:text-[78px]">
            {title}
          </h1>

          <p className="mt-7 max-w-[480px] text-base leading-7 text-neutral-500 md:text-lg">
            {subtitle}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex h-13 items-center justify-center gap-3 rounded-full bg-neutral-950 px-6 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Comprar agora
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="inline-flex h-13 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200"
            >
              Ver coleção
            </button>
          </div>

          <div className="mt-12 grid max-w-[460px] grid-cols-3 gap-5">
            <div>
              <div className="text-2xl font-black tracking-tight text-neutral-950">
                10k+
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                Clientes
              </div>
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight text-neutral-950">
                4.9
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                Avaliação
              </div>
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight text-neutral-950">
                48h
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                Envio
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[450px] lg:min-h-[620px]">
          {store.bannerUrl ? (
            <img
              src={store.bannerUrl}
              alt={store.name || "Loja"}
              className="absolute inset-0 h-full w-full object-cover"
              onLoad={() => setLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_35%_72%,rgba(255,255,255,0.08),transparent_25%)]" />

              <div className="absolute inset-0 flex items-end justify-end overflow-hidden">
                <div className="relative h-[88%] w-[76%] overflow-hidden rounded-tl-[160px] bg-neutral-800">
                  <img
                    src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85"
                    alt="Coleção Urban"
                    className={`h-full w-full object-cover transition-opacity duration-700 ${
                      loaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setLoaded(true)}
                  />

                  <div className="absolute inset-0 bg-black/10" />
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-7 left-7 rounded-2xl bg-white/95 px-5 py-4 shadow-xl backdrop-blur">
            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
              Destaque
            </div>

            <div className="mt-1 text-sm font-bold text-neutral-950">
              Novos favoritos chegaram
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
