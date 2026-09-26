import {
  ChevronDown,
  Crown,
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { Link } from "wouter";

import { useState } from "react";

type HeaderProps = {
  storeName: string;
  categories: string[];
  storeSlug?: string;
  cartCount?: number;
};

export function Header({
  storeName,
  categories,
  storeSlug,
  cartCount = 0,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Crown className="h-5 w-5" />
              </div>

              <div className="hidden sm:block">
                <div className="text-xl font-black tracking-[0.22em] text-slate-950">
                  {storeName}
                </div>

                <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">
                  Marketplace
                </div>
              </div>
            </div>

            <div className="hidden lg:flex lg:w-36 lg:shrink-0 lg:items-center lg:gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                  Entregar em
                </p>

                <p className="text-xs font-bold text-slate-800">
                  Moçambique
                </p>
              </div>

              <ChevronDown className="ml-auto h-3.5 w-3.5 text-slate-400" />
            </div>

            <div className="flex min-w-0 flex-1 items-center rounded-xl border-2 border-slate-950 bg-white">
              <div className="hidden items-center gap-1 border-r border-slate-200 px-3 text-xs font-semibold text-slate-500 md:flex">
                Todos
                <ChevronDown className="h-3.5 w-3.5" />
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 shrink-0 text-slate-400" />

                <span className="truncate text-sm text-slate-400">
                  Pesquisar produtos, marcas e
                  categorias...
                </span>
              </div>

              <div className="flex h-11 w-12 items-center justify-center rounded-r-[10px] bg-slate-950 text-white">
                <Search className="h-5 w-5" />
              </div>
            </div>

            <div className="hidden items-center gap-5 xl:flex">
              <Link
                href={`/themes/luxe/conta${storeContext}`}
                className="flex items-center gap-2"
              >
                <UserRound className="h-5 w-5 text-slate-700" />

                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Olá
                  </p>

                  <p className="text-xs font-bold text-slate-800">
                    Conta
                  </p>
                </div>
              </Link>

              <div className="relative flex items-center">
                <Heart className="h-5 w-5 text-slate-700" />
              </div>

              <Link
                href={`/themes/luxe/carrinho${storeContext}`}
                className="relative flex items-center"
              >
                <ShoppingBag className="h-6 w-6 text-slate-700" />

                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-black text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-3 xl:hidden">
              <Link
                href={`/themes/luxe/carrinho${storeContext}`}
                className="relative"
              >
                <ShoppingBag className="h-5 w-5" />
              </Link>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    (current) => !current,
                  )
                }
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY NAV */}
        <div className="border-t border-slate-100">
          <div className="mx-auto flex max-w-[1500px] items-center gap-6 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex shrink-0 items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-950">
              <Menu className="h-4 w-4" />
              Categorias
            </div>

            {categories.map(
              (category, index) => (
                <div
                  key={category}
                  className={`shrink-0 text-xs font-semibold ${
                    index === 0
                      ? "text-red-600"
                      : "text-slate-600"
                  }`}
                >
                  {category}
                </div>
              ),
            )}
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[80]">
          <div
            className="absolute inset-0 bg-slate-950/50"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          <aside className="relative h-full w-[86%] max-w-sm bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Crown className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-black tracking-[0.2em]">
                    {storeName}
                  </p>

                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    Marketplace
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Categorias
              </p>

              <div className="space-y-1">
                {categories.map(
                  (category) => (
                    <div
                      key={category}
                      className="rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-100"
                    >
                      {category}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="mt-8 space-y-2 border-t border-slate-100 pt-6">
              <Link
                href={`/themes/luxe/carrinho${storeContext}`}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                <ShoppingBag className="h-4 w-4" />
                Carrinho
              </Link>

              <Link
                href={`/themes/luxe/conta${storeContext}`}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                <UserRound className="h-4 w-4" />
                Minha conta
              </Link>

              <Link
                href={`/themes/luxe/mensagens${storeContext}`}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                <Heart className="h-4 w-4" />
                Atendimento
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Header;
