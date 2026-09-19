"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  User,
  ShoppingCart,
  Menu,
  X,
  Search,
  ChevronDown,
  Package,
  Headphones,
  Gift,
  Zap,
  MapPin,
  Truck,
} from "lucide-react";

import { Link, useLocation } from "wouter";

export interface NovaHeaderCategory {
  id: string | number;
  name: string;
  slug: string;
  active?: boolean;
}

export interface NovaHeaderProps {
  storeName?: string;
  storeSlug?: string;
  categories?: NovaHeaderCategory[];
  categoriesLoading?: boolean;
  cartCount?: number;
  whatsappNumber?: string;
  basePath?: string;
  currency?: string;
  country?: string;
}

export function Header({
  storeName = "NOVA STORE",
  storeSlug,
  categories = [],
  categoriesLoading = false,
  cartCount = 0,
  whatsappNumber = "",
  basePath = "/themes/nova",
  currency = "MZN",
  country = "Moçambique",
}: NovaHeaderProps) {
  const [, navigate] = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [search, setSearch] = useState("");

  const [mobileNavFixed, setMobileNavFixed] =
    useState(false);

  useEffect(() => {
    function handleScroll() {
      setMobileNavFixed(window.scrollY > 60);
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    handleScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
  }, []);

  function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    navigate(
      `${basePath}/pesquisa?q=${encodeURIComponent(value)}`,
    );
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  const homePath = basePath;

  // Conta usa o mesmo caminho do BottomNavigation.
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  const accountPath = `${basePath}/conta${storeContext}`;

  // Atendimento abre a página de mensagens da Nova.
  const messagesPath = `${basePath}/mensagens${storeContext}`;

  const cartPath = `${basePath}/carrinho`;

  return (
    <>
      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          hidden
          bg-white/90
          backdrop-blur-md
          md:block
        "
      >
        {/* =====================================================
            TOP BAR
        ====================================================== */}

        <div className="bg-primary text-black">
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-5
              xl:px-8
            "
          >
            <div
              className="
                flex
                h-9
                items-center
                justify-between
                text-xs
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-5
                "
              >
                <span
                  className="
                    shrink-0
                    font-medium
                  "
                >
                  Bem-vindo à {storeName}
                </span>

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    text-black
                  "
                >
                  <Zap size={13} />
                  Super Ofertas
                </div>

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    text-black
                  "
                >
                  <Gift size={13} />
                  Cupons
                </div>
              </div>

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-5
                "
              >
                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-black
                  "
                >
                  <Package size={13} />
                  Meus pedidos
                </span>

                {/* ATENDIMENTO → MENSAGENS */}

                <Link
                  href={messagesPath}
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-black
                    transition-opacity
                    hover:opacity-70
                  "
                >
                  <Headphones size={13} />
                  Atendimento
                </Link>

                <div
                  className="
                    hidden
                    items-center
                    gap-1.5
                    text-black
                    lg:flex
                  "
                >
                  <MapPin size={13} />
                  <span>{country}</span>
                </div>

                <span className="text-black">
                  {currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN HEADER
        ====================================================== */}

        <div
          className="
            border-b
            border-white/20
            bg-transparent
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-5
              xl:px-8
            "
          >
            <div
              className="
                flex
                min-h-[78px]
                items-center
                gap-5
                xl:gap-7
              "
            >
              {/* LOGO / NOME DA LOJA */}

              <div
                aria-label={storeName}
                className="
                  flex
                  h-12
                  w-[205px]
                  shrink-0
                  items-center
                  overflow-hidden
                "
              >
                <span
                  className="
                    whitespace-nowrap
                    truncate
                    text-xl
                    font-bold
                  "
                >
                  {storeName}
                </span>
              </div>

              {/* PESQUISA */}

              <div className="min-w-0 flex-1">
                <form onSubmit={handleSearch}>
                  <div
                    className="
                      flex
                      h-11
                      w-full
                      overflow-hidden
                      rounded-full
                      border-2
                      border-primary
                      bg-transparent
                      backdrop-blur-sm
                    "
                  >
                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        pl-4
                        text-muted-foreground
                      "
                    >
                      <Search size={19} />
                    </div>

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Pesquisar produtos, marcas e muito mais..."
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        px-3
                        text-sm
                        text-foreground
                        outline-none
                        placeholder:text-muted-foreground
                      "
                    />

                    <button
                      type="submit"
                      className="
                        w-[105px]
                        shrink-0
                        rounded-full
                        bg-primary
                        px-5
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:opacity-90
                      "
                    >
                      Buscar
                    </button>
                  </div>
                </form>
              </div>

              {/* CONTA DESKTOP */}

              <Link
                href={accountPath}
                className="
                  flex
                  w-[175px]
                  shrink-0
                  items-center
                  gap-3
                  rounded-lg
                  px-2
                  py-2
                  transition-colors
                  hover:bg-secondary/60
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    bg-white/20
                  "
                >
                  <User size={20} />
                </div>

                <div
                  className="
                    min-w-0
                    flex-1
                    leading-tight
                  "
                >
                  <div
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    Olá!
                  </div>

                  <div
                    className="
                      truncate
                      text-sm
                      font-bold
                    "
                  >
                    Entrar / Registrar
                  </div>
                </div>

                <ChevronDown size={15} />
              </Link>

              {/* MEUS PEDIDOS — NÃO CLICÁVEL */}

              <div
                className="
                  hidden
                  w-[82px]
                  shrink-0
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-lg
                  py-2
                  opacity-70
                  xl:flex
                "
              >
                <Package size={21} />

                <span
                  className="
                    whitespace-nowrap
                    text-[11px]
                    font-semibold
                  "
                >
                  Meus pedidos
                </span>
              </div>

              {/* RASTREIO — NÃO CLICÁVEL */}

              <div
                className="
                  hidden
                  w-[72px]
                  shrink-0
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-lg
                  py-2
                  opacity-70
                  xl:flex
                "
              >
                <Truck size={21} />

                <span
                  className="
                    text-[11px]
                    font-semibold
                  "
                >
                  Rastreio
                </span>
              </div>

              {/* CARRINHO */}

              <Link
                href={cartPath}
                className="
                  relative
                  flex
                  w-[72px]
                  shrink-0
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-lg
                  py-2
                  transition
                  hover:bg-secondary/60
                "
              >
                <div className="relative">
                  <ShoppingCart size={27} />

                  {cartCount > 0 && (
                    <span
                      className="
                        absolute
                        -right-2
                        -top-2
                        flex
                        h-5
                        min-w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-primary
                        px-1
                        text-[10px]
                        font-bold
                        text-white
                      "
                    >
                      {cartCount}
                    </span>
                  )}
                </div>

                <span
                  className="
                    text-[11px]
                    font-semibold
                  "
                >
                  Carrinho
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================
            CATEGORIAS DESKTOP — NÃO CLICÁVEIS
        ====================================================== */}

        <div
          className="
            border-b
            border-white/20
            bg-transparent
            backdrop-blur-sm
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-5
              xl:px-8
            "
          >
            <div
              className="
                flex
                h-[52px]
                items-center
                gap-5
              "
            >
              <div
                className="
                  flex
                  h-9
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  bg-primary
                  px-5
                  text-sm
                  font-bold
                  text-white
                "
              >
                <Menu size={18} />
                <span>Todas as categorias</span>
                <ChevronDown size={15} />
              </div>

              <nav
                className="
                  flex
                  min-w-0
                  flex-1
                  items-center
                  gap-5
                  overflow-x-auto
                  whitespace-nowrap
                  scrollbar-hide
                "
              >
                {categoriesLoading ? (
                  <span
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Carregando categorias...
                  </span>
                ) : categories.length === 0 ? (
                  <span
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Nenhuma categoria cadastrada
                  </span>
                ) : (
                  categories
                    .filter(
                      (category) =>
                        category.active !== false,
                    )
                    .map((category) => (
                      <span
                        key={category.id}
                        className="
                          shrink-0
                          rounded-full
                          px-3
                          py-1.5
                          text-sm
                          font-semibold
                        "
                      >
                        {category.name}
                      </span>
                    ))
                )}
              </nav>

              <div
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-2
                  text-xs
                  text-muted-foreground
                  2xl:flex
                "
              >
                <MapPin size={16} />

                <span>
                  Entregamos em {country}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BENEFÍCIOS — NÃO CLICÁVEIS
        ====================================================== */}

        <div
          className="
            border-b
            border-white/20
            bg-transparent
            backdrop-blur-sm
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-5
              xl:px-8
            "
          >
            <div
              className="
                flex
                h-9
                items-center
                justify-center
                gap-8
                text-[11px]
                font-medium
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                "
              >
                <Gift
                  size={14}
                  className="text-primary"
                />
                Cupons exclusivos
              </div>

              <div className="h-4 w-px bg-border" />

              <div
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                "
              >
                <Package
                  size={14}
                  className="text-primary"
                />
                Rastreamento disponível
              </div>

              <div className="h-4 w-px bg-border" />

              <div
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                "
              >
                <Zap
                  size={14}
                  className="text-primary"
                />
                Ofertas todos os dias
              </div>

              <div className="h-4 w-px bg-border" />

              <div
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                "
              >
                <Headphones
                  size={14}
                  className="text-primary"
                />
                Suporte ao cliente
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 bg-primary" />
      </header>

      {/* =========================================================
          MOBILE
      ========================================================== */}

      <div className="md:hidden">
        {/* TOPO MOBILE */}

        <div
          className="
            bg-white/90
            backdrop-blur-md
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              px-4
              py-3
            "
          >
            {/* MENU */}

            <button
              type="button"
              onClick={() =>
                setIsMobileMenuOpen(
                  (previous) => !previous,
                )
              }
              className="
                rounded-full
                p-2
                hover:bg-secondary
              "
              aria-label={
                isMobileMenuOpen
                  ? "Fechar menu"
                  : "Abrir menu"
              }
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

            {/* NOME DA LOJA */}

            <div
              aria-label={storeName}
              className="
                flex
                h-8
                w-[150px]
                items-center
                justify-center
                overflow-hidden
              "
            >
              <span
                className="
                  max-w-full
                  truncate
                  whitespace-nowrap
                  text-sm
                  font-bold
                "
              >
                {storeName}
              </span>
            </div>

            {/* AÇÕES */}

            <div
              className="
                flex
                items-center
                gap-1
              "
            >
              {/* CONTA → /themes/nova/conta */}

              <Link
                href={accountPath}
                className="
                  rounded-full
                  p-2
                  hover:bg-secondary
                "
                aria-label="Minha conta"
              >
                <User size={20} />
              </Link>

              {/* CARRINHO */}

              <Link
                href={cartPath}
                className="
                  relative
                  rounded-full
                  p-2
                  hover:bg-secondary
                "
                aria-label="Carrinho"
              >
                <ShoppingCart size={20} />

                {cartCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-primary
                      px-1
                      text-[9px]
                      font-bold
                      text-white
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* ESPAÇO QUANDO NAVEGAÇÃO ESTÁ FIXA */}

        {mobileNavFixed && (
          <div className="h-[88px]" />
        )}

        {/* PESQUISA MOBILE */}

        <div
          className={
            mobileNavFixed
              ? `
                fixed
                left-0
                right-0
                top-0
                z-[100]
                overflow-hidden
                bg-white/80
                shadow-md
                backdrop-blur-md
              `
              : `
                relative
                overflow-hidden
                bg-transparent
              `
          }
        >
          <div
            className="
              bg-transparent
              px-4
              pt-2
              pb-1
            "
          >
            <form onSubmit={handleSearch}>
              <div
                className="
                  flex
                  h-10
                  w-full
                  overflow-hidden
                  rounded-full
                  border-2
                  border-primary
                  bg-transparent
                  backdrop-blur-sm
                "
              >
                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                    pl-4
                    text-muted-foreground
                  "
                >
                  <Search size={17} />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Pesquisar produtos..."
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    px-3
                    text-sm
                    outline-none
                    placeholder:text-muted-foreground
                  "
                />

                <button
                  type="submit"
                  className="
                    shrink-0
                    rounded-full
                    bg-primary
                    px-5
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* CATEGORIAS MOBILE — NÃO CLICÁVEIS */}

          <div
            className="
              bg-transparent
              backdrop-blur-sm
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                overflow-x-auto
                px-4
                py-2
                whitespace-nowrap
                scrollbar-hide
              "
            >
              {categoriesLoading ? (
                <span
                  className="
                    shrink-0
                    text-sm
                    text-muted-foreground
                  "
                >
                  Carregando categorias...
                </span>
              ) : categories.length === 0 ? (
                <span
                  className="
                    shrink-0
                    text-sm
                    text-muted-foreground
                  "
                >
                  Nenhuma categoria cadastrada
                </span>
              ) : (
                categories
                  .filter(
                    (category) =>
                      category.active !== false,
                  )
                  .map((category) => (
                    <span
                      key={category.id}
                      className="
                        shrink-0
                        rounded-full
                        px-3
                        py-1.5
                        text-sm
                        font-semibold
                      "
                    >
                      {category.name}
                    </span>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* MENU MOBILE */}

        {isMobileMenuOpen && (
          <nav
            className="
              relative
              z-[110]
              border-t
              border-border
              bg-white
            "
          >
            {/* HOME — NÃO CLICÁVEL */}

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
              "
            >
              <Menu size={19} />
              Home
            </div>

            {/* SUPER OFERTAS — NÃO CLICÁVEL */}

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
              "
            >
              <Zap size={19} />
              Super Ofertas
            </div>

            {/* CUPONS — NÃO CLICÁVEL */}

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                text-muted-foreground
              "
            >
              <Gift size={19} />
              Cupons
            </div>

            {/* MEUS PEDIDOS — NÃO CLICÁVEL */}

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
              "
            >
              <Package size={19} />
              Meus pedidos
            </div>

            {/* RASTREIO — NÃO CLICÁVEL */}

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
              "
            >
              <Truck size={19} />
              Rastreio
            </div>

            {/* ATENDIMENTO → MENSAGENS */}

            <Link
              href={messagesPath}
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                text-muted-foreground
                transition
                hover:bg-secondary/60
              "
            >
              <Headphones size={20} />
              Atendimento
            </Link>

            {/* MINHA CONTA → /themes/nova/conta */}

            <Link
              href={accountPath}
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                gap-3
                border-t
                border-border
                px-4
                py-3
                transition
                hover:bg-secondary/60
              "
            >
              <User size={20} />
              Minha conta
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}

export default Header;
