/* =========================================================
   MARKET — BANNER 6
   Inspirado na linguagem visual de marketplaces como Shopee.
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
    title: "Mega Ofertas",
    subtitle: "Preços especiais por tempo limitado",
    imageUrl:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1800&q=85",
  };
  
  const products: DemoProduct[] = [
    {
      name: "Smartphone Pro",
      price: "8.990 MT",
      oldPrice: "11.990 MT",
      discount: "-25%",
      imageUrl:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Tênis Sport",
      price: "1.290 MT",
      oldPrice: "1.890 MT",
      discount: "-32%",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Fones Bluetooth",
      price: "790 MT",
      oldPrice: "1.290 MT",
      discount: "-39%",
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Mochila Casual",
      price: "990 MT",
      oldPrice: "1.490 MT",
      discount: "-34%",
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80",
    },
  ];
  
  export default function Banner6({
    banner = demoBanner,
  }: {
    banner?: DemoBanner;
  }) {
    const title = banner.title || demoBanner.title;
    const subtitle = banner.subtitle || demoBanner.subtitle;
    const imageUrl = banner.imageUrl || demoBanner.imageUrl;
  
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-[#ee4d2d] md:rounded-3xl">
          {/* Fundo da campanha */}
          <div className="absolute inset-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Campanha promocional"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[#ee4d2d]" />
            )}
  
            <div className="absolute inset-0 bg-[#ee4d2d]/75" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#ee4d2d] via-[#ee4d2d]/75 to-transparent" />
          </div>
  
          <div className="relative z-10 min-h-[540px] p-4 sm:p-6 md:min-h-[610px] md:p-8 lg:p-10">
            {/* Cabeçalho da campanha */}
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div className="max-w-[470px] text-white">
                <span className="inline-flex bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#ee4d2d]">
                  Mega promoção
                </span>
  
                <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl md:text-6xl">
                  {title}
                </h2>
  
                <p className="mt-3 max-w-[360px] text-xs font-medium leading-5 text-white/90 sm:text-sm">
                  {subtitle}
                </p>
  
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="bg-white px-5 py-3 text-xs font-black uppercase tracking-wide text-[#ee4d2d] transition hover:bg-white/90"
                  >
                    Comprar agora
                  </button>
  
                  <span className="bg-[#111] px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white">
                    Até 50% OFF
                  </span>
                </div>
              </div>
  
              {/* Contador demonstrativo */}
              <div className="w-fit bg-white px-4 py-3 text-center text-black shadow-lg">
                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-black/50">
                  Termina em
                </p>
  
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="bg-black px-2 py-1 text-xs font-black text-white">
                    08
                  </span>
                  <span className="font-black">:</span>
                  <span className="bg-black px-2 py-1 text-xs font-black text-white">
                    42
                  </span>
                  <span className="font-black">:</span>
                  <span className="bg-black px-2 py-1 text-xs font-black text-white">
                    16
                  </span>
                </div>
              </div>
            </div>
  
            {/* Produtos dentro do próprio banner */}
            <div className="absolute inset-x-4 bottom-8 sm:inset-x-6 md:inset-x-8 lg:inset-x-10">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
                    Ofertas relâmpago
                  </p>
  
                  <p className="mt-0.5 text-[9px] text-white/75">
                    Aproveite enquanto durar
                  </p>
                </div>
  
                <button
                  type="button"
                  className="text-[9px] font-bold uppercase tracking-[0.1em] text-white underline underline-offset-4"
                >
                  Ver mais
                </button>
              </div>
  
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {products.map((product) => (
                  <article
                    key={product.name}
                    className="overflow-hidden bg-white shadow-lg"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
  
                      <span className="absolute left-0 top-0 bg-[#111] px-2 py-1 text-[8px] font-black text-white">
                        {product.discount}
                      </span>
                    </div>
  
                    <div className="p-2.5 sm:p-3">
                      <h3 className="truncate text-[10px] font-bold text-black sm:text-xs">
                        {product.name}
                      </h3>
  
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-xs font-black text-[#ee4d2d] sm:text-sm">
                          {product.price}
                        </span>
  
                        <span className="text-[9px] text-black/35 line-through">
                          {product.oldPrice}
                        </span>
                      </div>
  
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/10">
                        <div className="h-full w-[72%] bg-[#ee4d2d]" />
                      </div>
  
                      <p className="mt-1 text-[8px] font-semibold text-black/45">
                        Oferta limitada
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
  
          {/* Indicadores */}
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-6 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </div>
        </div>
      </section>
    );
  }