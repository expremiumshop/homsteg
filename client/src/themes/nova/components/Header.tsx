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
  Heart,
  Package,
  Headphones,
  Gift,
  Zap,
  MapPin,
  Truck,
} from "lucide-react";

import { Link, useLocation } from "wouter";

import { useI18n } from "@/lib/i18n-context";

import {
  normalizeHeaderModel,
  type HeaderModel,
} from "../headerModels";

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

  /*
   * URL assinada do logo REAL da loja.
   * null/undefined → usa o nome da loja
   * (comportamento demo atual).
   */
  logoUrl?: string | null;

  /**
   * Força a variante do cabeçalho, ignorando o
   * viewport. Usado nas pré-visualizações por
   * dispositivo, onde o media query do viewport
   * não corresponde à largura da caixa de preview.
   * "auto" (padrão) mantém o comportamento atual.
   */
  headerVariant?: "auto" | "desktop" | "mobile";

  /**
   * Modelo do cabeçalho escolhido na Personalização da
   * loja (Market → store_market_features). "1" = estilo
   * atual da loja, inalterado.
   */
  headerModel?: string | null;
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
  headerVariant = "auto",
  logoUrl = null,
  headerModel,
}: NovaHeaderProps) {
  const { t } = useI18n();

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

    const params = new URLSearchParams({ q: value });
    if (storeSlug) params.set("storeSlug", storeSlug);
    navigate(`${basePath}/pesquisa?${params.toString()}`);
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

  const cartPath = `${basePath}/carrinho${storeContext}`;

  const model: HeaderModel =
    normalizeHeaderModel(headerModel);

  if (
    model === "4" ||
    model === "5" ||
    model === "6" ||
    model === "7" ||
    model === "8" ||
    model === "9" ||
    model === "10"
  ) {
    return (
      <AddedHeader
        model={model}
        storeName={storeName}
        logoUrl={logoUrl}
        headerVariant={headerVariant}
        categories={categories}
        basePath={basePath}
        storeSlug={storeSlug}
        accountPath={accountPath}
        cartPath={cartPath}
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
      />
    );
  }

  /*
   * MODELO 3 — ESCURO: barra escura com marca e
   * pesquisa centradas.
   */
  if (model === "3") {
    return (
      <header
        className={[
          "sticky top-0 z-50 bg-[#111713]",
          headerVariant === "mobile"
            ? "hidden"
            : headerVariant === "desktop"
              ? "block"
              : "hidden md:block",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-2 px-5 py-3 xl:px-8">
          <Link
            href={homePath}
            className="text-base font-black uppercase tracking-[0.3em] text-white"
          >
            {storeName}
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-lg items-center gap-2 rounded-full bg-white/10 px-4 py-1.5"
          >
            <Search size={15} className="text-gray-300" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={t("search.placeholder")}
              className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-gray-300"
            />
          </form>

          <div className="flex items-center gap-4 text-[11px] text-gray-300">
            <Link
              href={accountPath}
              className="flex items-center gap-1 transition hover:text-white"
            >
              <User size={13} />
              {t("nav.account")}
            </Link>

            <Link
              href={cartPath}
              className="flex items-center gap-1 transition hover:text-white"
            >
              <ShoppingCart size={13} />
              {t("nav.cart")}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  /*
   * MODELO 2 — MINIMAL: barra única com logo à
   * esquerda e pesquisa/ações à direita.
   */
  if (model === "2") {
    return (
      <header
        className={[
          "sticky top-0 z-50 border-b border-gray-200 bg-white",
          headerVariant === "mobile"
            ? "hidden"
            : headerVariant === "desktop"
              ? "block"
              : "hidden md:block",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 py-3 xl:px-8">
          <Link
            href={homePath}
            className="flex items-center gap-2"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName}
                className="max-h-9 max-w-[160px] w-auto object-contain"
              />
            ) : (
              <span className="text-base font-bold tracking-tight text-slate-950">
                {storeName}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2">
            <form
              onSubmit={handleSearch}
              className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 sm:flex"
            >
              <Search size={14} className="text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={t("search.short")}
                className="w-32 bg-transparent text-xs text-slate-950 outline-none placeholder:text-gray-400"
              />
            </form>

            <Link
              href={accountPath}
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
              aria-label={t("header.account")}
            >
              <User size={18} />
            </Link>

            <Link
              href={cartPath}
              className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
              aria-label={t("nav.cart")}
            >
              <ShoppingCart size={18} />

              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  /*
   * MODELO 1 — CLÁSSICO: header atual da loja,
   * intacto (abaixo).
   */
  return (
    <>
      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <header
        className={[
          "@container sticky top-0 z-50 bg-white/90 backdrop-blur-md",
          headerVariant === "mobile"
            ? "hidden"
            : headerVariant === "desktop"
              ? "block"
              : "hidden md:block",
        ].join(" ")}
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
              @min-[1280px]:px-8
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
                  {t("header.welcome", { store: storeName })}
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
                  {t("header.superDeals")}
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
                  {t("header.coupons")}
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
                  {t("header.myOrders")}
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
                  {t("header.support")}
                </Link>

                <div
                  className="
                    hidden
                    items-center
                    gap-1.5
                    text-black
                    @min-[1024px]:flex
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
              @min-[1280px]:px-8
            "
          >
            <div
              className="
                flex
                min-h-[78px]
                items-center
                gap-5
                @min-[1280px]:gap-7
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
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={storeName}
                    className="
                      max-h-12
                      max-w-[205px]
                      w-auto
                      object-contain
                      object-left
                    "
                  />
                ) : (
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
                )}
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
                      placeholder={t("header.searchWide")}
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
                      {t("header.search")}
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
                    {t("header.hello")}
                  </div>

                  <div
                    className="
                      truncate
                      text-sm
                      font-bold
                    "
                  >
                    {t("header.signInRegister")}
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
                  @min-[1280px]:flex
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
                  {t("header.myOrders")}
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
                  @min-[1280px]:flex
                "
              >
                <Truck size={21} />

                <span
                  className="
                    text-[11px]
                    font-semibold
                  "
                >
                  {t("header.tracking")}
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
                  {t("nav.cart")}
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
              @min-[1280px]:px-8
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
                <span>{t("header.allCategories")}</span>
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
                    {t("header.loadingCategories")}
                  </span>
                ) : categories.length === 0 ? (
                  <span
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    {t("header.noCategories")}
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
                  @min-[1536px]:flex
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
              @min-[1280px]:px-8
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
                {t("header.couponExclusive")}
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
                {t("header.trackingAvailable")}
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
                {t("header.dailyDeals")}
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
                {t("header.customerSupport")}
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 bg-primary" />
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
                  ? t("header.closeMenu")
                  : t("header.openMenu")
              }
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

            {/* LOGO / NOME DA LOJA */}

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
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="
                    max-h-8
                    max-w-[150px]
                    w-auto
                    object-contain
                  "
                />
              ) : (
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
              )}
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
                aria-label={t("header.account")}
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
                aria-label={t("nav.cart")}
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

        {mobileNavFixed &&
          headerVariant !== "mobile" && (
            <div className="h-[88px]" />
          )}

        {/* PESQUISA MOBILE */}

        <div
          className={
            mobileNavFixed &&
            headerVariant !== "mobile"
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
                  placeholder={t("search.products")}
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
                  {t("header.search")}
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
                  {t("header.loadingCategories")}
                </span>
              ) : categories.length === 0 ? (
                <span
                  className="
                    shrink-0
                    text-sm
                    text-muted-foreground
                  "
                >
                  {t("header.noCategories")}
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
              {t("nav.home")}
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
              {t("header.superDeals")}
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
              {t("header.coupons")}
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
              {t("header.myOrders")}
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
              {t("header.tracking")}
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
              {t("header.support")}
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
              {t("header.account")}
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}

function AddedHeader({
  model,
  storeName,
  logoUrl,
  headerVariant,
  categories,
  basePath,
  storeSlug,
  accountPath,
  cartPath,
  search,
  setSearch,
  onSearch,
}: {
  model: Exclude<HeaderModel, "1" | "2" | "3">;
  storeName: string;
  logoUrl: string | null;
  headerVariant: "auto" | "desktop" | "mobile";
  categories: NovaHeaderCategory[];
  basePath: string;
  storeSlug?: string;
  accountPath: string;
  cartPath: string;
  search: string;
  setSearch: (value: string) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const rootClass = [
    "sticky top-0 z-50",
    headerVariant === "mobile"
      ? "hidden"
      : headerVariant === "desktop"
        ? "block"
        : "hidden md:block",
  ].join(" ");
  const searchBox = (
    <form
      onSubmit={onSearch}
      className="flex min-w-0 items-center gap-2 rounded-full bg-black/5 px-3 py-2"
    >
      <Search size={15} className="shrink-0 opacity-60" />
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Pesquisar produtos"
        className="min-w-0 flex-1 bg-transparent text-xs outline-none"
      />
    </form>
  );
  const logo = logoUrl ? (
    <img src={logoUrl} alt={storeName} className="max-h-9 max-w-40 object-contain" />
  ) : (
    <span className="font-black tracking-wide">{storeName}</span>
  );
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";
  const actions = (
    <div className="flex shrink-0 items-center gap-3">
      <Link href={accountPath} aria-label="Conta"><User size={17} /></Link>
      <Link href={cartPath} aria-label="Carrinho"><ShoppingCart size={17} /></Link>
    </div>
  );

  if (model === "4") {
    return (
      <header className={`${rootClass} border-b border-orange-200 bg-white`}>
        <div className="bg-orange-500 py-1 text-center text-[10px] font-bold uppercase tracking-widest text-white">Entrega grátis em compras selecionadas</div>
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
          {logo}<div className="flex-1">{searchBox}</div>{actions}
        </div>
      </header>
    );
  }

  if (model === "5") {
    return (
      <header className={`${rootClass} border-b border-stone-200 bg-[#faf8f4]`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 text-stone-800">
          <span className="font-serif text-lg">{logo}</span>
          <div className="max-w-md flex-1">{searchBox}</div>
          <div className="flex gap-4">{actions}</div>
        </div>
      </header>
    );
  }

  if (model === "6") {
    return (
      <header className={`${rootClass} border-b border-slate-200 bg-white`}>
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
          <Menu size={19} />{logo}<div className="max-w-md flex-1">{searchBox}</div>{actions}
        </div>
        <nav className="mx-auto flex max-w-7xl gap-5 overflow-hidden px-5 pb-2 text-xs text-slate-600">
          {categories.slice(0, 6).map((category) => (
            <Link key={category.id} href={`${basePath}/categoria/${encodeURIComponent(category.slug)}${storeContext}`} className="whitespace-nowrap hover:text-primary">{category.name}</Link>
          ))}
        </nav>
      </header>
    );
  }

  if (model === "7") {
    return (
      <header className={`${rootClass} border-b border-slate-200 bg-white`}>
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-5 py-4">
          <div className="flex gap-4 text-slate-500"><Search size={17} /><Heart size={17} /></div>
          <Link href={storeSlug ? `/store/${encodeURIComponent(storeSlug)}` : basePath} className="justify-self-center text-sm font-black tracking-[0.2em]">{logo}</Link>
          <div className="justify-self-end">{actions}</div>
        </div>
      </header>
    );
  }

  if (model === "8") {
    return (
      <header className={`${rootClass} bg-emerald-800 text-white`}>
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
          <div className="min-w-0 flex-1"><span className="text-[9px] uppercase tracking-widest text-emerald-200">Mercado local</span><div className="text-sm">{logo}</div></div>
          <div className="max-w-md flex-1 text-slate-900">{searchBox}</div>{actions}
        </div>
      </header>
    );
  }

  if (model === "9") {
    return (
      <header className={`${rootClass} border-b border-indigo-100 bg-indigo-50`}>
        <div className="mx-auto max-w-7xl px-5 py-3">
          <div className="mb-2 flex items-center justify-between text-indigo-950">{logo}{actions}</div>
          <div className="rounded-2xl bg-white shadow-sm">{searchBox}</div>
        </div>
      </header>
    );
  }

  return (
    <header className={`${rootClass} border-b border-slate-200 bg-white`}>
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-3">
        {logo}
        <nav className="flex flex-1 justify-center gap-5 text-xs text-slate-600">
          <Link href={storeSlug ? `/store/${encodeURIComponent(storeSlug)}` : basePath}>Início</Link>
          <Link href={`${basePath}/pesquisa?tipo=novidades${storeSlug ? `&storeSlug=${encodeURIComponent(storeSlug)}` : ""}`}>Novidades</Link>
          <Link href={`${basePath}/pesquisa?tipo=ofertas${storeSlug ? `&storeSlug=${encodeURIComponent(storeSlug)}` : ""}`}>Ofertas</Link>
        </nav>
        <div className="max-w-56 flex-1">{searchBox}</div>{actions}
      </div>
    </header>
  );
}

export default Header;
