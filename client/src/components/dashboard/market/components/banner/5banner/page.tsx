/* =========================================================
   MARKET — BANNER 5 (Atual/Compacto)
   Extraído do modelo 1 do carrossel do tema Nova e
   isolado como funcionalidade do Market. Sem dependências
   do tema: dados de demonstração locais.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Atual (compacto)" na Personalização
   (stores.bannerModel = "1").
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

export default function Banner5({
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

        {/* Indicadores (demo) */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm md:bottom-4">
          <span className="h-2 w-6 rounded-full bg-white" />
          <span className="h-2 w-2 rounded-full bg-white/60" />
          <span className="h-2 w-2 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
