import { FormEvent, useEffect, useState } from "react";

import { Menu, Search, ShoppingBag, User } from "lucide-react";

import { Link, useLocation } from "wouter";

import {
  calizaColors,
  calizaHeadingFont,
  calizaBodyFont,
} from "../theme";

import { storeQuery } from "../demoData";

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
  onMenu?: () => void;

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
  storeName = "Caliza Studio",
  categories = [],
  categoriesLoading = false,
  cartCount = 0,
  storeSlug,
  search: searchProp,
  onSearch,
  onMenu,
  headerVariant = "auto",
}: HeaderProps) {
  const [, navigate] = useLocation();

  const [internalSearch, setInternalSearch] =
    useState("");

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true },
    );

    onScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll,
      );
  }, []);

  /*
   * Quando o Storefront fornece onSearch, a
   * pesquisa filtra os produtos na própria
   * página (como na Essenza e na Urban).
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

  const ctx = storeQuery(storeSlug);

  const accountPath = `/themes/caliza/conta${ctx}`;
  const cartPath = `/themes/caliza/carrinho${ctx}`;

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
        ?.scrollIntoView({
          behavior: "smooth",
        });

      return;
    }

    navigate(
      `/themes/caliza?search=${encodeURIComponent(value)}`,
    );
  }

  const desktopVisible =
    headerVariant === "mobile"
      ? false
      : headerVariant === "desktop"
        ? true
        : undefined;

  return (
    <>
      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <header
        className={[
          "sticky top-0 z-50 border-b backdrop-blur-md transition-shadow",
          desktopVisible === false
            ? "hidden"
            : desktopVisible === true
              ? "block"
              : "hidden md:block",
        ].join(" ")}
        style={{
          background: "rgba(245, 241, 234, 0.95)",
          borderColor: calizaColors.border,
          color: calizaColors.text,
          fontFamily: calizaBodyFont,
          boxShadow: scrolled
            ? "0 1px 0 0 rgba(41, 37, 36, 0.08)"
            : undefined,
        }}
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
          <div className="flex min-h-[74px] items-center gap-8">
            {/* LOGO SERIFADO */}

            <Link
              href="/themes/caliza"
              aria-label={storeName}
              className="flex h-11 w-[200px] shrink-0 items-center overflow-hidden"
            >
              <span
                className="truncate whitespace-nowrap text-2xl text-neutral-900"
                style={{
                  fontFamily: calizaHeadingFont,
                  fontWeight: 600,
                }}
              >
                {storeName}
              </span>
            </Link>

            {/* PESQUISA */}

            <div className="min-w-0 flex-1">
              <form onSubmit={handleSearch}>
                <div
                  className="flex h-11 w-full items-center rounded-full border bg-white/70 pl-4 pr-1 transition"
                  style={{
                    borderColor: calizaColors.border,
                  }}
                >
                  <div
                    className="flex shrink-0 items-center pr-2"
                    style={{
                      color: calizaColors.textMuted,
                    }}
                  >
                    <Search size={17} />
                  </div>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      updateSearch(
                        event.target.value,
                      )
                    }
                    placeholder="Pesquisar peças..."
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    style={{
                      color: calizaColors.text,
                    }}
                  />

                  <button
                    type="submit"
                    className="h-9 shrink-0 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.12em] transition hover:opacity-90"
                    style={{
                      background:
                        calizaColors.primary,
                      color:
                        calizaColors.primaryContrast,
                    }}
                  >
                    Buscar
                  </button>
                </div>
              </form>
            </div>

            {/* CONTA */}

            <Link
              href={accountPath}
              className="hidden shrink-0 items-center gap-2.5 px-2 py-2 transition hover:opacity-60 xl:flex"
              aria-label="Minha conta"
            >
              <User size={21} />
            </Link>

            {/* CARRINHO */}

            <Link
              href={cartPath}
              className="relative flex shrink-0 items-center gap-2 px-2 py-2 transition hover:opacity-60"
              aria-label="Carrinho"
            >
              <ShoppingBag size={21} />

              {cartCount > 0 && (
                <span
                  className="absolute -right-1 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold"
                  style={{
                    background:
                      calizaColors.primary,
                    color:
                      calizaColors.primaryContrast,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* =====================================================
            CATEGORIAS DESKTOP
        ====================================================== */}

        <div
          className="border-t"
          style={{
            borderColor: calizaColors.border,
          }}
        >
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
            <nav className="flex h-11 min-w-0 items-center justify-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {categoriesLoading ? (
                <span
                  className="text-xs tracking-wide"
                  style={{
                    color: calizaColors.textMuted,
                  }}
                >
                  A carregar categorias...
                </span>
              ) : categories.length === 0 ? (
                <span
                  className="text-xs tracking-wide"
                  style={{
                    color: calizaColors.textMuted,
                  }}
                >
                  Nenhuma categoria cadastrada
                </span>
              ) : (
                categories.map((category) => (
                  <span
                    key={category.id}
                    className="shrink-0 text-xs uppercase tracking-[0.14em] transition hover:opacity-60"
                    style={{
                      color: calizaColors.text,
                    }}
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
        style={{
          background: calizaColors.bg,
          color: calizaColors.text,
          fontFamily: calizaBodyFont,
        }}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-3.5"
          style={{
            borderColor: calizaColors.border,
          }}
        >
          <button
            type="button"
            onClick={onMenu}
            className="rounded-full p-2 transition hover:opacity-60"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          <Link
            href="/themes/caliza"
            aria-label={storeName}
            className="min-w-0"
          >
            <span
              className="max-w-[180px] truncate text-lg"
              style={{
                fontFamily: calizaHeadingFont,
                fontWeight: 600,
              }}
            >
              {storeName}
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href={accountPath}
              className="p-2 transition hover:opacity-60"
              aria-label="Minha conta"
            >
              <User size={19} />
            </Link>

            <Link
              href={cartPath}
              className="relative p-2 transition hover:opacity-60"
              aria-label="Carrinho"
            >
              <ShoppingBag size={19} />

              {cartCount > 0 && (
                <span
                  className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold"
                  style={{
                    background:
                      calizaColors.primary,
                    color:
                      calizaColors.primaryContrast,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* PESQUISA MOBILE */}

        <div className="px-4 py-3">
          <form onSubmit={handleSearch}>
            <div
              className="flex h-10 w-full items-center rounded-full border bg-white/70 pl-4 pr-1"
              style={{
                borderColor: calizaColors.border,
              }}
            >
              <div
                className="flex shrink-0 items-center pr-2"
                style={{
                  color: calizaColors.textMuted,
                }}
              >
                <Search size={15} />
              </div>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  updateSearch(
                    event.target.value,
                  )
                }
                placeholder="Pesquisar peças..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                style={{
                  color: calizaColors.text,
                }}
              />

              <button
                type="submit"
                className="h-8 shrink-0 rounded-full px-4 text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  background:
                    calizaColors.primary,
                  color:
                    calizaColors.primaryContrast,
                }}
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* CATEGORIAS MOBILE */}

        <div
          className="flex items-center justify-start gap-6 overflow-x-auto whitespace-nowrap px-4 pb-3 scrollbar-hide"
          style={{
            color: calizaColors.textMuted,
          }}
        >
          {categoriesLoading ? (
            <span className="shrink-0 text-[11px] tracking-wide">
              A carregar...
            </span>
          ) : (
            categories.map((category) => (
              <span
                key={category.id}
                className="shrink-0 text-[11px] uppercase tracking-[0.14em]"
                style={{
                  color: calizaColors.text,
                }}
              >
                {category.name}
              </span>
            ))
          )}
        </div>
      </div>

    </>
  );
}

export default Header;
