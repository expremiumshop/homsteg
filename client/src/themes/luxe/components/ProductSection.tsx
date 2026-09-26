import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  type LuxeProduct,
} from "../demoData";

import { ProductCard } from "./ProductCard";

type ProductSectionProps = {
  products: LuxeProduct[];
  storeSlug?: string;
};

export function ProductSection({
  products,
  storeSlug,
}: ProductSectionProps) {
  return (
    <section className="bg-[#f7f7f5] pb-14 sm:pb-20">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
              Seleção Luxe
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Produtos em destaque
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Produtos populares escolhidos
              para si.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">
              Recomendados
              <ChevronDown className="ml-2 inline h-3.5 w-3.5" />
            </div>

            <div className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white sm:flex">
              <ChevronLeft className="h-4 w-4 text-slate-400" />
            </div>

            <div className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white sm:flex">
              <ChevronRight className="h-4 w-4 text-slate-700" />
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeSlug={storeSlug}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Esta loja ainda não adicionou
            produtos.
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3 text-xs font-black uppercase tracking-wide text-slate-800">
            Ver mais produtos
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductSection;
