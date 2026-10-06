/* =========================================================
   MARKET — BANNER 9 (Vitrine Interativa)

   Modelo exclusivo HOMSTEG.
   Conceito: o banner funciona como uma pequena vitrine
   comercial, combinando campanha, produto e categorias
   dentro de uma única peça visual.
   ========================================================= */

   type DemoBanner = {
    title?: string;
    subtitle?: string;
    imageUrl?: string | null;
  };
  
  type DemoProduct = {
    name: string;
    price: string;
    imageUrl: string;
  };
  
  const demoBanner: DemoBanner = {
    title: "Tudo o que você procura, em um só lugar",
    subtitle: "Descubra produtos selecionados para o seu próximo pedido.",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85",
  };
  
  const products: DemoProduct[] = [
    {
      name: "Smartwatch",
      price: "1.990 MT",
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Sneakers",
      price: "1.490 MT",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Fones",
      price: "790 MT",
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
    },
  ];
  
  export default function Banner9({
    banner = demoBanner,
  }: {
    banner?: DemoBanner;
  }) {
    const title = banner.title || demoBanner.title;
    const subtitle = banner.subtitle || demoBanner.subtitle;
    const imageUrl = banner.imageUrl || demoBanner.imageUrl;
  
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-[#f1f1ed] md:rounded-3xl">
          <div className="grid min-h-[470px] grid-cols-1 md:grid-cols-[0.8fr_1.2fr]">
            {/* Conteúdo */}
            <div className="relative z-20 flex flex-col justify-center px-6 py-8 sm:px-10 md:px-10 lg:px-14">
              <span className="w-fit border border-black/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-black/60">
                Seleção da semana
              </span>
  
              <h2 className="mt-4 max-w-[420px] text-3xl font-black leading-[0.92] tracking-[-0.05em] text-black sm:text-4xl lg:text-5xl">
                {title}
              </h2>
  
              <p className="mt-4 max-w-[370px] text-sm leading-5 text-black/55">
                {subtitle}
              </p>
  
              <button
                type="button"
                className="mt-6 w-fit bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-black/85"
              >
                Explorar produtos
              </button>
  
              {/* Mini categorias */}
              <div className="mt-8 flex flex-wrap gap-2">
                {["Novidades", "Mais vendidos", "Ofertas"].map((item) => (
                  <span
                    key={item}
                    className="border border-black/10 bg-white px-3 py-2 text-[9px] font-bold text-black/65"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
  
            {/* Vitrine visual */}
            <div className="relative min-h-[300px] overflow-hidden bg-[#deded8]">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Vitrine demonstrativa"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
  
              <div className="absolute inset-0 bg-black/10" />
  
              {/* Produto central */}
              <div className="absolute left-1/2 top-1/2 z-10 w-[155px] -translate-x-1/2 -translate-y-1/2 sm:w-[190px]">
                <div className="overflow-hidden rounded-xl bg-white p-2 shadow-2xl">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f3f3f3]">
                    <img
                      src={products[0].imageUrl}
                      alt={products[0].name}
                      className="h-full w-full object-cover"
                    />
  
                    <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[8px] font-black text-white">
                      DESTAQUE
                    </span>
                  </div>
  
                  <div className="px-2 pb-2 pt-2">
                    <p className="text-[10px] font-bold text-black">
                      {products[0].name}
                    </p>
  
                    <p className="mt-0.5 text-xs font-black text-black">
                      {products[0].price}
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Produto flutuante esquerdo */}
              <div className="absolute bottom-8 left-4 z-10 w-[105px] rotate-[-4deg] overflow-hidden rounded-lg bg-white shadow-xl sm:left-8">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={products[1].imageUrl}
                    alt={products[1].name}
                    className="h-full w-full object-cover"
                  />
                </div>
  
                <div className="p-2">
                  <p className="truncate text-[8px] font-bold">
                    {products[1].name}
                  </p>
                  <p className="text-[9px] font-black">{products[1].price}</p>
                </div>
              </div>
  
              {/* Produto flutuante direito */}
              <div className="absolute right-4 top-8 z-10 w-[105px] rotate-[4deg] overflow-hidden rounded-lg bg-white shadow-xl sm:right-8">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={products[2].imageUrl}
                    alt={products[2].name}
                    className="h-full w-full object-cover"
                  />
                </div>
  
                <div className="p-2">
                  <p className="truncate text-[8px] font-bold">
                    {products[2].name}
                  </p>
                  <p className="text-[9px] font-black">{products[2].price}</p>
                </div>
              </div>
  
              {/* Selo de benefício */}
              <div className="absolute bottom-6 right-5 z-20 rounded-full bg-black px-4 py-2 text-center text-white shadow-lg sm:right-8">
                <p className="text-[8px] font-bold uppercase tracking-[0.12em]">
                  Oferta
                </p>
                <p className="text-sm font-black">-30%</p>
              </div>
            </div>
          </div>
  
          {/* Linha inferior */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 bg-white px-5 py-3.5 md:px-8">
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-black/45">
                Destaques
              </span>
  
              <span className="text-[9px] font-medium text-black/45">
                Produtos selecionados
              </span>
            </div>
  
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-black" />
              <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
            </div>
          </div>
        </div>
      </section>
    );
  }