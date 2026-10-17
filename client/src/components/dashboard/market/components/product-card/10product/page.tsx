import { ArrowUpRight, Star } from "lucide-react";

type DemoProduct = {
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: string | null;
};

export default function Product10({ product }: { product?: DemoProduct }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-[#f6f3ed]">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-[#e8e1d6]">
        {product?.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <span className="text-4xl">⌚</span>}
        <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold text-stone-700"><Star size={10} className="fill-amber-400 text-amber-500" /> Escolha da loja</span>
      </div>
      <div className="flex items-end justify-between gap-2 p-3">
        <div><p className="text-[9px] uppercase tracking-[0.18em] text-stone-500">{product?.category ?? "Essenciais"}</p><h3 className="mt-1 font-serif text-sm font-bold text-stone-900">{product?.name ?? "Relógio Minimal"}</h3><p className="mt-1 text-xs font-semibold text-stone-800">{product?.price ?? 5890} MT</p></div>
        <ArrowUpRight size={17} className="shrink-0 text-stone-600" />
      </div>
    </article>
  );
}
