/* =========================================================
   MARKET — BANNER 7
   Conceito exclusivo HOMSTEG — "Banner em Camadas"

   Uma única composição visual:
   imagem + produto + informação + benefício + CTA.
   Sem dividir o banner em blocos.
   ========================================================= */

   type DemoBanner = {
    title?: string;
    subtitle?: string;
    imageUrl?: string | null;
  };
  
  const demoBanner: DemoBanner = {
    title: "Encontre algo que combina com você",
    subtitle:
      "Uma seleção especial de produtos escolhidos para esta campanha.",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",
  };
  
  export default function Banner7({
    banner = demoBanner,
  }: {
    banner?: DemoBanner;
  }) {
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-black md:rounded-3xl">
          <div className="relative aspect-[16/7] w-full overflow-hidden md:aspect-[16/6] lg:aspect-[16/5.5]">
            {/* Imagem única de fundo */}
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt="Campanha demonstrativa"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-800" />
            )}
  
            {/* Tratamento da imagem */}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
  
            {/* Conteúdo principal */}
            <div className="absolute inset-0 z-10 flex items-center">
              <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16">
                <div className="max-w-[560px]">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Seleção especial
                  </span>
  
                  <h2 className="mt-4 max-w-[500px] text-3xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
                    {banner.title || "A tua campanha aqui"}
                  </h2>
  
                  <p className="mt-4 max-w-[390px] text-xs leading-5 text-white/80 sm:text-sm md:text-base">
                    {banner.subtitle ||
                      "Adiciona título e subtítulo no painel."}
                  </p>
  
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-black transition hover:bg-white/90"
                    >
                      Explorar agora
                    </button>
  
                    <span className="rounded-full border border-white/25 bg-black/20 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
                      Até 30% OFF
                    </span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Cartão flutuante — parte da mesma composição */}
            <div className="absolute bottom-5 right-5 z-20 hidden w-[190px] overflow-hidden rounded-2xl bg-white shadow-2xl sm:block md:right-8 md:bottom-8 lg:right-12">
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
                  alt="Produto em destaque"
                  className="h-full w-full object-cover"
                />
  
                <span className="absolute left-2.5 top-2.5 rounded-full bg-black px-2.5 py-1 text-[8px] font-black uppercase text-white">
                  Destaque
                </span>
              </div>
  
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold text-black">
                      Smartwatch Pro
                    </p>
                    <p className="mt-0.5 text-[8px] text-black/45">
                      Mais vendido
                    </p>
                  </div>
  
                  <p className="text-xs font-black text-black">
                    1.990 MT
                  </p>
                </div>
              </div>
            </div>
  
            {/* Pequeno indicador de campanha */}
            <div className="absolute right-5 top-5 z-20 rounded-full bg-white/90 px-3 py-2 backdrop-blur-sm md:right-8 md:top-8">
              <p className="text-[8px] font-black uppercase tracking-[0.12em] text-black">
                Oferta especial
              </p>
            </div>
          </div>
  
          {/* Barra inferior integrada */}
          <div className="relative z-20 flex items-center justify-between gap-4 bg-black px-5 py-3.5 text-white md:px-8">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white">
                Descubra
              </span>
  
              <span className="hidden text-[9px] text-white/45 sm:inline">
                Produtos selecionados para esta campanha
              </span>
            </div>
  
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-7 rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
            </div>
          </div>
        </div>
      </section>
    );
  }