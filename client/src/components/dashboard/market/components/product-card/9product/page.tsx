import { Heart, ShoppingBag } from "lucide-react";

type DemoProduct = {
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: string | null;
};

export default function Product9({ product }: { product?: DemoProduct }) {
  return (
    <article className="overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm">
      <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-rose-100 to-orange-50">
        {product?.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <span className="text-4xl">👟</span>}
        <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-1 text-[9px] font-black text-white">-20%</span>
        <Heart size={16} className="absolute right-2 top-2 text-rose-700" />
      </div>
      <div className="p-3"><p className="text-[9px] uppercase tracking-wider text-rose-600">{product?.category ?? "Destaques"}</p><h3 className="mt-1 text-xs font-bold text-slate-900">{product?.name ?? "Ténis Urban Pro"}</h3><div className="mt-3 flex items-center justify-between"><span className="font-black text-rose-700">{product?.price ?? 3490} MT</span><ShoppingBag size={16} className="text-rose-700" /></div></div>
    </article>
  );
}
