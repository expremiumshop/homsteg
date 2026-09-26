import { ArrowRight } from "lucide-react";

import { Link } from "wouter";

import {
  formatPriceMzn,
  type UrbanRelatedProduct,
} from "../demoData";

type RelatedProductsProps = {
  products: UrbanRelatedProduct[];
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
        <h2 className="text-2xl font-black tracking-[-0.035em] text-neutral-950 md:text-3xl">
          Você também pode gostar
        </h2>

        <Link
          href={
            storeSlug
              ? `/store/${encodeURIComponent(storeSlug)}`
              : "/themes/urban"
          }
          className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-neutral-950 sm:flex"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {products.map(
          (item) => (
            <Link
              key={item.id}
              href={`/themes/urban/produto/${encodeURIComponent(item.slug)}${storeContext}`}
              className="group min-w-0"
            >
              <div className="relative aspect-square overflow-hidden rounded-[24px] bg-neutral-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-400">
                      Sem imagem
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3">
                <h3 className="line-clamp-2 text-sm font-bold leading-5 text-neutral-950">
                  {item.name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-neutral-950">
                    {formatPriceMzn(
                      Number(
                        item.price ??
                          0,
                      ),
                    )}
                  </span>

                  {item.oldPrice && (
                    <span className="text-xs font-medium text-neutral-400 line-through">
                      {formatPriceMzn(
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
