import {
  PackageCheck,
  Sparkles,
} from "lucide-react";

import {
  type LuxeProduct,
} from "../demoData";

type NewArrivalsProps = {
  products: LuxeProduct[];
};

export function NewArrivals({
  products,
}: NewArrivalsProps) {
  return (
    <section className="bg-slate-950 py-14 text-white sm:py-20">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">
              <Sparkles className="h-4 w-4" />
              Just arrived
            </div>

            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Novidades que
              <br />
              merecem atenção.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/55">
              Uma nova seleção de produtos
              premium acaba de chegar. Peças
              modernas para elevar o seu
              estilo todos os dias.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <div className="rounded-lg bg-white px-5 py-3 text-xs font-black text-slate-950">
                VER NOVIDADES
              </div>

              <div className="rounded-lg border border-white/20 px-5 py-3 text-xs font-black text-white">
                COLEÇÃO 2026
              </div>
            </div>
          </div>

          {products.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {products
                .slice(0, 4)
                .map((product) => (
                  <div
                    key={product.id}
                    className="group relative overflow-hidden rounded-2xl bg-white/5"
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-white/40">
                          <PackageCheck className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 pt-12">
                      <p className="text-sm font-bold text-white">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs font-black text-amber-300">
                        {product.price}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;
