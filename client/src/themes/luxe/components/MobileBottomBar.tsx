import {
  Heart,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { Link } from "wouter";

import { useCart } from "@/contexts/CartContext";

type MobileBottomBarProps = {
  storeSlug?: string;
};

export function MobileBottomBar({
  storeSlug,
}: MobileBottomBarProps) {
  const { totalItems } = useCart();

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-2">
        <Link
          href={`/themes/luxe${storeContext}`}
          className="flex flex-col items-center gap-1 py-1 text-slate-950"
        >
          <div className="flex h-7 w-7 items-center justify-center">
            <Search className="h-4 w-4" />
          </div>

          <span className="text-[9px] font-bold">
            Pesquisar
          </span>
        </Link>

        <Link
          href={`/themes/luxe/conta${storeContext}`}
          className="flex flex-col items-center gap-1 py-1 text-slate-500"
        >
          <div className="flex h-7 w-7 items-center justify-center">
            <Heart className="h-4 w-4" />
          </div>

          <span className="text-[9px] font-bold">
            Favoritos
          </span>
        </Link>

        <Link
          href={`/themes/luxe/carrinho${storeContext}`}
          className="flex flex-col items-center gap-1 py-1 text-slate-500"
        >
          <div className="relative flex h-7 w-7 items-center justify-center">
            <ShoppingBag className="h-4 w-4" />

            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-1 text-[7px] font-black text-white">
                {totalItems}
              </span>
            )}
          </div>

          <span className="text-[9px] font-bold">
            Carrinho
          </span>
        </Link>

        <Link
          href={`/themes/luxe/conta${storeContext}`}
          className="flex flex-col items-center gap-1 py-1 text-slate-500"
        >
          <div className="flex h-7 w-7 items-center justify-center">
            <UserRound className="h-4 w-4" />
          </div>

          <span className="text-[9px] font-bold">
            Conta
          </span>
        </Link>
      </div>
    </div>
  );
}

export default MobileBottomBar;
