/* =========================================================
   MARKET — BANNER 7 (Duplo)
   Extraído do modelo 3 do carrossel do tema Nova e
   isolado como funcionalidade do Market. Sem dependências
   do tema: dados de demonstração locais.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Duplo" na Personalização
   (stores.bannerModel = "3").
   ========================================================= */

type DemoBanner = {
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
};

const demoBanner: DemoBanner = {
  title: "Título da campanha",
  subtitle: "Adiciona título e subtítulo no painel.",
  imageUrl: null,
};

export default function Banner7({
  banner = demoBanner,
}: {
  banner?: DemoBanner;
}) {
  return (
    <section className="w-full px-3 py-3 md:px-6 md:py-5">
      <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-gray-100 md:rounded-3xl">
        <div className="relative grid aspect-[16/7] w-full grid-cols-2 gap-px bg-black/10 md:aspect-[16/6] lg:aspect-[16/5.5]">
          {/* Área A — imagem + legenda */}
          <div className="relative overflow-hidden bg-slate-800">
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt="Banner"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-500" />
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-white">
              {banner.title && (
                <p className="truncate text-xs font-bold sm:text-sm">
                  {banner.title}
                </p>
              )}

              {banner.subtitle && (
                <p className="truncate text-[10px] text-white/80 sm:text-xs">
                  {banner.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Área B — conteúdo sólido do mesmo slide */}
          <div className="flex flex-col items-start justify-center gap-1.5 bg-emerald-950 px-4 py-4 text-left text-white md:px-6">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
              Destaque
            </span>

            <p className="line-clamp-2 text-sm font-black sm:text-lg">
              {banner.title || "A tua campanha aqui"}
            </p>

            <p className="line-clamp-2 text-[11px] text-white/80 sm:text-sm">
              {banner.subtitle ||
                "Adiciona título e subtítulo no painel."}
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
