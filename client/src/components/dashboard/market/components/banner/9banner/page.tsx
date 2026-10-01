/* =========================================================
   MARKET — BANNER 9 (Overlay)
   Extraído do modelo 5 do carrossel do tema Nova e
   isolado como funcionalidade do Market. Sem dependências
   do tema: dados de demonstração locais.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Overlay" na Personalização
   (stores.bannerModel = "5").
   ========================================================= */

type DemoBanner = {
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
};

const demoBanner: DemoBanner = {
  title: "Título da campanha",
  subtitle: "Subtítulo da campanha",
  imageUrl: null,
};

export default function Banner9({
  banner = demoBanner,
}: {
  banner?: DemoBanner;
}) {
  return (
    <section className="w-full px-3 py-3 md:px-6 md:py-5">
      <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-gray-100 md:rounded-3xl">
        <div className="relative aspect-[16/7] w-full md:aspect-[16/6] lg:aspect-[16/5.5]">
          {banner.imageUrl ? (
            <img
              src={banner.imageUrl}
              alt="Banner"
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-500" />
          )}

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/35 px-6 text-center text-white">
            <h2 className="max-w-xl text-xl font-black tracking-tight drop-shadow-sm sm:text-3xl md:text-4xl">
              {banner.title || "Título da campanha"}
            </h2>

            <p className="max-w-lg text-xs font-medium text-white/85 sm:text-sm md:text-base">
              {banner.subtitle || "Subtítulo da campanha"}
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
