import { useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "../components/ProductCard";

type RelatedProduct = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string | null;
};

type RelatedProductsProps = {
  products: RelatedProduct[];
  storeSlug?: string;
};

export function RelatedProducts({
  products,
  storeSlug,
}: RelatedProductsProps) {
  const scrollRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  function scrollBy(
    direction: "left" | "right",
  ) {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    container.scrollBy({
      left:
        direction === "left"
          ? -320
          : 320,
      behavior: "smooth",
    });
  }

  return (
    <section className="pt-2">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            Também pode gostar
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Produtos relacionados da mesma
            loja
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy("left")}
            aria-label="Rolar para a esquerda"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => scrollBy("right")}
            aria-label="Rolar para a direita"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x gap-3 overflow-x-auto pb-2 scrollbar-hide"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[190px] shrink-0 snap-start sm:w-[220px]"
          >
            <ProductCard
              product={{
                id: Number(product.id),
                name: product.name,
                category: "Relacionados",
                price: product.price,
                oldPrice:
                  product.oldPrice ??
                  undefined,
                rating: 4.8,
                reviews: 0,
                sold: 0,
                image:
                  product.image ||
                  "/placeholder.svg",
                description: "",
                slug: product.slug,
              }}
              storeSlug={storeSlug}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
