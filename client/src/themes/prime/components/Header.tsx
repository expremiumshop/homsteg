import { useState } from "react";

import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  Store,
  UserRound,
  X,
} from "lucide-react";

import { Link } from "wouter";

import { CategoryIcon } from "./CategoryIcon";
import {
  primeCategories,
} from "../demoData";

type HeaderProps = {
  storeName: string;
  category: string;
  onCategory: (category: string) => void;
  onScrollToProducts: () => void;
  search: string;
  onSearch: (value: string) => void;
  cartCount: number;
  favoritesCount: number;
  onOpenCart: () => void;
  storeSlug?: string;
};

export function Header({
  storeName,
  category,
  onCategory,
  onScrollToProducts,
  search,
  onSearch,
  cartCount,
  favoritesCount,
  onOpenCart,
  storeSlug,
}: HeaderProps) {
  const [mobileMenu, setMobileMenu] =
    useState(false);

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setMobileMenu(true)
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                onCategory("Todos");
                onScrollToProducts();
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="flex shrink-0 items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg">
                <Store className="h-5 w-5" />
              </span>

              <span className="hidden text-left sm:block">
                <span className="block text-lg font-black leading-none tracking-tight">
                  {storeName}
                </span>

                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.25em] text-orange-500">
                  Prime Store
                </span>
              </span>
            </button>

            <div className="relative ml-auto hidden max-w-xl flex-1 md:block">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  onSearch(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    onScrollToProducts();
                  }
                }}
                placeholder="O que você está procurando?"
                className="h-12 w-full rounded-xl bg-slate-100 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
              <Link
                href={`/themes/prime/conta${storeContext}`}
                className="hidden h-11 w-11 items-center justify-center rounded-xl transition hover:bg-slate-100 sm:flex"
              >
                <UserRound className="h-5 w-5" />
              </Link>

              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-xl transition hover:bg-slate-100"
              >
                <Heart className="h-5 w-5" />

                {favoritesCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                    {favoritesCount}
                  </span>
                )}
              </button>

              <Link
                href={`/themes/prime/carrinho${storeContext}`}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-orange-500"
              >
                <ShoppingCart className="h-5 w-5" />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-black text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={onOpenCart}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-orange-500 md:hidden"
                aria-label="Abrir carrinho"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  onSearch(
                    event.target.value,
                  )
                }
                placeholder="Pesquisar produtos..."
                className="h-11 w-full rounded-xl bg-slate-100 pl-11 pr-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <nav className="hidden items-center gap-7 overflow-x-auto pb-3 lg:flex">
            {primeCategories
              .slice(0, 7)
              .map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    onCategory(item);
                    onScrollToProducts();
                  }}
                  className={`flex shrink-0 items-center gap-2 text-xs font-bold transition ${
                    category === item
                      ? "text-orange-500"
                      : "text-slate-600 hover:text-orange-500"
                  }`}
                >
                  <CategoryIcon
                    name={item}
                    className="h-5 w-5"
                  />
                  {item}
                </button>
              ))}

            <button
              type="button"
              onClick={() => {
                onCategory("Todos");
                onScrollToProducts();
              }}
              className="ml-auto flex shrink-0 items-center gap-2 text-xs font-black text-orange-500"
            >
              Ofertas
            </button>
          </nav>
        </div>
      </header>

      {/* MENU MOBILE */}
      {mobileMenu && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50"
            onClick={() =>
              setMobileMenu(false)
            }
          />

          <aside className="relative h-full w-[86%] max-w-sm bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Store className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-black">
                    {storeName}
                  </p>

                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-500">
                    Prime Store
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Categorias
              </p>

              <div className="space-y-1">
                {primeCategories.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        onCategory(item);
                        setMobileMenu(
                          false,
                        );
                        window.setTimeout(
                          onScrollToProducts,
                          100,
                        );
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <CategoryIcon
                        name={item}
                        className="h-5 w-5"
                      />
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
                Prime
              </p>

              <h3 className="mt-2 font-black">
                Ofertas Prime
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Descubra produtos selecionados
                com condições especiais.
              </p>

              <button
                type="button"
                onClick={() => {
                  onCategory("Todos");
                  setMobileMenu(false);
                  window.setTimeout(
                    onScrollToProducts,
                    100,
                  );
                }}
                className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-xs font-black"
              >
                Ver ofertas
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Header;
