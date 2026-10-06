import { ArrowRight } from "lucide-react";
import type { MarketSectionConfig } from "../../../registry";

/* =========================================================
   MARKET — BANNER 3
   Estilo inspirado em marketplace B2B/e-commerce.

   - Faixa compacta
   - Campanha + chamada
   - 4 produtos demonstrativos
   - Imagens fictícias
   - Produtos integrados no próprio banner
   ========================================================= */

type DemoProduct = {
  name: string;
  price: string;
  imageUrl: string;
};

const products: DemoProduct[] = [
  {
    name: "Smartwatch Pro",
    price: "2.490 MT",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Fones Wireless",
    price: "1.890 MT",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Mochila Business",
    price: "2.190 MT",
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Óculos Premium",
    price: "1.490 MT",
    imageUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80",
  },
];

const campaignImage =
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80";

export default function Banner3({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <section className="px-4 sm:px-6">
      <div className="relative overflow-hidden bg-[#f2f3f7] text-[#111713]">
        {/* Imagem da campanha como fundo */}
        <img
          src={campaignImage}
          alt="Campanha demonstrativa de produtos"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Camada para leitura */}
        <div className="absolute inset-0 bg-white/90" />

        <div className="relative z-10 flex min-h-[230px] flex-col justify-between gap-5 p-4 sm:min-h-[250px] sm:p-6 lg:flex-row lg:items-center lg:gap-8">
          {/* =================================================
              CAMPANHA
              ================================================= */}

          <div className="shrink-0 lg:w-[220px]">
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/50">
              Oferta do dia
            </span>

            <h2 className="mt-1 text-xl font-black uppercase leading-tight tracking-[-0.03em] sm:text-2xl">
              {config?.category.name ?? "Grandes ofertas"}
            </h2>

            <p className="mt-1.5 max-w-[210px] text-[11px] leading-4 text-black/60">
              Produtos selecionados com preços especiais.
            </p>

            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 bg-black px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.06em] text-white transition hover:bg-black/85"
            >
              Ver produtos
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* =================================================
              4 PRODUTOS
              ================================================= */}

          <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {products.map((product) => (
              <article
                key={product.name}
                className="overflow-hidden bg-white shadow-sm"
              >
                <div className="relative aspect-square overflow-hidden bg-[#eeeeee]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute left-1.5 top-1.5 bg-black px-1.5 py-0.5 text-[7px] font-bold uppercase text-white">
                    Oferta
                  </span>
                </div>

                <div className="p-2">
                  <h3 className="truncate text-[9px] font-bold text-black sm:text-[10px]">
                    {product.name}
                  </h3>

                  <p className="mt-0.5 text-[10px] font-black text-black sm:text-xs">
                    {product.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}