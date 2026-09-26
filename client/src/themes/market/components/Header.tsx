import { FormEvent, useState } from "react";

import {
  Headphones,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

import { Link, useLocation } from "wouter";

import {
  marketPopularSearches,
} from "../demoData";

type HeaderCategory = {
  id: string | number;
  name: string;
};

type HeaderProps = {
  storeName?: string;
  categories?: HeaderCategory[];
  categoriesLoading?: boolean;
  cartCount?: number;
  storeSlug?: string;
  search?: string;
  onSearch?: (value: string) => void;

  /**
   * Força a variante do cabeçalho, ignorando o
   * viewport. Usado nas pré-visualizações por
   * dispositivo, onde o media query do viewport
   * não corresponde à largura da caixa de preview.
   * "auto" (padrão) mantém o comportamento atual.
   */
  headerVariant?: "auto" | "desktop" | "mobile";
};

export function Header({
  storeName = "Market",
  categories = [],
  categoriesLoading = false,
  cartCount = 0,
  storeSlug,
  search: searchProp,
  onSearch,
  headerVariant = "auto",
}: HeaderProps) {
  const [, navigate] = useLocation();

  const [internalSearch, setInternalSearch] =
    useState("");

  /*
   * Quando o Storefront fornece onSearch, a
   * pesquisa filtra os produtos na própria
   * página (como na Prime). Caso contrário,
   * o Header mantém o estado local.
   */
  const isControlled =
    typeof onSearch === "function";

  const search = isControlled
    ? (searchProp ?? "")
    : internalSearch;

  function updateSearch(value: string) {
    if (isControlled) {
      onSearch?.(value);

      return;
    }

    setInternalSearch(value);
  }

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  const accountPath = `/themes/market/conta${storeContext}`;
  const cartPath = `/themes/market/carrinho${storeContext}`;
  const messagesPath = `/themes/market/mensagens${storeContext}`;

  function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    if (isControlled) {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" });

      return;
    }

    navigate(
      `/store?search=${encodeURIComponent(value)}`,
    );
  }

  return (
    <>
      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <header
        className={[
          "sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md",
          headerVariant === "mobile"
            ? "hidden"
            : headerVariant === "desktop"
              ? "block"
              : "hidden md:block",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
          <div className="flex min-h-[72px] items-center gap-6">
            {/* LOGO / NOME DA LOJA */}

            <Link
              href="/themes/market"
              aria-label={storeName}
              className="flex h-11 w-[190px] shrink-0 items-center gap-2 overflow-hidden"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-base font-black text-white">
                M
              </div>

              <span className="truncate whitespace-nowrap text-xl font-black tracking-tight text-slate-900">
                {storeName}
              </span>
            </Link>

            {/* PESQUISA */}

            <div className="min-w-0 flex-1">
              <form onSubmit={handleSearch}>
                <div className="flex h-11 w-full items-center overflow-hidden rounded-xl border-2 border-emerald-600 bg-white transition focus-within:border-emerald-700">
                  <div className="flex shrink-0 items-center pl-4 text-slate-400">
                    <Search size={18} />
                  </div>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      updateSearch(event.target.value)
                    }
                    placeholder="Pesquisar produtos em toda a loja..."
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="submit"
                    className="h-full shrink-0 bg-emerald-600 px-6 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    Pesquisar
                  </button>
                </div>
              </form>

              {/* BUSCAS POPULARES */}

              <div className="mt-1.5 hidden items-center gap-2 text-[11px] text-slate-400 lg:flex">
                <span className="shrink-0">Populares:</span>

                {marketPopularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => updateSearch(term)}
                    className="shrink-0 transition hover:text-emerald-600"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTA */}

            <Link
              href={accountPath}
              className="hidden shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 transition hover:bg-slate-50 xl:flex"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <User size={20} />
              </div>

              <div className="min-w-0 leading-tight">
                <div className="text-[11px] text-slate-400">
                  Olá!
                </div>

                <div className="truncate text-sm font-bold text-slate-900">
                  Entrar / Conta
                </div>
              </div>
            </Link>

            {/* ATENDIMENTO */}

            <Link
              href={messagesPath}
              className="hidden shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600 lg:flex"
            >
              <Headphones size={20} />
              <span className="text-[11px] font-semibold">
                Atendimento
              </span>
            </Link>

            {/* CARRINHO */}

            <Link
              href={cartPath}
              className="relative flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
            >
              <div className="relative">
                <ShoppingCart size={24} />

                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black text-white">
                    {cartCount}
                  </span>
                )}
              </div>

              <span className="text-[11px] font-semibold">
                Carrinho
              </span>
            </Link>
          </div>
        </div>

        {/* =====================================================
            CATEGORIAS DESKTOP
        ====================================================== */}

        <div className="border-t border-slate-100 bg-white">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
            <nav className="flex h-11 min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {categoriesLoading ? (
                <span className="text-sm text-slate-400">
                  A carregar categorias...
                </span>
              ) : categories.length === 0 ? (
                <span className="text-sm text-slate-400">
                  Nenhuma categoria cadastrada
                </span>
              ) : (
                categories.map((category) => (
                  <span
                    key={category.id}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {category.name}
                  </span>
                ))
              )}
            </nav>
          </div>
        </div>

        <div className="h-1 bg-emerald-600" />
      </header>

      {/* =========================================================
          MOBILE
      ========================================================== */}

      <div
        className={
          headerVariant === "mobile"
            ? "block"
            : headerVariant === "desktop"
              ? "hidden"
              : "md:hidden"
        }
      >
        <div className="border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/themes/market"
              aria-label={storeName}
              className="flex min-w-0 items-center gap-2"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-sm font-black text-white">
                M
              </div>

              <span className="max-w-[140px] truncate whitespace-nowrap text-base font-black text-slate-900">
                {storeName}
              </span>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href={accountPath}
                className="rounded-full p-2 text-slate-700 transition hover:bg-slate-50"
                aria-label="Minha conta"
              >
                <User size={20} />
              </Link>

              <Link
                href={cartPath}
                className="relative rounded-full p-2 text-slate-700 transition hover:bg-slate-50"
                aria-label="Carrinho"
              >
                <ShoppingCart size={20} />

                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* PESQUISA MOBILE */}

          <div className="px-4 pb-3">
            <form onSubmit={handleSearch}>
              <div className="flex h-10 w-full items-center overflow-hidden rounded-xl border-2 border-emerald-600 bg-white">
                <div className="flex shrink-0 items-center pl-3 text-slate-400">
                  <Search size={16} />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    updateSearch(event.target.value)
                  }
                  placeholder="Pesquisar produtos..."
                  className="min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  className="h-full shrink-0 bg-emerald-600 px-4 text-xs font-bold text-white"
                >
                  Ir
                </button>
              </div>
            </form>
          </div>

          {/* CATEGORIAS MOBILE */}

          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap px-4 pb-2.5 scrollbar-hide">
            {categoriesLoading ? (
              <span className="shrink-0 text-xs text-slate-400">
                A carregar categorias...
              </span>
            ) : (
              categories.map((category) => (
                <span
                  key={category.id}
                  className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  {category.name}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
