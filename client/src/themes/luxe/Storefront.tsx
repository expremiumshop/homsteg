import {
    ArrowRight,
    BadgePercent,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Crown,
    Heart,
    Headphones,
    MapPin,
    Menu,
    PackageCheck,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Truck,
    UserRound,
    X,
    Zap,
  } from "lucide-react";
  
  type LuxeProduct = {
    id: number | string;
    name: string;
    category: string;
    price: string;
    oldPrice: string;
    discount: string;
    rating: string;
    sold: string;
    badge: string;
    image: string;
  };

  type StoreProduct = {
    id: number | string;
    name: string;
    category?: string | null;
    priceMzn: number;
    compareAtPriceMzn?: number | null;
    imageUrl?: string | null;
  };

  type LuxeStorefrontProps = {
    mode?: "demo" | "store";
    store?: { name: string; currency?: string | null };
    products?: StoreProduct[];
  };

  const demoCategories = [
    "Todos",
    "Moda Feminina",
    "Moda Masculina",
    "Calçados",
    "Bolsas",
    "Relógios",
    "Joias",
    "Beleza",
    "Tecnologia",
    "Casa",
    "Acessórios",
  ];
  
  const demoProducts: LuxeProduct[] = [
    {
      id: 1,
      name: "Bolsa Feminina Luxe Classic",
      category: "Bolsas",
      price: "2.490 MT",
      oldPrice: "3.490 MT",
      discount: "-29%",
      rating: "4.9",
      sold: "128 vendidos",
      badge: "Oferta",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 2,
      name: "Relógio Premium Executive Gold",
      category: "Relógios",
      price: "3.990 MT",
      oldPrice: "5.200 MT",
      discount: "-23%",
      rating: "4.8",
      sold: "96 vendidos",
      badge: "Mais vendido",
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 3,
      name: "Ténis Urban Luxe White",
      category: "Calçados",
      price: "2.890 MT",
      oldPrice: "3.900 MT",
      discount: "-26%",
      rating: "4.9",
      sold: "214 vendidos",
      badge: "Popular",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 4,
      name: "Óculos de Sol Milano Premium",
      category: "Acessórios",
      price: "1.290 MT",
      oldPrice: "1.890 MT",
      discount: "-32%",
      rating: "4.7",
      sold: "83 vendidos",
      badge: "Oferta",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 5,
      name: "Perfume Royale Homme 100ml",
      category: "Beleza",
      price: "2.190 MT",
      oldPrice: "2.990 MT",
      discount: "-27%",
      rating: "4.8",
      sold: "176 vendidos",
      badge: "Top",
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 6,
      name: "Carteira Couro Genuine Black",
      category: "Acessórios",
      price: "990 MT",
      oldPrice: "1.390 MT",
      discount: "-29%",
      rating: "4.8",
      sold: "142 vendidos",
      badge: "Oferta",
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 7,
      name: "Smartwatch Luxe Series 9",
      category: "Tecnologia",
      price: "4.590 MT",
      oldPrice: "6.200 MT",
      discount: "-26%",
      rating: "4.9",
      sold: "201 vendidos",
      badge: "Novo",
      image:
        "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 8,
      name: "Fones Wireless Elite Pro",
      category: "Tecnologia",
      price: "2.290 MT",
      oldPrice: "3.100 MT",
      discount: "-26%",
      rating: "4.8",
      sold: "319 vendidos",
      badge: "Oferta",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 9,
      name: "Camisa Premium Oxford",
      category: "Moda Masculina",
      price: "1.690 MT",
      oldPrice: "2.190 MT",
      discount: "-23%",
      rating: "4.7",
      sold: "91 vendidos",
      badge: "Luxe Pick",
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 10,
      name: "Vestido Milano Collection",
      category: "Moda Feminina",
      price: "3.490 MT",
      oldPrice: "4.900 MT",
      discount: "-29%",
      rating: "4.9",
      sold: "157 vendidos",
      badge: "Novo",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 11,
      name: "Brincos Crystal Drop",
      category: "Joias",
      price: "1.490 MT",
      oldPrice: "2.100 MT",
      discount: "-29%",
      rating: "4.9",
      sold: "72 vendidos",
      badge: "Premium",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 12,
      name: "Colar Minimal Gold",
      category: "Joias",
      price: "1.790 MT",
      oldPrice: "2.490 MT",
      discount: "-28%",
      rating: "4.8",
      sold: "118 vendidos",
      badge: "Oferta",
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 13,
      name: "Sapatilha Feminina Milano",
      category: "Calçados",
      price: "2.190 MT",
      oldPrice: "2.890 MT",
      discount: "-24%",
      rating: "4.7",
      sold: "66 vendidos",
      badge: "Popular",
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 14,
      name: "Mala Travel Premium",
      category: "Acessórios",
      price: "4.290 MT",
      oldPrice: "5.900 MT",
      discount: "-27%",
      rating: "4.9",
      sold: "54 vendidos",
      badge: "Oferta",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 15,
      name: "Luminária Modern Gold",
      category: "Casa",
      price: "2.690 MT",
      oldPrice: "3.490 MT",
      discount: "-23%",
      rating: "4.8",
      sold: "88 vendidos",
      badge: "Casa Luxe",
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 16,
      name: "Kit Skincare Premium",
      category: "Beleza",
      price: "2.990 MT",
      oldPrice: "4.200 MT",
      discount: "-29%",
      rating: "4.9",
      sold: "231 vendidos",
      badge: "Best Seller",
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85",
    },
  ];
  
  const brands = [
    {
      name: "LUXE",
      text: "Coleções premium",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "MILANO",
      text: "Moda & acessórios",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "ROYAL",
      text: "Beleza & perfumes",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "ELITE",
      text: "Tecnologia premium",
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=700&q=85",
    },
  ];
  
  const categoryCards = [
    {
      name: "Moda Feminina",
      count: "2.4K produtos",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Relógios",
      count: "680 produtos",
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Calçados",
      count: "1.8K produtos",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Beleza",
      count: "1.2K produtos",
      image:
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Tecnologia",
      count: "3.1K produtos",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Joias",
      count: "890 produtos",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85",
    },
  ];
  
  const demoFlashProducts = [
    {
      name: "Smartwatch Elite",
      price: "3.490 MT",
      oldPrice: "5.290 MT",
      discount: "34%",
      sold: "76%",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "Sneaker Street Luxe",
      price: "2.190 MT",
      oldPrice: "3.490 MT",
      discount: "37%",
      sold: "82%",
      image:
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "Headphones Elite",
      price: "1.990 MT",
      oldPrice: "2.990 MT",
      discount: "33%",
      sold: "69%",
      image:
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "Perfume Signature",
      price: "1.790 MT",
      oldPrice: "2.590 MT",
      discount: "31%",
      sold: "88%",
      image:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "Bag Premium",
      price: "2.790 MT",
      oldPrice: "4.290 MT",
      discount: "35%",
      sold: "64%",
      image:
        "https://images.unsplash.com/photo-155 handbag",
    },
  ];
  
  const promoCards = [
    {
      eyebrow: "NOVA COLEÇÃO",
      title: "Elegância que fala por si.",
      text: "Descubra peças selecionadas para transformar o seu estilo.",
      button: "Explorar coleção",
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
    },
    {
      eyebrow: "TECH LUXE",
      title: "Tecnologia. Mas com estilo.",
      text: "Os gadgets mais desejados numa seleção premium.",
      button: "Ver tecnologia",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85",
    },
  ];
  
  const footerColumns = [
    {
      title: "Comprar",
      links: [
        "Ofertas do dia",
        "Novidades",
        "Mais vendidos",
        "Moda",
        "Tecnologia",
        "Beleza",
      ],
    },
    {
      title: "Atendimento",
      links: [
        "Central de ajuda",
        "Entrega",
        "Formas de pagamento",
        "Devoluções",
        "Contacte-nos",
        "FAQ",
      ],
    },
    {
      title: "Sobre a Luxe",
      links: [
        "Quem somos",
        "Termos e condições",
        "Privacidade",
        "Parceiros",
        "Vender na Luxe",
        "Carreiras",
      ],
    },
  ];
  
  function ProductCard({
    product,
  }: {
    product: LuxeProduct;
  }) {
    return (
      <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <PackageCheck className="h-8 w-8" />
            </div>
          )}
  
          {product.badge && (
            <div className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
              {product.badge}
            </div>
          )}
  
          <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur">
            <Heart className="h-4 w-4" />
          </div>
  
          {product.discount && (
            <div className="absolute bottom-3 left-3 rounded-md bg-slate-950/85 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
              {product.discount}
            </div>
          )}
        </div>
  
        <div className="p-4">
          {(product.rating || product.sold) && (
            <div className="mb-2 flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
              <span className="font-bold text-slate-700">
                {product.rating}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-400">
                {product.sold}
              </span>
            </div>
          )}
  
          <h3 className="min-h-[42px] text-sm font-semibold leading-5 text-slate-800">
            {product.name}
          </h3>
  
          <div className="mt-3 flex items-end gap-2">
            <span className="text-xl font-black tracking-tight text-red-600">
              {product.price}
            </span>
  
            {product.oldPrice && (
              <span className="pb-0.5 text-xs text-slate-400 line-through">
                {product.oldPrice}
              </span>
            )}
          </div>
  
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Envio disponível
            </span>
  
            <ShoppingBag className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </article>
    );
  }
  
  function FlashCard({
    item,
  }: {
    item: (typeof demoFlashProducts)[number];
  }) {
    return (
      <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
  
          <div className="absolute left-3 top-3 rounded-md bg-red-600 px-2.5 py-1 text-[10px] font-black text-white">
            -{item.discount}
          </div>
        </div>
  
        <div className="p-4">
          <h3 className="truncate text-sm font-bold text-slate-800">
            {item.name}
          </h3>
  
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-black text-red-600">
              {item.price}
            </span>
  
            <span className="text-xs text-slate-400 line-through">
              {item.oldPrice}
            </span>
          </div>
  
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-500"
              style={{ width: item.sold }}
            />
          </div>
  
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Quase esgotado
          </p>
        </div>
      </article>
    );
  }
  
  function CategoryCard({
    item,
  }: {
    item: (typeof categoryCards)[number];
  }) {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-slate-100">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
  
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 pt-16">
          <h3 className="text-lg font-black text-white">
            {item.name}
          </h3>
  
          <p className="mt-1 text-xs font-medium text-white/70">
            {item.count}
          </p>
        </div>
      </article>
    );
  }
  
  function BrandCard({
    item,
  }: {
    item: (typeof brands)[number];
  }) {
    return (
      <article className="group relative overflow-hidden rounded-2xl">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
  
        <div className="absolute inset-0 bg-black/35" />
  
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black tracking-[0.25em] text-white">
            {item.name}
          </span>
  
          <span className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            {item.text}
          </span>
        </div>
      </article>
    );
  }
  
  export default function LuxeStorefront({
    mode = "demo",
    store,
    products: storeProducts = [],
  }: LuxeStorefrontProps) {
    const isDemo = mode === "demo";
    const formatPrice = (amount: number) =>
      `${new Intl.NumberFormat("pt-MZ").format(amount)} MT`;
    const products: LuxeProduct[] = isDemo
      ? demoProducts
      : storeProducts.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category ?? "Geral",
          price: formatPrice(product.priceMzn),
          oldPrice: product.compareAtPriceMzn
            ? formatPrice(product.compareAtPriceMzn)
            : "",
          discount: product.compareAtPriceMzn
            ? "Oferta"
            : "",
          rating: "",
          sold: "",
          badge: "",
          image: product.imageUrl ?? "",
        }));
    const categories = isDemo
      ? demoCategories
      : [
          "Todos",
          ...Array.from(
            new Set(products.map((product) => product.category)),
          ),
        ];
    const flashProducts = isDemo
      ? demoFlashProducts
      : products.slice(0, 5).map((product) => ({
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          discount: product.discount,
          sold: product.sold,
          image: product.image,
        }));
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#f7f7f5] font-sans text-slate-900">
  
        {/* TOP BAR */}
        <div className="bg-slate-950 text-white">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-2 text-[11px] font-semibold sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              Entrega para Moçambique
            </div>
  
            <div className="hidden items-center gap-5 md:flex">
              <span>Compra protegida</span>
              <span>Pagamento seguro</span>
              <span>Suporte 24/7</span>
            </div>
  
            <div className="flex items-center gap-1">
              MZN
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
        </div>
  
        {/* PROMO BAR */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white">
          <div className="mx-auto flex max-w-[1500px] items-center justify-center gap-3 px-4 py-2.5 text-center text-xs font-bold sm:text-sm">
            <Zap className="h-4 w-4 fill-current" />
            <span>
              MEGA OFERTAS — Até 50% OFF em produtos selecionados
            </span>
            <ArrowRight className="hidden h-4 w-4 sm:block" />
          </div>
        </div>
  
        {/* MAIN HEADER */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
  
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Crown className="h-5 w-5" />
                </div>
  
                <div className="hidden sm:block">
                  <div className="text-xl font-black tracking-[0.22em] text-slate-950">
                    {store?.name ?? "LUXE"}
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
                    Pesquisar produtos, marcas e categorias...
                  </span>
                </div>
  
                <div className="flex h-11 w-12 items-center justify-center rounded-r-[10px] bg-slate-950 text-white">
                  <Search className="h-5 w-5" />
                </div>
              </div>
  
              <div className="hidden items-center gap-5 xl:flex">
                <div className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-slate-700" />
  
                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400">
                      Olá
                    </p>
  
                    <p className="text-xs font-bold text-slate-800">
                      Conta
                    </p>
                  </div>
                </div>
  
                <div className="relative flex items-center">
                  <Heart className="h-5 w-5 text-slate-700" />
  
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-black text-white">
                    3
                  </span>
                </div>
  
                <div className="relative flex items-center">
                  <ShoppingBag className="h-6 w-6 text-slate-700" />
  
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-black text-white">
                    2
                  </span>
                </div>
              </div>
  
              <div className="flex items-center gap-3 xl:hidden">
                <ShoppingBag className="h-5 w-5" />
                <Menu className="h-5 w-5" />
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
  
              {categories.map((category, index) => (
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
              ))}
            </div>
          </div>
        </header>
  
        <main>
  
          {/* HERO */}
          <section className="bg-white">
            <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
              <div className="grid min-h-[430px] overflow-hidden rounded-3xl bg-slate-950 lg:grid-cols-[1.45fr_0.55fr]">
  
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=90"
                    alt="Luxe collection"
                    className="absolute inset-0 h-full w-full object-cover opacity-60"
                  />
  
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
  
                  <div className="relative z-10 flex min-h-[430px] max-w-2xl flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
                    <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-amber-300">
                      <Sparkles className="h-4 w-4" />
                      Luxe Collection
                    </div>
  
                    <h1 className="max-w-xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                      O luxo começa
                      <br />
                      nos detalhes.
                    </h1>
  
                    <p className="mt-5 max-w-lg text-sm leading-6 text-white/70 sm:text-base">
                      Descubra uma seleção exclusiva de moda,
                      tecnologia, beleza e acessórios escolhidos
                      para quem não abre mão de estilo.
                    </p>
  
                    <div className="mt-8 flex flex-wrap gap-3">
                      <div className="rounded-lg bg-white px-5 py-3 text-xs font-black text-slate-950">
                        EXPLORAR COLEÇÃO
                      </div>
  
                      <div className="rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-xs font-black text-white backdrop-blur">
                        ATÉ 50% OFF
                      </div>
                    </div>
  
                    <div className="mt-10 flex items-center gap-6 text-[10px] font-bold uppercase tracking-wide text-white/50">
                      <span>Entrega nacional</span>
                      <span>Pagamento seguro</span>
                      <span>Produtos selecionados</span>
                    </div>
                  </div>
                </div>
  
                <div className="hidden bg-gradient-to-br from-amber-200 via-yellow-100 to-white p-8 lg:flex lg:flex-col lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-700">
                      <BadgePercent className="h-4 w-4" />
                      Oferta especial
                    </div>
  
                    <p className="mt-8 text-sm font-bold text-slate-600">
                      Semana Luxe
                    </p>
  
                    <p className="mt-2 text-6xl font-black tracking-tighter text-slate-950">
                      50%
                    </p>
  
                    <p className="text-2xl font-black uppercase tracking-tight text-slate-950">
                      OFF
                    </p>
  
                    <p className="mt-4 max-w-xs text-xs leading-5 text-slate-600">
                      Descontos especiais em produtos selecionados
                      durante a campanha.
                    </p>
                  </div>
  
                  <div className="rounded-xl bg-slate-950 p-4 text-white">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Clock3 className="h-4 w-4 text-amber-300" />
                      Termina em
                    </div>
  
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-white/10 p-2">
                        <div className="text-xl font-black">
                          12
                        </div>
                        <div className="text-[8px] uppercase text-white/50">
                          Horas
                        </div>
                      </div>
  
                      <div className="rounded-lg bg-white/10 p-2">
                        <div className="text-xl font-black">
                          42
                        </div>
                        <div className="text-[8px] uppercase text-white/50">
                          Min
                        </div>
                      </div>
  
                      <div className="rounded-lg bg-white/10 p-2">
                        <div className="text-xl font-black">
                          18
                        </div>
                        <div className="text-[8px] uppercase text-white/50">
                          Seg
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
              </div>
            </div>
          </section>
  
          {/* TRUST BAR */}
          <section className="border-y border-slate-200 bg-white">
            <div className="mx-auto grid max-w-[1500px] grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
              <div className="flex items-center gap-3 px-5 py-5">
                <Truck className="h-6 w-6 text-red-500" />
  
                <div>
                  <p className="text-xs font-black text-slate-900">
                    Entrega rápida
                  </p>
  
                  <p className="mt-1 text-[10px] text-slate-400">
                    Para todo Moçambique
                  </p>
                </div>
              </div>
  
              <div className="flex items-center gap-3 px-5 py-5">
                <ShieldCheck className="h-6 w-6 text-red-500" />
  
                <div>
                  <p className="text-xs font-black text-slate-900">
                    Compra protegida
                  </p>
  
                  <p className="mt-1 text-[10px] text-slate-400">
                    Segurança em cada pedido
                  </p>
                </div>
              </div>
  
              <div className="flex items-center gap-3 px-5 py-5">
                <PackageCheck className="h-6 w-6 text-red-500" />
  
                <div>
                  <p className="text-xs font-black text-slate-900">
                    Qualidade garantida
                  </p>
  
                  <p className="mt-1 text-[10px] text-slate-400">
                    Produtos selecionados
                  </p>
                </div>
              </div>
  
              <div className="flex items-center gap-3 px-5 py-5">
                <Headphones className="h-6 w-6 text-red-500" />
  
                <div>
                  <p className="text-xs font-black text-slate-900">
                    Suporte dedicado
                  </p>
  
                  <p className="mt-1 text-[10px] text-slate-400">
                    Estamos aqui para ajudar
                  </p>
                </div>
              </div>
            </div>
          </section>
  
          {/* FLASH DEALS */}
          <section className="bg-[#f7f7f5] py-10 sm:py-14">
            <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
  
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 fill-red-500 text-red-500" />
  
                    <h2 className="text-2xl font-black tracking-tight text-slate-950">
                      Ofertas relâmpago
                    </h2>
  
                    <span className="rounded-md bg-red-100 px-2 py-1 text-[10px] font-black uppercase text-red-600">
                      Ao vivo
                    </span>
                  </div>
  
                  <p className="mt-1 text-sm text-slate-500">
                    Os melhores preços por tempo limitado.
                  </p>
                </div>
  
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white">
                    08
                  </div>
  
                  <span className="font-black text-slate-400">
                    :
                  </span>
  
                  <div className="rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white">
                    42
                  </div>
  
                  <span className="font-black text-slate-400">
                    :
                  </span>
  
                  <div className="rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white">
                    19
                  </div>
                </div>
              </div>
  
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {flashProducts.slice(0, 5).map((item) => (
                  <FlashCard
                    key={item.name}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </section>
  
          {/* CATEGORIES */}
          <section className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
  
              <div className="mb-7 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                    Explore
                  </p>
  
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    Compre por categoria
                  </h2>
  
                  <p className="mt-2 text-sm text-slate-500">
                    Encontre exatamente o que procura.
                  </p>
                </div>
  
                <div className="hidden items-center gap-1 text-xs font-bold text-slate-500 sm:flex">
                  Ver todas
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
  
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {categoryCards.map((item) => (
                  <CategoryCard
                    key={item.name}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </section>
  
          {/* PROMO BANNERS */}
          <section className="bg-[#f7f7f5] py-12">
            <div className="mx-auto grid max-w-[1500px] gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
              {promoCards.map((promo) => (
                <article
                  key={promo.title}
                  className="relative min-h-[330px] overflow-hidden rounded-3xl bg-slate-950"
                >
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-55"
                  />
  
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
  
                  <div className="relative z-10 flex min-h-[330px] max-w-lg flex-col justify-center p-7 sm:p-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
                      {promo.eyebrow}
                    </span>
  
                    <h2 className="mt-3 text-3xl font-black leading-tight text-white">
                      {promo.title}
                    </h2>
  
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
                      {promo.text}
                    </p>
  
                    <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-black text-slate-950">
                      {promo.button}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
  
          {/* PRODUCTS */}
          <section className="bg-[#f7f7f5] pb-14 sm:pb-20">
            <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
  
              <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                    Seleção Luxe
                  </p>
  
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    Produtos em destaque
                  </h2>
  
                  <p className="mt-2 text-sm text-slate-500">
                    Produtos populares escolhidos para si.
                  </p>
                </div>
  
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">
                    Recomendados
                    <ChevronDown className="ml-2 inline h-3.5 w-3.5" />
                  </div>
  
                  <div className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white sm:flex">
                    <ChevronLeft className="h-4 w-4 text-slate-400" />
                  </div>
  
                  <div className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white sm:flex">
                    <ChevronRight className="h-4 w-4 text-slate-700" />
                  </div>
                </div>
              </div>
  
              {products.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
                  Esta loja ainda não adicionou produtos.
                </div>
              )}
  
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3 text-xs font-black uppercase tracking-wide text-slate-800">
                  Ver mais produtos
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </section>
  
          {/* BRAND SECTION */}
          <section className="bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
  
              <div className="mb-7 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                  LUXE MALL
                </p>
  
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  Marcas & coleções
                </h2>
  
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Descubra coleções que combinam qualidade,
                  personalidade e estilo.
                </p>
              </div>
  
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {brands.map((brand) => (
                  <BrandCard
                    key={brand.name}
                    item={brand}
                  />
                ))}
              </div>
            </div>
          </section>
  
          {/* NEW ARRIVALS */}
          <section className="bg-slate-950 py-14 text-white sm:py-20">
            <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
  
              <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
  
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">
                    <Sparkles className="h-4 w-4" />
                    Just arrived
                  </div>
  
                  <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                    Novidades que
                    <br />
                    merecem atenção.
                  </h2>
  
                  <p className="mt-5 max-w-md text-sm leading-6 text-white/55">
                    Uma nova seleção de produtos premium acaba
                    de chegar. Peças modernas para elevar o seu
                    estilo todos os dias.
                  </p>
  
                  <div className="mt-7 flex items-center gap-3">
                    <div className="rounded-lg bg-white px-5 py-3 text-xs font-black text-slate-950">
                      VER NOVIDADES
                    </div>
  
                    <div className="rounded-lg border border-white/20 px-5 py-3 text-xs font-black text-white">
                      COLEÇÃO 2026
                    </div>
                  </div>
                </div>
  
                {products.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {products.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        className="group relative overflow-hidden rounded-2xl bg-white/5"
                      >
                        <div className="aspect-[4/5] overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-white/40">
                              <PackageCheck className="h-8 w-8" />
                            </div>
                          )}
                        </div>
  
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 pt-12">
                          <p className="text-sm font-bold text-white">
                            {product.name}
                          </p>
  
                          <p className="mt-1 text-xs font-black text-amber-300">
                            {product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
  
              </div>
            </div>
          </section>
  
          {/* BENEFITS */}
          <section className="bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
  
              <div className="mx-auto mb-10 max-w-xl text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                  Porquê Luxe?
                </p>
  
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  Uma experiência diferente.
                </h2>
              </div>
  
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
  
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <Crown className="h-6 w-6" />
                  </div>
  
                  <h3 className="mt-4 text-sm font-black text-slate-900">
                    Seleção premium
                  </h3>
  
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Produtos selecionados com atenção aos
                    detalhes e à qualidade.
                  </p>
                </div>
  
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
  
                  <h3 className="mt-4 text-sm font-black text-slate-900">
                    Compra segura
                  </h3>
  
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Uma experiência pensada para comprar
                    com tranquilidade.
                  </p>
                </div>
  
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <Truck className="h-6 w-6" />
                  </div>
  
                  <h3 className="mt-4 text-sm font-black text-slate-900">
                    Entrega nacional
                  </h3>
  
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Enviamos os seus produtos para diferentes
                    pontos de Moçambique.
                  </p>
                </div>
  
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <Headphones className="h-6 w-6" />
                  </div>
  
                  <h3 className="mt-4 text-sm font-black text-slate-900">
                    Suporte próximo
                  </h3>
  
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Uma equipa pronta para ajudar antes e
                    depois da compra.
                  </p>
                </div>
  
              </div>
            </div>
          </section>
  
          {/* NEWSLETTER */}
          <section className="bg-[#f7f7f5] py-14">
            <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
  
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white sm:p-12">
                <div className="grid items-center gap-8 md:grid-cols-[1fr_0.9fr]">
  
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">
                      <Sparkles className="h-4 w-4" />
                      Luxe Insider
                    </div>
  
                    <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                      Receba as melhores ofertas.
                    </h2>
  
                    <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
                      Novidades, campanhas e descontos especiais
                      diretamente para si.
                    </p>
                  </div>
  
                  <div>
                    <div className="flex overflow-hidden rounded-xl bg-white p-1">
                      <div className="flex flex-1 items-center px-4 text-sm text-slate-400">
                        O seu email
                      </div>
  
                      <div className="rounded-lg bg-slate-950 px-5 py-3 text-xs font-black text-white">
                        SUBSCREVER
                      </div>
                    </div>
  
                    <p className="mt-3 text-[9px] text-white/35">
                      Ao subscrever, concorda com os nossos termos
                      de comunicação.
                    </p>
                  </div>
  
                </div>
              </div>
            </div>
          </section>
  
        </main>
  
        {/* FOOTER */}
        <footer className="bg-white">
  
          <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
  
            <div className="grid gap-10 border-b border-slate-200 pb-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_2fr]">
  
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <Crown className="h-5 w-5" />
                  </div>
  
                  <div>
                    <div className="text-xl font-black tracking-[0.22em] text-slate-950">
                      LUXE
                    </div>
  
                    <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">
                      Marketplace
                    </div>
                  </div>
                </div>
  
                <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
                  Um marketplace moderno para descobrir produtos
                  que combinam qualidade, estilo e personalidade.
                </p>
  
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <MapPin className="h-4 w-4" />
                  Moçambique
                </div>
              </div>
  
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                {footerColumns.map((column) => (
                  <div key={column.title}>
                    <h3 className="text-xs font-black uppercase tracking-wide text-slate-950">
                      {column.title}
                    </h3>
  
                    <div className="mt-4 space-y-3">
                      {column.links.map((link) => (
                        <div
                          key={link}
                          className="text-xs text-slate-500"
                        >
                          {link}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
  
            </div>
  
            <div className="flex flex-col gap-4 py-7 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
  
              <p>
                © 2026 Luxe Marketplace. Todos os direitos reservados.
              </p>
  
              <div className="flex flex-wrap items-center gap-5">
                <span>Privacidade</span>
                <span>Termos</span>
                <span>Cookies</span>
                <span>Moçambique · MZN</span>
              </div>
  
            </div>
  
          </div>
        </footer>
  
        {/* MOBILE BOTTOM BAR */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur md:hidden">
          <div className="mx-auto grid max-w-lg grid-cols-4 gap-2">
  
            <div className="flex flex-col items-center gap-1 py-1 text-slate-950">
              <div className="flex h-7 w-7 items-center justify-center">
                <Search className="h-4 w-4" />
              </div>
  
              <span className="text-[9px] font-bold">
                Pesquisar
              </span>
            </div>
  
            <div className="flex flex-col items-center gap-1 py-1 text-slate-500">
              <div className="flex h-7 w-7 items-center justify-center">
                <Heart className="h-4 w-4" />
              </div>
  
              <span className="text-[9px] font-bold">
                Favoritos
              </span>
            </div>
  
            <div className="flex flex-col items-center gap-1 py-1 text-slate-500">
              <div className="relative flex h-7 w-7 items-center justify-center">
                <ShoppingBag className="h-4 w-4" />
  
                <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-1 text-[7px] font-black text-white">
                  2
                </span>
              </div>
  
              <span className="text-[9px] font-bold">
                Carrinho
              </span>
            </div>
  
            <div className="flex flex-col items-center gap-1 py-1 text-slate-500">
              <div className="flex h-7 w-7 items-center justify-center">
                <UserRound className="h-4 w-4" />
              </div>
  
              <span className="text-[9px] font-bold">
                Conta
              </span>
            </div>
  
          </div>
        </div>
  
      </div>
    );
  }
