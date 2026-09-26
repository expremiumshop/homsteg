import { ChevronDown, Menu, Search, ShoppingBag, User } from "lucide-react";

import { Link } from "wouter";

import { Logo } from "./Logo";

type HeaderProps = {
  storeName: string;
  onMenu: () => void;
  onSearch: () => void;
  storeSlug?: string;
  cartCount?: number;
};

export function Header({
  storeName,
  onMenu,
  onSearch,
  storeSlug,
  cartCount = 0,
}: HeaderProps) {
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between gap-5 px-5 md:px-8">
        <div className="hidden lg:block">
          <Logo storeName={storeName} />
        </div>

        <button
          type="button"
          onClick={onMenu}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5 text-neutral-900" />
        </button>

        <div className="lg:hidden">
          <Logo storeName={storeName} />
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          <button
            type="button"
            className="text-[12px] font-bold uppercase tracking-[0.12em] text-neutral-950"
          >
            Início
          </button>

          <button
            type="button"
            className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.12em] text-neutral-500 transition hover:text-neutral-950"
          >
            Loja
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            className="text-[12px] font-bold uppercase tracking-[0.12em] text-neutral-500 transition hover:text-neutral-950"
          >
            Novidades
          </button>

          <button
            type="button"
            className="text-[12px] font-bold uppercase tracking-[0.12em] text-neutral-500 transition hover:text-neutral-950"
          >
            Ofertas
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200"
            aria-label="Pesquisar"
          >
            <Search className="h-4.5 w-4.5 text-neutral-900" />
          </button>

          <Link
            href={`/themes/urban/conta${storeContext}`}
            className="hidden h-11 w-11 items-center justify-center rounded-full bg-neutral-100 sm:flex"
            aria-label="Conta"
          >
            <User className="h-4.5 w-4.5 text-neutral-900" />
          </Link>

          <Link
            href={`/themes/urban/carrinho${storeContext}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800"
            aria-label="Carrinho"
          >
            <ShoppingBag className="h-4.5 w-4.5" />

            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-black text-neutral-950">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
