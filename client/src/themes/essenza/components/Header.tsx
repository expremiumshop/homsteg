import { FormEvent, useState } from "react";

import {
  Search,
  ShoppingBag,
  User,
} from "lucide-react";

import { Link, useLocation } from "wouter";

import {
  essenzaPopularSearches,
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
  storeName = "Essenza",
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
   * página (como na Prime e na Market).
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

  const accountPath = `/themes/essenza/conta${storeContext}`;
  const cartPath = `/themes/essenza/carrinho${storeContext}`;
  const messagesPath = `/themes/essenza/mensagens${storeContext}`;

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
          "sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md",
          headerVariant === "mobile"
            ? "hidden"
            : headerVariant === "desktop"
              ? "block"
              : "hidden md:block",
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
          <div className="flex min-h-[76px] items-center gap-8">
            {/* LOGO SERIFADO */}

            <Link
              href="/themes/essenza"
              aria-label={storeName}
              className="flex h-11 w-[200px] shrink-0 items-center overflow-hidden"
            >
              <span
                className="truncate whitespace-nowrap text-2xl tracking-[0.08em] text-neutral-950"
                style={{
                  fontFamily:
                    "'Playfair Display', Georgia, serif",
                  fontWeight: 600,
                }}
              >
                {storeName}
              </span>
            </Link>

            {/* PESQUISA MINIMALISTA */}

            <div className="min-w-0 flex-1">
              <form onSubmit={handleSearch}>
                <div className="flex h-11 w-full items-center border-b border-neutral-300 transition focus-within:border-neutral-950">
                  <div className="flex shrink-0 items-center pl-1 text-neutral-400">
                    <Search size={17} />
                  </div>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      updateSearch(event.target.value)
                    }
                    placeholder="Pesquisar..."
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                  />
                </div>
              </form>

              <div className="mt-1.5 hidden items-center gap-3 text-[11px] text-neutral-400 lg:flex">
                <span className="shrink-0">
                  Pesquisas:
                </span>

                {essenzaPopularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => updateSearch(term)}
                    className="shrink-0 transition hover:text-neutral-900"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTA */}

            <Link
              href={accountPath}
              className="hidden shrink-0 items-center gap-2.5 px-2 py-2 transition hover:opacity-60 xl:flex"
              aria-label="Minha conta"
            >
              <User size={21} />
            </Link>

            {/* ATENDIMENTO */}

            <Link
              href={messagesPath}
              className="hidden shrink-0 items-center px-2 py-2 text-[11px] uppercase tracking-[0.14em] text-neutral-500 transition hover:text-neutral-950 lg:block"
            >
              Atendimento
            </Link>

            {/* CARRINHO */}

            <Link
              href={cartPath}
              className="relative flex shrink-0 items-center gap-2 px-2 py-2 transition hover:opacity-60"
              aria-label="Carrinho"
            >
              <ShoppingBag size={21} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-neutral-950 px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* =====================================================
            CATEGORIAS DESKTOP
        ====================================================== */}

        <div className="border-t border-neutral-100">
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
            <nav className="flex h-11 min-w-0 items-center justify-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {categoriesLoading ? (
                <span className="text-xs tracking-wide text-neutral-400">
                  A carregar categorias...
                </span>
              ) : categories.length === 0 ? (
                <span className="text-xs tracking-wide text-neutral-400">
                  Nenhuma categoria cadastrada
                </span>
              ) : (
                categories.map((category) => (
                  <span
                    key={category.id}
                    className="shrink-0 text-xs uppercase tracking-[0.14em] text-neutral-600 transition hover:text-neutral-950"
                  >
                    {category.name}
                  </span>
                ))
              )}
            </nav>
          </div>
        </div>
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
        <div className="border-b border-neutral-200 bg-white">
          <div className="flex items-center justify-between px-4 py-3.5">
            <Link
              href="/themes/essenza"
              aria-label={storeName}
              className="min-w-0"
            >
              <span
                className="max-w-[180px] truncate text-lg tracking-[0.08em] text-neutral-950"
                style={{
                  fontFamily:
                    "'Playfair Display', Georgia, serif",
                  fontWeight: 600,
                }}
              >
                {storeName}
              </span>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href={accountPath}
                className="p-2 text-neutral-900 transition hover:opacity-60"
                aria-label="Minha conta"
              >
                <User size={19} />
              </Link>

              <Link
                href={cartPath}
                className="relative p-2 text-neutral-900 transition hover:opacity-60"
                aria-label="Carrinho"
              >
                <ShoppingBag size={19} />

                {cartCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-950 px-1 text-[9px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* PESQUISA MOBILE */}

          <div className="px-4 pb-3">
            <form onSubmit={handleSearch}>
              <div className="flex h-10 w-full items-center border-b border-neutral-300">
                <div className="flex shrink-0 items-center pl-1 text-neutral-400">
                  <Search size={15} />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    updateSearch(event.target.value)
                  }
                  placeholder="Pesquisar..."
                  className="min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-neutral-400"
                />
              </div>
            </form>
          </div>

          {/* CATEGORIAS MOBILE */}

          <div className="flex items-center justify-center gap-6 overflow-x-auto whitespace-nowrap px-4 pb-3 scrollbar-hide">
            {categoriesLoading ? (
              <span className="shrink-0 text-[11px] tracking-wide text-neutral-400">
                A carregar...
              </span>
            ) : (
              categories.map((category) => (
                <span
                  key={category.id}
                  className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-neutral-600"
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
