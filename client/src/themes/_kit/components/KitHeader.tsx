import { useEffect, useState, type FormEvent } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  MessageCircle,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { storeQuery } from "../lib";
import type { ThemeConfig } from "../themeConfig";

export interface KitHeaderCategory {
  id: string | number;
  name: string;
  slug: string;
  active?: boolean;
}

export interface KitHeaderProps {
  theme: ThemeConfig;
  storeName?: string;
  storeSlug?: string;
  categories?: KitHeaderCategory[];
  categoriesLoading?: boolean;
  cartCount?: number;
  basePath?: string;
  /** força a variante (desktop/mobile) nas pré-visualizações */
  variant?: "auto" | "desktop" | "mobile";
}

/**
 * ============================================================
 * HEADER DA _kit
 * ============================================================
 *
 * Mesma estrutura funcional da Nova (desktop 3 faixas + mobile
 * com menu hambúrguer), visual 100% tokenizado.
 */
export function KitHeader({
  theme: _theme,
  storeName = "LOJA",
  storeSlug,
  categories = [],
  categoriesLoading = false,
  cartCount = 0,
  basePath = "/store",
  variant = "auto",
}: KitHeaderProps) {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const value = search.trim();
    if (!value) return;
    navigate(`${basePath}/pesquisa?q=${encodeURIComponent(value)}`);
  }

  const ctx = storeQuery(storeSlug);
  const cartPath = `${basePath}/carrinho${ctx}`;
  const messagesPath = `${basePath}/mensagens${ctx}`;
  const accountPath = `${basePath}/conta${ctx}`;

  const desktopVisible =
    variant === "mobile" ? false : variant === "desktop" ? true : undefined;

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <header
        className={[
          "sticky top-0 z-50 border-b backdrop-blur-md",
          desktopVisible === false
            ? "hidden"
            : desktopVisible === true
              ? "block"
              : "hidden md:block",
        ].join(" ")}
        style={{
          background: "var(--tk-header-bg)",
          borderColor: "var(--tk-border)",
          color: "var(--tk-header-text)",
        }}
      >
        {/* faixa superior */}
        <div
          className="text-xs"
          style={{ background: "var(--tk-primary)", color: "var(--tk-primary-contrast)" }}
        >
          <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-5">
            <span className="min-w-0 truncate font-medium">
              Bem-vindo à {storeName}
            </span>
            <div className="flex shrink-0 items-center gap-4">
              <Link href={messagesPath} className="transition-opacity hover:opacity-70">
                Atendimento
              </Link>
              <Link href={accountPath} className="transition-opacity hover:opacity-70">
                Minha conta
              </Link>
            </div>
          </div>
        </div>

        {/* faixa principal */}
        <div className="mx-auto flex max-w-[1440px] items-center gap-5 px-5 py-3">
          <Link href={basePath} className="shrink-0">
            <span className="whitespace-nowrap text-xl font-bold">{storeName}</span>
          </Link>

          <form onSubmit={handleSearch} className="min-w-0 flex-1">
            <div
              className="flex h-11 w-full items-center overflow-hidden border-2"
              style={{
                borderColor: "var(--tk-primary)",
                borderRadius: "999px",
                background: "var(--tk-surface)",
              }}
            >
              <div className="pl-4 text-[var(--tk-muted)]">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar produtos..."
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[var(--tk-muted)]"
              />
              <button
                type="submit"
                className="h-full shrink-0 px-6 text-sm font-bold"
                style={{
                  background: "var(--tk-primary)",
                  color: "var(--tk-primary-contrast)",
                }}
              >
                Buscar
              </button>
            </div>
          </form>

          <Link
            href={accountPath}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
            style={{ borderColor: "var(--tk-border)" }}
            aria-label="Minha conta"
          >
            <User size={19} />
          </Link>

          <Link
            href={cartPath}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
            style={{ borderColor: "var(--tk-border)" }}
            aria-label="Carrinho"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span
                className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                style={{
                  background: "var(--tk-primary)",
                  color: "var(--tk-primary-contrast)",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* faixa de categorias */}
        <div className="border-t" style={{ borderColor: "var(--tk-border)" }}>
          <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-2">
            <div
              className="flex h-8 shrink-0 items-center gap-2 px-4 text-sm font-bold"
              style={{
                background: "var(--tk-primary)",
                color: "var(--tk-primary-contrast)",
                borderRadius: "var(--tk-radius)",
              }}
            >
              <Menu size={16} />
              Categorias
            </div>
            <nav className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap">
              {categoriesLoading ? (
                <span className="text-sm text-[var(--tk-muted)]">
                  Carregando categorias...
                </span>
              ) : categories.length === 0 ? (
                <span className="text-sm text-[var(--tk-muted)]">
                  Nenhuma categoria cadastrada
                </span>
              ) : (
                categories
                  .filter((c) => c.active !== false)
                  .map((c) => (
                    <span
                      key={c.id}
                      className="shrink-0 px-2 py-1 text-sm font-semibold"
                    >
                      {c.name}
                    </span>
                  ))
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* ================= MOBILE ================= */}
      <div
        className={
          variant === "mobile"
            ? "block"
            : variant === "desktop"
              ? "hidden"
              : "md:hidden"
        }
        style={{ background: "var(--tk-header-bg)", color: "var(--tk-header-text)" }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href={basePath}>
            <span className="max-w-[160px] truncate text-base font-bold">
              {storeName}
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link href={accountPath} className="rounded-full p-2" aria-label="Minha conta">
              <User size={20} />
            </Link>
            <Link href={cartPath} className="relative rounded-full p-2" aria-label="Carrinho">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
                  style={{
                    background: "var(--tk-primary)",
                    color: "var(--tk-primary-contrast)",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* pesquisa mobile */}
        <div
          className={
            scrolled && variant !== "mobile"
              ? "fixed left-0 right-0 top-0 z-[100] shadow-md"
              : "relative"
          }
          style={{ background: "var(--tk-header-bg)" }}
        >
          <div className="px-4 pb-2 pt-1">
            <form onSubmit={handleSearch}>
              <div
                className="flex h-10 w-full items-center overflow-hidden border-2"
                style={{
                  borderColor: "var(--tk-primary)",
                  borderRadius: "999px",
                  background: "var(--tk-surface)",
                }}
              >
                <div className="pl-3 text-[var(--tk-muted)]">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar produtos..."
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-[var(--tk-muted)]"
                />
                <button
                  type="submit"
                  className="h-full shrink-0 px-4 text-xs font-bold"
                  style={{
                    background: "var(--tk-primary)",
                    color: "var(--tk-primary-contrast)",
                  }}
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* categorias mobile */}
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap px-4 pb-2">
            {categoriesLoading ? (
              <span className="text-sm text-[var(--tk-muted)]">Carregando...</span>
            ) : (
              categories
                .filter((c) => c.active !== false)
                .map((c) => (
                  <span
                    key={c.id}
                    className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: "color-mix(in srgb, var(--tk-primary) 10%, transparent)" }}
                  >
                    {c.name}
                  </span>
                ))
            )}
          </div>
        </div>

        {/* menu mobile */}
        {menuOpen && (
          <nav className="relative z-[110] border-t" style={{ borderColor: "var(--tk-border)" }}>
            <Link
              href={messagesPath}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold"
            >
              <MessageCircle size={19} />
              Atendimento
            </Link>
            <Link
              href={accountPath}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 border-t px-4 py-3 text-sm font-semibold"
              style={{ borderColor: "var(--tk-border)" }}
            >
              <User size={19} />
              Minha conta
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}

export default KitHeader;
