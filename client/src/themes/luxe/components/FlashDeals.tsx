import { Zap } from "lucide-react";

import {
  demoFlashProducts,
  type LuxeFlashProduct,
} from "../demoData";

function FlashCard({
  item,
}: {
  item: LuxeFlashProduct;
}) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 rounded-md bg-red-600 px-2.5 py-1 text-[10px] font-black text-white">
          -{item.discount}
        </div>
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-bold text-slate-800">
          {item.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-black text-red-600">
            {item.price}
          </span>

          <span className="text-xs text-slate-400 line-through">
            {item.oldPrice}
          </span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-red-500"
            style={{ width: item.sold }}
          />
        </div>

        <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Quase esgotado
        </p>
      </div>
    </article>
  );
}

export function FlashDeals({
  products,
}: {
  products?: LuxeFlashProduct[];
}) {
  const flashProducts =
    products ?? demoFlashProducts;

  return (
    <section className="bg-[#f7f7f5] py-10 sm:py-14">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 fill-red-500 text-red-500" />

              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Ofertas relâmpago
              </h2>

              <span className="rounded-md bg-red-100 px-2 py-1 text-[10px] font-black uppercase text-red-600">
                Ao vivo
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Os melhores preços por tempo
              limitado.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white">
              08
            </div>

            <span className="font-black text-slate-400">
              :
            </span>

            <div className="rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white">
              42
            </div>

            <span className="font-black text-slate-400">
              :
            </span>

            <div className="rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white">
              19
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {flashProducts
            .slice(0, 5)
            .map((item) => (
              <FlashCard
                key={item.name}
                item={item}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

export default FlashDeals;
