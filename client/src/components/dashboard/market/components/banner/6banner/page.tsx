/* =========================================================
   MARKET — BANNER 6 (Grande)
   Extraído do modelo 2 do carrossel do tema Nova e
   isolado como funcionalidade do Market. Sem dependências
   do tema: dados de demonstração locais.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Grande" na Personalização
   (stores.bannerModel = "2").
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

export default function Banner6({
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
            <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
          )}
        </div>

        {/* Painel de conteúdo em baixo (altura fixa) */}
        <div className="flex min-h-[88px] items-stretch border-t border-black/5 bg-emerald-950 text-white md:min-h-[112px]">
          <div className="flex flex-col justify-center gap-2 px-6 py-4 text-left md:px-10">
            <h2 className="max-w-lg text-lg font-black tracking-tight sm:text-2xl md:text-3xl">
              {banner.title || "Título da campanha"}
            </h2>

            <p className="max-w-md text-[11px] font-medium text-white/80 sm:text-sm">
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
