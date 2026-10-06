import { ArrowRight } from "lucide-react";
import type { MarketSectionConfig } from "../../../registry";

/* =========================================================
   MARKET — BANNER 2
   Campanha fashion com produtos integrados no próprio banner.

   - A imagem da campanha é o fundo do banner inteiro.
   - Texto da campanha sobre o fundo.
   - 4 produtos aparecem dentro do próprio banner.
   - Todos os dados são demonstrativos/fictícios.
   ========================================================= */

type DemoProduct = {
  name: string;
  price: string;
  compareAtPrice: string;
  discount: string;
  imageUrl: string;
};

const campaignImage =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=85";

const products: DemoProduct[] = [
  {
    name: "Vestido Urban Chic",
    price: "1.990 MT",
    compareAtPrice: "2.990 MT",
    discount: "-33%",
    imageUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Blazer Classic Fit",
    price: "2.490 MT",
    compareAtPrice: "3.490 MT",
    discount: "-29%",
    imageUrl:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Conjunto Soft Style",
    price: "1.790 MT",
    compareAtPrice: "2.490 MT",
    discount: "-28%",
    imageUrl:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Bolsa Mini Fashion",
    price: "1.290 MT",
    compareAtPrice: "1.890 MT",
    discount: "-32%",
    imageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Banner2({
  config,
}: {
  config?: MarketSectionConfig;
}) {
  return (
    <section className="px-4 sm:px-6">
      <div className="relative min-h-[620px] overflow-hidden text-white sm:min-h-[680px]">
        {/* =================================================
            IMAGEM DE FUNDO DO BANNER INTEIRO
            ================================================= */}

        <img
          src={campaignImage}
          alt="Campanha demonstrativa de moda"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Escurecimento da imagem para leitura */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Gradiente inferior para integrar os produtos */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/90 via-black/55 to-transparent" />

        {/* =================================================
            CONTEÚDO DO BANNER
            ================================================= */}

        <div className="relative z-10 flex min-h-[620px] flex-col justify-between p-5 sm:min-h-[680px] sm:p-8 lg:p-10">
          {/* Texto */}
          <div className="max-w-[430px] pt-4 sm:pt-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
              Oferta especial
            </span>

            <h2 className="mt-3 text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl">
              {config?.category.name ?? "Nova coleção"}
            </h2>

            <p className="mt-4 max-w-[350px] text-sm leading-5 text-white/85">
              Descubra novos estilos com preços especiais por tempo limitado.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-black transition hover:bg-white/90"
              >
                Comprar agora
                <ArrowRight className="h-4 w-4" />
              </button>

              <span className="text-xs font-bold uppercase tracking-[0.08em] text-white">
                Até 40% OFF
              </span>
            </div>
          </div>

          {/* =================================================
              4 PRODUTOS DENTRO DO PRÓPRIO BANNER
              ================================================= */}

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                Destaques da coleção
              </span>

              <span className="text-[9px] uppercase tracking-[0.15em] text-white/60">
                Demonstração
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {products.map((product) => (
                <article
                  key={product.name}
                  className="overflow-hidden bg-white text-black shadow-lg"
                >
                  {/* Imagem do produto */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[9px] font-bold text-white">
                      {product.discount}
                    </span>
                  </div>

                  {/* Dados */}
                  <div className="p-2.5 sm:p-3">
                    <h3 className="truncate text-[10px] font-bold sm:text-xs">
                      {product.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-xs font-black sm:text-sm">
                        {product.price}
                      </span>

                      <span className="text-[9px] text-black/40 line-through">
                        {product.compareAtPrice}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}