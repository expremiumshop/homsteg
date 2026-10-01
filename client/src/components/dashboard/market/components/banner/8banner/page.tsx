/* =========================================================
   MARKET — BANNER 8 (Split)
   Extraído do modelo 4 do carrossel do tema Nova e
   isolado como funcionalidade do Market. Sem dependências
   do tema: dados de demonstração locais.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Split" na Personalização
   (stores.bannerModel = "4").
   ========================================================= */

type DemoBanner = {
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
};

const demoBanner: DemoBanner = {
  title: "Título do banner",
  subtitle: "Subtítulo do banner",
  imageUrl: null,
};

export default function Banner8({
  banner = demoBanner,
}: {
  banner?: DemoBanner;
}) {
  return (
    <section className="w-full px-3 py-3 md:px-6 md:py-5">
      <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-white md:rounded-3xl">
        <div className="relative grid aspect-[16/7] w-full grid-cols-2 md:aspect-[16/6] lg:aspect-[16/5.5]">
          {/* Metade imagem */}
          <div className="relative overflow-hidden bg-slate-100">
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt="Banner"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
            )}
          </div>

          {/* Metade texto */}
          <div className="flex flex-col justify-center gap-2 bg-white px-5 py-4 text-left md:px-10">
            <h2 className="line-clamp-2 text-base font-black tracking-tight text-slate-950 sm:text-xl md:text-2xl">
              {banner.title || "Título do banner"}
            </h2>

            <p className="line-clamp-2 text-[11px] font-medium text-slate-500 sm:text-sm">
              {banner.subtitle || "Subtítulo do banner"}
            </p>
          </div>
        </div>

        {/* Indicadores (demo) */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
          <span className="h-2 w-6 rounded-full bg-white" />
          <span className="h-2 w-2 rounded-full bg-white/60" />
          <span className="h-2 w-2 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
