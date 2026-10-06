/* =========================================================
   MARKET — BANNER 5
   Inspirado na linguagem visual de marketplaces como Temu.
   Demonstração local da funcionalidade do Market.
   ========================================================= */

   type DemoProduct = {
    name: string;
    price: string;
    oldPrice: string;
    discount: string;
    imageUrl: string;
  };
  
  type DemoBanner = {
    title?: string;
    subtitle?: string;
    imageUrl?: string | null;
  };
  
  const demoBanner: DemoBanner = {
    title: "Ofertas imperdíveis",
    subtitle: "Descubra produtos que combinam com você",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",
  };
  
  const products: DemoProduct[] = [
    {
      name: "Tênis Urban",
      price: "1.490 MT",
      oldPrice: "2.190 MT",
      discount: "-32%",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Smartwatch Fit",
      price: "1.990 MT",
      oldPrice: "2.990 MT",
      discount: "-33%",
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Bolsa Casual",
      price: "1.290 MT",
      oldPrice: "1.890 MT",
      discount: "-31%",
      imageUrl:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Fones Wireless",
      price: "890 MT",
      oldPrice: "1.390 MT",
      discount: "-36%",
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
    },
  ];
  
  export default function Banner5({
    banner = demoBanner,
  }: {
    banner?: DemoBanner;
  }) {
    const title = banner.title ?? demoBanner.title;
    const subtitle = banner.subtitle ?? demoBanner.subtitle;
    const imageUrl = banner.imageUrl ?? demoBanner.imageUrl;
  
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-[#f5f5f5] md:rounded-3xl">
          {/* Imagem da campanha como fundo de todo o banner */}
          <div className="absolute inset-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Campanha promocional"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-orange-300 via-pink-300 to-yellow-200" />
            )}
  
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          </div>
  
          {/* Conteúdo */}
          <div className="relative z-10 flex min-h-[500px] flex-col justify-between p-4 sm:min-h-[560px] sm:p-6 md:min-h-[620px] md:p-8 lg:p-10">
            {/* Campanha */}
            <div className="max-w-[460px] pt-3 text-white sm:pt-6">
              <span className="inline-flex bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-black">
                Oferta limitada
              </span>
  
              <h2 className="mt-4 text-3xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                {title}
              </h2>
  
              <p className="mt-3 max-w-[360px] text-xs leading-5 text-white/90 sm:text-sm">
                {subtitle}
              </p>
  
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.06em] text-black transition hover:bg-white/90"
                >
                  Comprar agora
                </button>
  
                <span className="bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-white">
                  Até 40% OFF
                </span>
              </div>
            </div>
  
            {/* Produtos integrados no próprio banner */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
                    Escolhas para você
                  </p>
                  <p className="mt-0.5 text-[9px] text-white/65">
                    Produtos em destaque
                  </p>
                </div>
  
                <button
                  type="button"
                  className="text-[9px] font-bold uppercase tracking-[0.1em] text-white underline underline-offset-4"
                >
                  Ver tudo
                </button>
              </div>
  
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {products.map((product) => (
                  <article
                    key={product.name}
                    className="group overflow-hidden bg-white"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f2f2f2]">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
  
                      <span className="absolute left-2 top-2 bg-[#ff3b30] px-2 py-1 text-[8px] font-black text-white">
                        {product.discount}
                      </span>
                    </div>
  
                    <div className="p-2.5 sm:p-3">
                      <h3 className="truncate text-[10px] font-semibold text-black sm:text-xs">
                        {product.name}
                      </h3>
  
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-xs font-black text-black sm:text-sm">
                          {product.price}
                        </span>
  
                        <span className="text-[9px] text-black/40 line-through">
                          {product.oldPrice}
                        </span>
                      </div>
  
                      <p className="mt-1 text-[8px] font-medium text-black/45">
                        Oferta especial
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
  
          {/* Indicadores do carrossel */}
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
          </div>
        </div>
      </section>
    );
  }