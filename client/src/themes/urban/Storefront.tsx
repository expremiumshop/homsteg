import {
    ArrowRight,
    ChevronDown,
    Heart,
    Menu,
    Search,
    ShoppingBag,
    Star,
    User,
    X,
  } from "lucide-react";
  import {
    useMemo,
    useState,
  } from "react";
  
  type UrbanMode = "demo" | "store";
  
  type UrbanStore = {
    id?: string;
    name?: string | null;
    slug?: string | null;
    category?: string | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    description?: string | null;
  };
  
  type UrbanProduct = {
    id: string;
    name: string;
    category: string;
    price: number;
    oldPrice?: number;
    image: string;
    rating: number;
    badge?: string;
  };
  
  type UrbanStorefrontProps = {
    mode?: UrbanMode;
    store?: UrbanStore | null;
  };
  
  const demoProducts: UrbanProduct[] = [
    {
      id: "urban-1",
      name: "Tênis Street Essential",
      category: "Calçados",
      price: 249.9,
      oldPrice: 329.9,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
      rating: 4.9,
      badge: "Oferta",
    },
    {
      id: "urban-2",
      name: "Jaqueta Urban Premium",
      category: "Moda",
      price: 389.9,
      oldPrice: 459.9,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
      rating: 4.8,
      badge: "Novo",
    },
    {
      id: "urban-3",
      name: "Óculos Solar Classic",
      category: "Acessórios",
      price: 159.9,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
      rating: 4.7,
    },
    {
      id: "urban-4",
      name: "Mochila Street Pack",
      category: "Acessórios",
      price: 219.9,
      oldPrice: 279.9,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
      rating: 4.8,
      badge: "Oferta",
    },
    {
      id: "urban-5",
      name: "Camiseta Essential",
      category: "Moda",
      price: 89.9,
      oldPrice: 119.9,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
      rating: 4.9,
    },
    {
      id: "urban-6",
      name: "Relógio Minimal Black",
      category: "Acessórios",
      price: 299.9,
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
      rating: 4.6,
      badge: "Novo",
    },
    {
      id: "urban-7",
      name: "Tênis Casual White",
      category: "Calçados",
      price: 229.9,
      oldPrice: 299.9,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",
      rating: 4.8,
    },
    {
      id: "urban-8",
      name: "Bolsa Everyday",
      category: "Acessórios",
      price: 269.9,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
      rating: 4.7,
    },
  ];
  
  const categories = [
    {
      name: "Moda",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Calçados",
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Acessórios",
      image:
        "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Novidades",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
    },
  ];
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      },
    ).format(value);
  };
  
  function Logo({
    storeName,
  }: {
    storeName: string;
  }) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
          <ShoppingBag className="h-5 w-5" />
        </div>
  
        <div className="leading-none">
          <div className="text-[16px] font-black uppercase tracking-[0.16em] text-neutral-950">
            {storeName}
          </div>
  
          <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.25em] text-neutral-400">
            Store
          </div>
        </div>
      </div>
    );
  }
  
  function PromoBar() {
    return (
      <div className="bg-neutral-950 px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
        Frete grátis em compras acima de R$ 199
      </div>
    );
  }
  
  function Header({
    storeName,
    onMenu,
    onSearch,
  }: {
    storeName: string;
    onMenu: () => void;
    onSearch: () => void;
  }) {
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
  
            <button
              type="button"
              className="hidden h-11 w-11 items-center justify-center rounded-full bg-neutral-100 sm:flex"
              aria-label="Conta"
            >
              <User className="h-4.5 w-4.5 text-neutral-900" />
            </button>
  
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800"
              aria-label="Carrinho"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
  
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-black text-neutral-950">
                0
              </span>
            </button>
          </div>
        </div>
      </header>
    );
  }
  
  function MobileMenu({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) {
    if (!open) {
      return null;
    }
  
    return (
      <div className="fixed inset-0 z-[60] lg:hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
          aria-label="Fechar menu"
        />
  
        <aside className="relative h-full w-[88%] max-w-[360px] bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-neutral-950">
              Menu
            </span>
  
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
  
          <div className="mt-10 space-y-2">
            {[
              "Início",
              "Loja",
              "Novidades",
              "Ofertas",
              "Sobre nós",
              "Contacto",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                {item}
  
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </button>
            ))}
          </div>
        </aside>
      </div>
    );
  }
  
  function SearchPanel({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) {
    const [value, setValue] = useState("");
  
    if (!open) {
      return null;
    }
  
    return (
      <div className="fixed inset-0 z-[70] bg-white">
        <div className="mx-auto max-w-[900px] px-5 py-8 md:px-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
              Pesquisa
            </span>
  
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100"
              aria-label="Fechar pesquisa"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
  
          <div className="mt-12 flex items-center gap-4 border-b-2 border-neutral-950 pb-4">
            <Search className="h-6 w-6 text-neutral-400" />
  
            <input
              autoFocus
              value={value}
              onChange={(event) =>
                setValue(event.target.value)
              }
              placeholder="Pesquisar produtos..."
              className="w-full bg-transparent text-2xl font-semibold outline-none placeholder:text-neutral-300 md:text-4xl"
            />
          </div>
  
          <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
              Pesquisas populares
            </p>
  
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Tênis",
                "Jaquetas",
                "Acessórios",
                "Novidades",
                "Ofertas",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setValue(item)
                  }
                  className="rounded-full bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function Hero({
    store,
  }: {
    store: UrbanStore;
  }) {
    const [loaded, setLoaded] = useState(false);
  
    const title =
      store.bannerUrl
        ? "Seu estilo começa aqui"
        : "O seu estilo.\nDo seu jeito.";
  
    const subtitle =
      store.description ||
      "Descubra peças selecionadas para quem gosta de design, atitude e personalidade.";
  
    return (
      <section className="relative overflow-hidden bg-neutral-100">
        <div className="mx-auto grid min-h-[620px] max-w-[1440px] lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-16 md:px-10 lg:px-16">
            <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
              Coleção 2026
            </div>
  
            <h1 className="max-w-[620px] whitespace-pre-line text-5xl font-black leading-[0.95] tracking-[-0.045em] text-neutral-950 sm:text-6xl md:text-7xl lg:text-[78px]">
              {title}
            </h1>
  
            <p className="mt-7 max-w-[480px] text-base leading-7 text-neutral-500 md:text-lg">
              {subtitle}
            </p>
  
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex h-13 items-center justify-center gap-3 rounded-full bg-neutral-950 px-6 text-sm font-bold text-white transition hover:bg-neutral-800"
              >
                Comprar agora
                <ArrowRight className="h-4 w-4" />
              </button>
  
              <button
                type="button"
                className="inline-flex h-13 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200"
              >
                Ver coleção
              </button>
            </div>
  
            <div className="mt-12 grid max-w-[460px] grid-cols-3 gap-5">
              <div>
                <div className="text-2xl font-black tracking-tight text-neutral-950">
                  10k+
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  Clientes
                </div>
              </div>
  
              <div>
                <div className="text-2xl font-black tracking-tight text-neutral-950">
                  4.9
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  Avaliação
                </div>
              </div>
  
              <div>
                <div className="text-2xl font-black tracking-tight text-neutral-950">
                  48h
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  Envio
                </div>
              </div>
            </div>
          </div>
  
          <div className="relative min-h-[450px] lg:min-h-[620px]">
            {store.bannerUrl ? (
              <img
                src={store.bannerUrl}
                alt={store.name || "Loja"}
                className="absolute inset-0 h-full w-full object-cover"
                onLoad={() => setLoaded(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_35%_72%,rgba(255,255,255,0.08),transparent_25%)]" />
  
                <div className="absolute inset-0 flex items-end justify-end overflow-hidden">
                  <div className="relative h-[88%] w-[76%] overflow-hidden rounded-tl-[160px] bg-neutral-800">
                    <img
                      src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85"
                      alt="Coleção Urban"
                      className={`h-full w-full object-cover transition-opacity duration-700 ${
                        loaded
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      onLoad={() =>
                        setLoaded(true)
                      }
                    />
  
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                </div>
              </div>
            )}
  
            <div className="absolute bottom-7 left-7 rounded-2xl bg-white/95 px-5 py-4 shadow-xl backdrop-blur">
              <div className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400">
                Destaque
              </div>
  
              <div className="mt-1 text-sm font-bold text-neutral-950">
                Novos favoritos chegaram
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  function CategorySection() {
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
              Explore
            </p>
  
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-neutral-950 md:text-5xl">
              Encontre seu estilo
            </h2>
          </div>
  
          <button
            type="button"
            className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-neutral-950 sm:flex"
          >
            Ver tudo
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
  
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {categories.map((category) => (
            <button
              type="button"
              key={category.name}
              className="group relative aspect-[0.82] overflow-hidden rounded-[28px] bg-neutral-100 text-left"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
  
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
  
              <div className="absolute bottom-5 left-5 right-5">
                <div className="text-lg font-black text-white md:text-2xl">
                  {category.name}
                </div>
  
                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
                  Explorar
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  }
  
  function SectionHeading({
    eyebrow,
    title,
    action,
  }: {
    eyebrow: string;
    title: string;
    action?: string;
  }) {
    return (
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            {eyebrow}
          </p>
  
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-neutral-950 md:text-4xl">
            {title}
          </h2>
        </div>
  
        {action && (
          <button
            type="button"
            className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-neutral-950 sm:flex"
          >
            {action}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
  
  function Rating({
    value,
  }: {
    value: number;
  }) {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-current text-neutral-900" />
        <span className="text-[11px] font-bold text-neutral-600">
          {value.toFixed(1)}
        </span>
      </div>
    );
  }
  
  function ProductCard({
    product,
  }: {
    product: UrbanProduct;
  }) {
    const [favorite, setFavorite] =
      useState(false);
  
    return (
      <article className="group min-w-0">
        <div className="relative overflow-hidden rounded-[28px] bg-neutral-100">
          <div className="aspect-[0.84] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
  
          {product.badge && (
            <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-neutral-950 shadow-sm">
              {product.badge}
            </div>
          )}
  
          <button
            type="button"
            onClick={() =>
              setFavorite(
                (current) => !current,
              )
            }
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur"
            aria-label={
              favorite
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }
          >
            <Heart
              className={`h-4 w-4 transition ${
                favorite
                  ? "fill-current text-neutral-950"
                  : "text-neutral-700"
              }`}
            />
          </button>
  
          <button
            type="button"
            className="absolute bottom-4 left-4 right-4 hidden h-12 items-center justify-center gap-2 rounded-full bg-neutral-950 text-sm font-bold text-white opacity-0 shadow-xl transition group-hover:flex group-hover:opacity-100"
          >
            Adicionar ao carrinho
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
  
        <div className="pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-neutral-400">
                {product.category}
              </p>
  
              <h3 className="mt-1.5 text-sm font-bold leading-5 text-neutral-950 md:text-[15px]">
                {product.name}
              </h3>
            </div>
  
            <Rating value={product.rating} />
          </div>
  
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-black text-neutral-950">
              {formatPrice(product.price)}
            </span>
  
            {product.oldPrice && (
              <span className="text-xs font-medium text-neutral-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }
  
  function ProductSection({
    products,
  }: {
    products: UrbanProduct[];
  }) {
    const [filter, setFilter] =
      useState("Todos");
  
    const filters = [
      "Todos",
      "Moda",
      "Calçados",
      "Acessórios",
    ];
  
    const visibleProducts = useMemo(() => {
      if (filter === "Todos") {
        return products;
      }
  
      return products.filter(
        (product) =>
          product.category === filter,
      );
    }, [filter, products]);
  
    return (
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-8">
        <SectionHeading
          eyebrow="Seleção"
          title="Mais desejados"
          action="Ver coleção"
        />
  
        <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${
                filter === item
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
  
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ),
          )}
        </div>
      </section>
    );
  }
  
  function PromoSection() {
    return (
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-8">
        <div className="relative overflow-hidden rounded-[34px] bg-neutral-950 px-6 py-12 text-white md:px-12 md:py-16">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/[0.06]" />
          <div className="absolute -bottom-40 right-20 h-96 w-96 rounded-full bg-white/[0.04]" />
  
          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                Oferta especial
              </p>
  
              <h2 className="mt-4 max-w-[720px] text-4xl font-black tracking-[-0.045em] md:text-6xl">
                Seu próximo favorito pode estar aqui.
              </h2>
  
              <p className="mt-5 max-w-[560px] text-sm leading-7 text-white/55 md:text-base">
                Aproveite condições especiais em produtos
                selecionados e descubra uma nova forma de
                comprar.
              </p>
            </div>
  
            <button
              type="button"
              className="flex h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-black text-neutral-950 transition hover:bg-neutral-200"
            >
              Comprar agora
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  function BenefitsSection() {
    const benefits = [
      {
        title: "Envio rápido",
        text: "Processamos seu pedido com agilidade.",
      },
      {
        title: "Compra segura",
        text: "Seu pagamento e seus dados protegidos.",
      },
      {
        title: "Troca simples",
        text: "Facilidade para trocar quando necessário.",
      },
      {
        title: "Suporte humano",
        text: "Atendimento para ajudar você.",
      },
    ];
  
    return (
      <section className="border-y border-neutral-100 bg-neutral-50">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map(
            (benefit) => (
              <div
                key={benefit.title}
                className="px-6 py-10 lg:px-8"
              >
                <div className="h-2 w-2 rounded-full bg-neutral-950" />
  
                <h3 className="mt-5 text-sm font-black text-neutral-950">
                  {benefit.title}
                </h3>
  
                <p className="mt-2 max-w-[230px] text-sm leading-6 text-neutral-500">
                  {benefit.text}
                </p>
              </div>
            ),
          )}
        </div>
      </section>
    );
  }
  
  function Newsletter() {
    const [email, setEmail] =
      useState("");
  
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            Fique por dentro
          </p>
  
          <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-neutral-950 md:text-5xl">
            Receba novidades primeiro.
          </h2>
  
          <p className="mx-auto mt-5 max-w-[520px] text-sm leading-7 text-neutral-500 md:text-base">
            Novos produtos, coleções e ofertas diretamente
            no seu email.
          </p>
  
          <div className="mx-auto mt-8 flex max-w-[560px] flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Seu melhor email"
              className="h-13 flex-1 rounded-full bg-neutral-100 px-5 text-sm text-neutral-950 outline-none ring-0 placeholder:text-neutral-400 focus:bg-neutral-200"
            />
  
            <button
              type="button"
              className="h-13 rounded-full bg-neutral-950 px-7 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Quero receber
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  function Footer({
    storeName,
  }: {
    storeName: string;
  }) {
    return (
      <footer className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Logo storeName={storeName} />
  
              <p className="mt-6 max-w-[430px] text-sm leading-7 text-white/45">
                Uma experiência de compra moderna, simples e
                pensada para pessoas que valorizam estilo,
                qualidade e personalidade.
              </p>
            </div>
  
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                Loja
              </p>
  
              <div className="mt-5 space-y-3">
                {[
                  "Todos os produtos",
                  "Novidades",
                  "Mais vendidos",
                  "Ofertas",
                ].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="block text-sm text-white/65 transition hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
  
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                Ajuda
              </p>
  
              <div className="mt-5 space-y-3">
                {[
                  "Contactos",
                  "Entrega",
                  "Trocas",
                  "Privacidade",
                ].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="block text-sm text-white/65 transition hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
  
          <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/35 md:flex-row">
            <span>
              © {new Date().getFullYear()}{" "}
              {storeName}. Todos os direitos reservados.
            </span>
  
            <span>
              Powered by HOMSTEG
            </span>
          </div>
        </div>
      </footer>
    );
  }
  
  export default function UrbanStorefront({
    mode = "demo",
    store,
  }: UrbanStorefrontProps) {
    const [mobileMenuOpen, setMobileMenuOpen] =
      useState(false);
  
    const [searchOpen, setSearchOpen] =
      useState(false);
  
    const currentStore = store ?? {
      name: "Urban",
      slug: "urban",
      description:
        "Descubra uma seleção moderna de produtos para o seu estilo.",
    };
  
    const storeName =
      currentStore.name?.trim() ||
      "Urban";
  
    const products = demoProducts;
  
    return (
      <div
        data-theme="urban"
        data-mode={mode}
        className="min-h-screen bg-white font-sans text-neutral-950"
      >
        <PromoBar />
  
        <Header
          storeName={storeName}
          onMenu={() =>
            setMobileMenuOpen(true)
          }
          onSearch={() =>
            setSearchOpen(true)
          }
        />
  
        <MobileMenu
          open={mobileMenuOpen}
          onClose={() =>
            setMobileMenuOpen(false)
          }
        />
  
        <SearchPanel
          open={searchOpen}
          onClose={() =>
            setSearchOpen(false)
          }
        />
  
        <main>
          <Hero store={currentStore} />
  
          <CategorySection />
  
          <ProductSection
            products={products}
          />
  
          <PromoSection />
  
          <BenefitsSection />
  
          <Newsletter />
        </main>
  
        <Footer storeName={storeName} />
      </div>
    );
  }