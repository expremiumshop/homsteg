/* =========================================================
   MARKET — BANNER 8 (Editorial Premium)

   Modelo profissional e versátil para diferentes tipos
   de lojas. Demonstração local da funcionalidade do Market.
   ========================================================= */

   type DemoBanner = {
    title?: string;
    subtitle?: string;
    imageUrl?: string | null;
  };
  
  const demoBanner: DemoBanner = {
    title: "Descubra a nova coleção",
    subtitle: "Produtos selecionados para transformar a sua experiência de compra.",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85",
  };
  
  export default function Banner8({
    banner = demoBanner,
  }: {
    banner?: DemoBanner;
  }) {
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-[#f4f4f1] md:rounded-3xl">
          <div className="grid min-h-[430px] grid-cols-1 md:min-h-[500px] md:grid-cols-[1.15fr_0.85fr]">
            {/* Imagem principal */}
            <div className="relative min-h-[260px] overflow-hidden md:min-h-full">
              {banner.imageUrl ? (
                <img
                  src={banner.imageUrl}
                  alt="Imagem demonstrativa da campanha"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-200" />
              )}
  
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
  
              <div className="absolute bottom-5 left-5 md:bottom-7 md:left-7">
                <span className="bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-black">
                  Coleção em destaque
                </span>
              </div>
            </div>
  
            {/* Conteúdo editorial */}
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 md:px-10 lg:px-14">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/45">
                Nova temporada
              </span>
  
              <h2 className="mt-3 max-w-[420px] text-3xl font-black leading-[0.95] tracking-[-0.045em] text-[#111713] sm:text-4xl lg:text-5xl">
                {banner.title || "Descubra a nova coleção"}
              </h2>
  
              <p className="mt-4 max-w-[390px] text-sm leading-6 text-black/55">
                {banner.subtitle ||
                  "Produtos selecionados para transformar a sua experiência de compra."}
              </p>
  
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-black/85"
                >
                  Explorar coleção
                </button>
  
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-black/50">
                  Até 30% OFF
                </span>
              </div>
  
              {/* Informações adicionais */}
              <div className="mt-8 grid max-w-[400px] grid-cols-3 border-t border-black/10 pt-5">
                <div>
                  <p className="text-sm font-black text-black">+500</p>
                  <p className="mt-0.5 text-[8px] font-medium uppercase tracking-wide text-black/45">
                    Produtos
                  </p>
                </div>
  
                <div className="border-l border-black/10 pl-4">
                  <p className="text-sm font-black text-black">24h</p>
                  <p className="mt-0.5 text-[8px] font-medium uppercase tracking-wide text-black/45">
                    Ofertas
                  </p>
                </div>
  
                <div className="border-l border-black/10 pl-4">
                  <p className="text-sm font-black text-black">100%</p>
                  <p className="mt-0.5 text-[8px] font-medium uppercase tracking-wide text-black/45">
                    Selecionados
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-6 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </div>
        </div>
      </section>
    );
  }