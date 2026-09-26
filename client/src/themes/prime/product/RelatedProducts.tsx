import { ArrowRight } from "lucide-react";

import { Link } from "wouter";

import {
  formatPrice,
  type PrimeRelatedProduct,
} from "../demoData";

type RelatedProductsProps = {
  products: PrimeRelatedProduct[];
  storeSlug?: string;
};

export function RelatedProducts({
  products,
  storeSlug,
}: RelatedProductsProps) {
  if (
    !products ||
    products.length === 0
  ) {
    return null;
  }

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
          Você também pode gostar
        </h2>

        <Link
          href={
            storeSlug
              ? `/store/${encodeURIComponent(storeSlug)}`
              : "/themes/prime"
          }
          className="hidden items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-orange-500 sm:flex"
        >
          Ver todos
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-6">
        {products.map(
          (item) => (
            <Link
              key={item.id}
              href={`/themes/prime/produto/${encodeURIComponent(item.slug)}${storeContext}`}
              className="group min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative aspect-square bg-slate-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Sem imagem
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-slate-900">
                  {item.name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-slate-950">
                    {formatPrice(
                      Number(
                        item.price ?? 0,
                      ),
                    )}
                  </span>

                  {item.oldPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(
                        Number(
                          item.oldPrice,
                        ),
                      )}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}

export default RelatedProducts;
