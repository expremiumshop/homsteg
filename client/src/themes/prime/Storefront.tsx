import type { ReactNode } from "react";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Crown,
  Facebook,
  Flame,
  Gift,
  Grid2X2,
  Heart,
  Home,
  Instagram,
  List,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Percent,
  Phone,
  Plus,
  Search,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Tag,
  TicketPercent,
  Trash2,
  Truck,
  UserRound,
  X,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  sold: number;
  image: string;
  badge?: string;
  description: string;
  colors?: string[];
  sizes?: string[];
  shipping?: string;
};

type CartItem = Product & {
  quantity: number;
};

type PrimeStorefrontProps = {
  mode?: "demo" | "store";
  store?: {
    name: string;
    currency?: string | null;
  };
  products?: {
    id: number | string;
    name: string;
    category?: string | null;
    priceMzn: number;
    compareAtPriceMzn?: number | null;
    imageUrl?: string | null;
  }[];
};

const formatPrice = (value: number) =>
  `${new Intl.NumberFormat("pt-MZ").format(value)} MT`;

const image = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=88`;

const demoProducts: Product[] = [
  {
    id: 1,
    name: "Tênis Urban Prime White",
    category: "Calçados",
    price: 2890,
    oldPrice: 3990,
    rating: 4.8,
    reviews: 126,
    sold: 342,
    badge: "Oferta",
    image: image("photo-1542291026-7eec264c27ff"),
    description:
      "Tênis moderno, confortável e versátil para combinar com diferentes estilos.",
    colors: ["Branco", "Preto"],
    sizes: ["38", "39", "40", "41", "42", "43"],
    shipping: "Envio grátis",
  },
  {
    id: 2,
    name: "Smartwatch Prime X9",
    category: "Tecnologia",
    price: 3490,
    oldPrice: 5290,
    rating: 4.9,
    reviews: 218,
    sold: 487,
    badge: "Mais vendido",
    image: image("photo-1523275335684-37898b6baf30"),
    description:
      "Smartwatch elegante com monitorização diária, notificações e design premium.",
    colors: ["Preto", "Prata"],
    shipping: "Entrega rápida",
  },
  {
    id: 3,
    name: "Perfume Signature 100ml",
    category: "Beleza",
    price: 1790,
    oldPrice: 2590,
    rating: 4.9,
    reviews: 184,
    sold: 521,
    badge: "Oferta",
    image: image("photo-1541643600914-78b084683601"),
    description:
      "Fragrância sofisticada com presença marcante para momentos especiais.",
    shipping: "Envio grátis",
  },
  {
    id: 4,
    name: "Kit Skincare Glow",
    category: "Beleza",
    price: 2490,
    oldPrice: 3490,
    rating: 4.7,
    reviews: 97,
    sold: 273,
    badge: "Top",
    image: image("photo-1556228578-8c89e6adf883"),
    description:
      "Rotina completa para cuidados diários da pele com acabamento luminoso.",
    shipping: "Envio grátis",
  },
  {
    id: 5,
    name: "Bolsa Everyday Premium",
    category: "Acessórios",
    price: 2290,
    oldPrice: 3290,
    rating: 4.8,
    reviews: 143,
    sold: 391,
    badge: "Oferta",
    image: image("photo-1515562141207-7a88fb7ce338"),
    description:
      "Bolsa espaçosa e elegante para uso diário, trabalho e ocasiões especiais.",
    colors: ["Preto", "Castanho", "Bege"],
    shipping: "Envio grátis",
  },
  {
    id: 6,
    name: "Relógio Executive Steel",
    category: "Acessórios",
    price: 3990,
    oldPrice: 5490,
    rating: 4.8,
    reviews: 88,
    sold: 184,
    badge: "Novo",
    image: image("photo-1553062407-98eeb64c6a62"),
    description:
      "Relógio de visual executivo com acabamento metálico e presença sofisticada.",
    shipping: "Entrega rápida",
  },
  {
    id: 7,
    name: "Headphones Wireless Pro",
    category: "Tecnologia",
    price: 1990,
    oldPrice: 2990,
    rating: 4.8,
    reviews: 211,
    sold: 603,
    badge: "Oferta",
    image: image("photo-1505740420928-5e560c06d30e"),
    description:
      "Headphones sem fios com som envolvente, conforto e bateria para o dia inteiro.",
    colors: ["Preto", "Branco"],
    shipping: "Envio grátis",
  },
  {
    id: 8,
    name: "Brincos Crystal Drop",
    category: "Joias",
    price: 1490,
    oldPrice: 2190,
    rating: 4.9,
    reviews: 74,
    sold: 166,
    badge: "Premium",
    image: image("photo-1595777457583-95e059d581b8"),
    description:
      "Brincos delicados com visual elegante para elevar qualquer produção.",
    shipping: "Envio grátis",
  },
  {
    id: 9,
    name: "Vestido Milano Satin",
    category: "Moda",
    price: 3290,
    oldPrice: 4590,
    rating: 4.7,
    reviews: 132,
    sold: 247,
    badge: "Novo",
    image: image("photo-1524805444758-089113d48a6d"),
    description:
      "Vestido de corte elegante com acabamento acetinado e caimento moderno.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Preto", "Champagne"],
    shipping: "Entrega rápida",
  },
  {
    id: 10,
    name: "Camisa Oxford Essential",
    category: "Moda",
    price: 1690,
    oldPrice: 2290,
    rating: 4.9,
    reviews: 164,
    sold: 318,
    badge: "Popular",
    image: image("photo-1511499767150-a48a237f0083"),
    description:
      "Camisa clássica com corte limpo para looks casuais ou profissionais.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Branco", "Azul", "Preto"],
    shipping: "Envio grátis",
  },
  {
    id: 11,
    name: "Mala Travel Expandable",
    category: "Acessórios",
    price: 4290,
    oldPrice: 5990,
    rating: 4.8,
    reviews: 62,
    sold: 139,
    badge: "Oferta",
    image: image("photo-1627123424574-724758594e93"),
    description:
      "Mala espaçosa para viagens, com construção resistente e design moderno.",
    shipping: "Envio grátis",
  },
  {
    id: 12,
    name: "Luminária Modern Touch",
    category: "Casa",
    price: 2690,
    oldPrice: 3490,
    rating: 4.8,
    reviews: 91,
    sold: 205,
    badge: "Casa",
    image: image("photo-1599643478518-a784e5dc4c8f"),
    description:
      "Luminária moderna para criar um ambiente elegante e acolhedor.",
    shipping: "Entrega rápida",
  },
  {
    id: 13,
    name: "Cadeira Office Comfort",
    category: "Escritório",
    price: 5490,
    oldPrice: 6990,
    rating: 4.9,
    reviews: 57,
    sold: 96,
    badge: "Mais vendido",
    image: image("photo-1543163521-1bf539c55dd2"),
    description:
      "Cadeira confortável para escritório, estudo e trabalho prolongado.",
    shipping: "Envio grátis",
  },
  {
    id: 14,
    name: "Teclado Mechanical Pro",
    category: "Tecnologia",
    price: 2190,
    oldPrice: 2990,
    rating: 4.7,
    reviews: 143,
    sold: 286,
    badge: "Top",
    image: image("photo-1552346154-21d32810aba3"),
    description:
      "Teclado mecânico com resposta rápida e estética premium para setup moderno.",
    shipping: "Envio grátis",
  },
  {
    id: 15,
    name: "Mouse Silent Precision",
    category: "Tecnologia",
    price: 990,
    oldPrice: 1390,
    rating: 4.8,
    reviews: 189,
    sold: 442,
    badge: "Oferta",
    image: image("photo-1484704849700-f032a568e944"),
    description:
      "Mouse preciso e silencioso para produtividade, estudo e gaming casual.",
    shipping: "Entrega rápida",
  },
  {
    id: 16,
    name: "Garrafa Thermal Steel",
    category: "Casa",
    price: 890,
    oldPrice: 1290,
    rating: 4.8,
    reviews: 119,
    sold: 358,
    badge: "Novo",
    image: image("photo-1594035910387-fea47794261f"),
    description:
      "Garrafa térmica compacta para manter a sua bebida na temperatura ideal.",
    colors: ["Preto", "Prata", "Verde"],
    shipping: "Envio grátis",
  },
  {
    id: 17,
    name: "Ténis Street Runner",
    category: "Calçados",
    price: 2190,
    oldPrice: 3490,
    rating: 4.8,
    reviews: 154,
    sold: 381,
    badge: "Oferta",
    image: image("photo-1544117519-31a4b719223d"),
    description:
      "Ténis urbano leve e confortável para uma rotina dinâmica.",
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["Preto", "Branco"],
    shipping: "Envio grátis",
  },
  {
    id: 18,
    name: "Sandália Soft Walk",
    category: "Calçados",
    price: 1590,
    oldPrice: 2290,
    rating: 4.9,
    reviews: 101,
    sold: 231,
    badge: "Popular",
    image: image("photo-1602810318383-e386cc2a3ccf"),
    description:
      "Sandália confortável para dias quentes e combinações casuais.",
    sizes: ["36", "37", "38", "39", "40"],
    shipping: "Entrega rápida",
  },
  {
    id: 19,
    name: "Colar Minimal Gold",
    category: "Joias",
    price: 1790,
    oldPrice: 2490,
    rating: 4.8,
    reviews: 68,
    sold: 144,
    badge: "Premium",
    image: image("photo-1483985988355-763728e1935b"),
    description:
      "Colar minimalista com acabamento elegante para uso diário.",
    shipping: "Envio grátis",
  },
  {
    id: 20,
    name: "Carteira Genuine Black",
    category: "Acessórios",
    price: 990,
    oldPrice: 1390,
    rating: 4.9,
    reviews: 121,
    sold: 318,
    badge: "Oferta",
    image: image("photo-1490481651871-ab68de25d43d"),
    description:
      "Carteira compacta com visual clássico e acabamento sofisticado.",
    shipping: "Envio grátis",
  },
  {
    id: 21,
    name: "Óculos Milano Sun",
    category: "Acessórios",
    price: 1290,
    oldPrice: 1890,
    rating: 4.7,
    reviews: 76,
    sold: 191,
    badge: "Oferta",
    image: image("photo-1551488831-00ddcb6c6bd3"),
    description:
      "Óculos de sol modernos para complementar looks urbanos e casuais.",
    shipping: "Entrega rápida",
  },
  {
    id: 22,
    name: "Camisola Comfort Knit",
    category: "Moda",
    price: 1990,
    oldPrice: 2890,
    rating: 4.8,
    reviews: 94,
    sold: 203,
    badge: "Novo",
    image: image("photo-1591369822096-ffd140ec948f"),
    description:
      "Camisola confortável com textura elegante para dias mais frescos.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Bege", "Preto", "Cinza"],
    shipping: "Envio grátis",
  },
  {
    id: 23,
    name: "Casaco Urban Light",
    category: "Moda",
    price: 3490,
    oldPrice: 4890,
    rating: 4.9,
    reviews: 88,
    sold: 176,
    badge: "Top",
    image: image("photo-1515372039744-b8f02a3ae446"),
    description:
      "Casaco leve com design urbano e acabamento premium.",
    sizes: ["S", "M", "L", "XL"],
    shipping: "Envio grátis",
  },
  {
    id: 24,
    name: "Calça Wide Essential",
    category: "Moda",
    price: 1890,
    oldPrice: 2590,
    rating: 4.7,
    reviews: 81,
    sold: 162,
    badge: "Popular",
    image: image("photo-1506629905607-d9d3a4f2f08e"),
    description:
      "Calça de corte moderno para composições urbanas e confortáveis.",
    sizes: ["36", "38", "40", "42", "44"],
    shipping: "Entrega rápida",
  },
  {
    id: 25,
    name: "Conjunto Fitness Move",
    category: "Desporto",
    price: 2290,
    oldPrice: 3190,
    rating: 4.8,
    reviews: 109,
    sold: 267,
    badge: "Oferta",
    image: image("photo-1535632066927-ab7c9ab60908"),
    description:
      "Conjunto desportivo confortável para treino e rotina ativa.",
    sizes: ["S", "M", "L", "XL"],
    shipping: "Envio grátis",
  },
  {
    id: 26,
    name: "Tapete Yoga Pro",
    category: "Desporto",
    price: 1190,
    oldPrice: 1690,
    rating: 4.8,
    reviews: 97,
    sold: 289,
    badge: "Novo",
    image: image("photo-1596462502278-27bfdc403348"),
    description:
      "Tapete confortável para yoga, alongamento e exercícios em casa.",
    shipping: "Envio grátis",
  },
  {
    id: 27,
    name: "Mochila Daily Tech",
    category: "Acessórios",
    price: 2490,
    oldPrice: 3390,
    rating: 4.9,
    reviews: 134,
    sold: 341,
    badge: "Mais vendido",
    image: image("photo-1511988617509-a57c8a288659"),
    description:
      "Mochila urbana com espaço para computador, acessórios e objetos do dia a dia.",
    shipping: "Entrega rápida",
  },
  {
    id: 28,
    name: "Fone Mini Buds",
    category: "Tecnologia",
    price: 1490,
    oldPrice: 2190,
    rating: 4.8,
    reviews: 164,
    sold: 452,
    badge: "Oferta",
    image: image("photo-1494438639946-1ebd1d20bf85"),
    description:
      "Fones compactos sem fios com estojo portátil e conexão rápida.",
    colors: ["Preto", "Branco"],
    shipping: "Envio grátis",
  },
];

const categories = [
  { name: "Todos", icon: <Grid2X2 className="h-5 w-5" /> },
  { name: "Moda", icon: <Sparkles className="h-5 w-5" /> },
  { name: "Beleza", icon: <Gift className="h-5 w-5" /> },
  { name: "Calçados", icon: <ShoppingBag className="h-5 w-5" /> },
  { name: "Tecnologia", icon: <Zap className="h-5 w-5" /> },
  { name: "Casa", icon: <Home className="h-5 w-5" /> },
  { name: "Acessórios", icon: <Tag className="h-5 w-5" /> },
  { name: "Joias", icon: <Crown className="h-5 w-5" /> },
  { name: "Desporto", icon: <Flame className="h-5 w-5" /> },
];

const banners = [
  {
    title: "A sua loja. O seu estilo.",
    subtitle: "Produtos selecionados com ofertas especiais todos os dias.",
    button: "Comprar agora",
    image: image("photo-1441986300917-64674bd600d8", 1500),
  },
  {
    title: "Ofertas Prime",
    subtitle: "Até 40% de desconto em produtos selecionados.",
    button: "Ver ofertas",
    image: image("photo-1556742049-0cfed4f6a45d", 1500),
  },
  {
    title: "Tecnologia para o seu dia",
    subtitle: "Descubra acessórios e gadgets que fazem diferença.",
    button: "Explorar tecnologia",
    image: image("photo-1516321318423-f06f85e504b3", 1500),
  },
];

function Rating({
  value,
  reviews,
}: {
  value: number;
  reviews?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-3.5 w-3.5 ${
              index < Math.round(value)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>

      <span className="text-xs font-semibold text-slate-700">
        {value.toFixed(1)}
      </span>

      {reviews !== undefined && (
        <span className="text-xs text-slate-400">
          ({reviews})
        </span>
      )}
    </div>
  );
}

function ProductCard({
  product,
  favorite,
  onFavorite,
  onAdd,
  onOpen,
}: {
  product: Product;
  favorite: boolean;
  onFavorite: () => void;
  onAdd: () => void;
  onOpen: () => void;
}) {
  const discount = product.oldPrice
    ? Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100,
      )
    : 0;

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
      <div
        className="relative aspect-[4/4.7] cursor-pointer overflow-hidden bg-slate-100"
        onClick={onOpen}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}

          {discount > 0 && (
            <span className="flex w-fit items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold text-white">
              <Percent className="h-3 w-3" />
              -{discount}%
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition ${
            favorite
              ? "text-red-500"
              : "text-slate-500 hover:text-red-500"
          }`}
          aria-label="Favoritar"
        >
          <Heart
            className={`h-5 w-5 ${favorite ? "fill-current" : ""}`}
          />
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-16 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAdd();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-orange-500"
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar ao carrinho
          </button>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-orange-500">
            {product.category}
          </span>

          {product.shipping && (
            <span className="text-[10px] font-medium text-emerald-600">
              {product.shipping}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left"
        >
          <h3 className="line-clamp-2 min-h-[42px] text-sm font-bold leading-5 text-slate-900 transition hover:text-orange-500">
            {product.name}
          </h3>
        </button>

        <Rating value={product.rating} reviews={product.reviews} />

        <div className="flex items-end justify-between gap-2 pt-1">
          <div>
            {product.oldPrice && (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}

            <p className="text-xl font-black tracking-tight text-slate-950">
              {formatPrice(product.price)}
            </p>
          </div>

          <span className="text-[10px] text-slate-400">
            {product.sold} vendidos
          </span>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-800 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white lg:hidden"
        >
          <ShoppingCart className="h-4 w-4" />
          Adicionar
        </button>
      </div>
    </article>
  );
}

function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product, quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid lg:grid-cols-2">
          <div className="bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full min-h-[400px] w-full object-cover"
            />
          </div>

          <div className="space-y-6 p-6 md:p-9">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                {product.category}
              </span>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {product.name}
              </h2>

              <div className="mt-3">
                <Rating
                  value={product.rating}
                  reviews={product.reviews}
                />
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-500">
              {product.description}
            </p>

            <div className="flex items-end gap-3">
              {product.oldPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}

              <span className="text-3xl font-black text-slate-950">
                {formatPrice(product.price)}
              </span>
            </div>

            {product.colors && (
              <div>
                <p className="mb-3 text-sm font-bold text-slate-900">
                  Cor
                </p>

                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                        selectedColor === color
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 text-slate-700 hover:border-slate-950"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && (
              <div>
                <p className="mb-3 text-sm font-bold text-slate-900">
                  Tamanho
                </p>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-xs font-bold transition ${
                        selectedSize === size
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-slate-200 text-slate-700 hover:border-orange-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
              <span className="text-sm font-bold text-slate-900">
                Quantidade
              </span>

              <div className="flex items-center rounded-xl bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="flex h-10 w-10 items-center justify-center"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="w-10 text-center text-sm font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex h-10 w-10 items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAdd(product, quantity)}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 py-4 text-sm font-black text-white transition hover:bg-orange-500"
            >
              <ShoppingCart className="h-5 w-5" />
              Adicionar ao carrinho
            </button>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-5">
              <div className="text-center">
                <Truck className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                <p className="text-[10px] font-bold text-slate-800">
                  Entrega
                </p>
              </div>

              <div className="text-center">
                <ShieldCheck className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                <p className="text-[10px] font-bold text-slate-800">
                  Compra segura
                </p>
              </div>

              <div className="text-center">
                <BadgeCheck className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                <p className="text-[10px] font-bold text-slate-800">
                  Produto verificado
                </p>
              </div>
            </div>

            {selectedColor && (
              <p className="text-xs text-slate-400">
                Cor selecionada: {selectedColor}
                {selectedSize ? ` · Tamanho: ${selectedSize}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
  onQuantity,
  onCheckout,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onQuantity: (id: number, amount: number) => void;
  onCheckout: () => void;
}) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Seu carrinho
            </h2>
            <p className="text-xs text-slate-400">
              {items.length} {items.length === 1 ? "produto" : "produtos"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <ShoppingCart className="h-8 w-8 text-slate-400" />
              </div>

              <h3 className="mt-5 text-lg font-black text-slate-900">
                O seu carrinho está vazio
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                Adicione alguns produtos e eles aparecerão aqui.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl bg-slate-50 p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
                        {item.name}
                      </h3>

                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.category}
                    </p>

                    <p className="mt-2 font-black text-slate-950">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-2 flex w-fit items-center rounded-lg bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => onQuantity(item.id, -1)}
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="w-8 text-center text-xs font-bold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onQuantity(item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 p-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Entrega</span>
                <span>
                  {shipping === 0 ? "Grátis" : formatPrice(shipping)}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-black text-slate-950">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-sm font-black text-white transition hover:bg-orange-600"
            >
              Finalizar compra
              <ArrowRight className="h-4 w-4" />
            </button>

            {subtotal < 5000 && (
              <p className="mt-3 text-center text-[11px] text-slate-400">
                Adicione mais {formatPrice(5000 - subtotal)} para ganhar
                envio grátis.
              </p>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

function CheckoutModal({
  open,
  total,
  onClose,
  onComplete,
}: {
  open: boolean;
  total: number;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    payment: "mpesa",
  });

  if (!open) return null;

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const next = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
              Prime Checkout
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              Finalizar compra
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step < 3 && (
          <div className="flex items-center gap-2 px-6 pt-5">
            {[1, 2].map((item) => (
              <div key={item} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                    step >= item
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {item}
                </div>

                {item === 1 && (
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      step >= 2 ? "bg-slate-950" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Nome completo
                </label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Digite o seu nome"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Telefone
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+258 84 000 0000"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Morada
                </label>
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Rua, avenida ou referência"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Cidade
                </label>
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Cidade"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-orange-500"
                />
              </div>

              <button
                type="button"
                onClick={next}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-4 text-sm font-black text-white"
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-black text-slate-950">
                  Método de pagamento
                </p>

                <div className="grid gap-3">
                  {[
                    {
                      id: "mpesa",
                      title: "M-Pesa",
                      subtitle: "Pagamento móvel",
                    },
                    {
                      id: "emola",
                      title: "e-Mola",
                      subtitle: "Pagamento móvel",
                    },
                    {
                      id: "card",
                      title: "Cartão",
                      subtitle: "Visa ou Mastercard",
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => update("payment", method.id)}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                        form.payment === method.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                          {method.id === "card" ? (
                            <CreditCard className="h-5 w-5" />
                          ) : (
                            <Phone className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {method.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {method.subtitle}
                          </p>
                        </div>
                      </div>

                      {form.payment === method.id && (
                        <Check className="h-5 w-5 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Total da compra</span>
                  <span className="font-black text-slate-950">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={next}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-black text-white disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Confirmar pedido
                    <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <Check className="h-10 w-10 text-emerald-500" />
              </div>

              <h3 className="mt-6 text-2xl font-black text-slate-950">
                Pedido recebido!
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                O seu pedido foi registado. Em uma integração real,
                o pagamento e o acompanhamento seriam processados pelo
                sistema da loja.
              </p>

              <button
                type="button"
                onClick={onComplete}
                className="mt-7 rounded-xl bg-slate-950 px-7 py-3 text-sm font-bold text-white"
              >
                Voltar para a loja
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceBar() {
  const services = [
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Entrega rápida",
      text: "Receba sem complicações",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Compra segura",
      text: "Seus dados protegidos",
    },
    {
      icon: <BadgeCheck className="h-5 w-5" />,
      title: "Produtos verificados",
      text: "Qualidade selecionada",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Suporte",
      text: "Estamos aqui para ajudar",
    },
  ];

  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {services.map((service) => (
          <div
            key={service.title}
            className="flex items-center gap-3 border-b border-slate-100 px-4 py-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              {service.icon}
            </div>

            <div>
              <p className="text-xs font-black text-slate-900">
                {service.title}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {service.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) return;

    setSent(true);
    setEmail("");
  };

  return (
    <section className="bg-slate-950 px-4 py-14 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            Prime Club
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Ofertas especiais direto no seu e-mail.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Receba novidades, lançamentos e oportunidades selecionadas
            antes de todo mundo.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Seu melhor e-mail"
              className="h-12 w-full rounded-xl bg-white pl-11 pr-4 text-sm text-slate-900 outline-none"
            />
          </div>

          <button
            type="submit"
            className="h-12 rounded-xl bg-orange-500 px-6 text-sm font-black transition hover:bg-orange-600"
          >
            {sent ? "Inscrito!" : "Quero receber"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function PrimeStorefront({
  mode = "demo",
  store,
  products,
}: PrimeStorefrontProps) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(7000);
  const [toast, setToast] = useState("");

  const storeName = store?.name || "Prime";

  const realProducts = useMemo<Product[]>(() => {
    if (mode !== "store" || !products?.length) {
      return demoProducts;
    }

    return products.map((product, index) => ({
      id:
        typeof product.id === "number"
          ? product.id
          : Number(product.id) || index + 1000,
      name: product.name,
      category: product.category || "Produtos",
      price: product.priceMzn,
      oldPrice: product.compareAtPriceMzn || undefined,
      rating: 4.8,
      reviews: 0,
      sold: 0,
      image:
        product.imageUrl ||
        image("photo-1441986300917-64674bd600d8"),
      description:
        "Produto disponível nesta loja Prime.",
      shipping: "Entrega rápida",
    }));
  }, [mode, products]);

  const filteredProducts = useMemo(() => {
    let result = [...realProducts];

    if (category !== "Todos") {
      result = result.filter(
        (product) => product.category === category,
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      );
    }

    result = result.filter((product) => product.price <= maxPrice);

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "new") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [realProducts, category, search, maxPrice, sort]);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const addToCart = (product: Product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity,
        },
      ];
    });

    setCartOpen(true);
    setSelectedProduct(null);
    setToast(`${product.name} foi adicionado ao carrinho.`);

    window.setTimeout(() => setToast(""), 2600);
  };

  const removeFromCart = (id: number) => {
    setCart((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  const changeQuantity = (id: number, amount: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + amount,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBannerIndex((current) => (current + 1) % banners.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mobileMenu) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenu(false);
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [mobileMenu]);

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-slate-950">
      <div className="bg-slate-950 px-4 py-2 text-center text-[11px] font-semibold text-white">
        <span className="inline-flex items-center gap-2">
          <Truck className="h-3.5 w-3.5 text-orange-400" />
          Frete grátis em compras selecionadas
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            Ofertas especiais todos os dias
          </span>
        </span>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenu(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setCategory("Todos");
                setSearch("");
                window.scrollTo({ top: 0, behavior: "smooth" });
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
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") scrollToProducts();
                }}
                placeholder="O que você está procurando?"
                className="h-12 w-full rounded-xl bg-slate-100 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
              <button
                type="button"
                className="hidden h-11 w-11 items-center justify-center rounded-xl transition hover:bg-slate-100 sm:flex"
              >
                <UserRound className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-xl transition hover:bg-slate-100"
              >
                <Heart className="h-5 w-5" />

                {favorites.length > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-orange-500"
              >
                <ShoppingCart className="h-5 w-5" />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-black text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar produtos..."
                className="h-11 w-full rounded-xl bg-slate-100 pl-11 pr-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <nav className="hidden items-center gap-7 overflow-x-auto pb-3 lg:flex">
            {categories.slice(0, 7).map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setCategory(item.name);
                  scrollToProducts();
                }}
                className={`flex shrink-0 items-center gap-2 text-xs font-bold transition ${
                  category === item.name
                    ? "text-orange-500"
                    : "text-slate-600 hover:text-orange-500"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setCategory("Todos");
                setMaxPrice(5000);
                scrollToProducts();
              }}
              className="ml-auto flex shrink-0 items-center gap-2 text-xs font-black text-orange-500"
            >
              <BadgePercent className="h-4 w-4" />
              Ofertas
            </button>
          </nav>
        </div>
      </header>

      {mobileMenu && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setMobileMenu(false)}
          />

          <aside className="relative h-full w-[86%] max-w-sm bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Store className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-black">{storeName}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-500">
                    Prime Store
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenu(false)}
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
                {categories.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setCategory(item.name);
                      setMobileMenu(false);
                      window.setTimeout(scrollToProducts, 100);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-100"
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-white">
              <Sparkles className="h-6 w-6 text-orange-400" />
              <h3 className="mt-3 font-black">
                Ofertas Prime
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Descubra produtos selecionados com condições especiais.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMaxPrice(3000);
                  setMobileMenu(false);
                  window.setTimeout(scrollToProducts, 100);
                }}
                className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-xs font-black"
              >
                Ver ofertas
              </button>
            </div>
          </aside>
        </div>
      )}

      <main>
        <section className="relative overflow-hidden bg-slate-950">
          <div className="relative mx-auto min-h-[480px] max-w-[1600px]">
            {banners.map((banner, index) => (
              <div
                key={banner.title}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === bannerIndex
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <img
                  src={banner.image}
                  alt=""
                  className="h-full min-h-[480px] w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/10" />

                <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-5 md:px-8">
                  <div className="max-w-xl text-white">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                      Coleção Prime
                    </div>

                    <h1 className="text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
                      {banner.title}
                    </h1>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 md:text-base">
                      {banner.subtitle}
                    </p>

                    <button
                      type="button"
                      onClick={scrollToProducts}
                      className="mt-7 inline-flex items-center gap-3 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-black transition hover:bg-orange-600"
                    >
                      {banner.button}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-7 left-0 right-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
              <div className="flex gap-2">
                {banners.map((banner, index) => (
                  <button
                    key={banner.title}
                    type="button"
                    onClick={() => setBannerIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === bannerIndex
                        ? "w-10 bg-orange-500"
                        : "w-5 bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setBannerIndex(
                      (current) =>
                        (current - 1 + banners.length) %
                        banners.length,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setBannerIndex(
                      (current) => (current + 1) % banners.length,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <ServiceBar />

        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                Explore
              </span>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                Compre por categoria
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setCategory("Todos");
                scrollToProducts();
              }}
              className="hidden items-center gap-1 text-xs font-bold text-slate-500 hover:text-orange-500 sm:flex"
            >
              Ver tudo
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setCategory(item.name);
                  scrollToProducts();
                }}
                className={`flex min-w-[120px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl px-4 py-5 transition ${
                  category === item.name
                    ? "bg-slate-950 text-white shadow-xl"
                    : "bg-white text-slate-600 shadow-sm hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    category === item.name
                      ? "bg-white/10 text-orange-400"
                      : "bg-orange-50 text-orange-500"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="text-xs font-bold">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section
          id="products"
          className="mx-auto max-w-7xl scroll-mt-32 px-4 pb-16"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                    Seleção Prime
                  </span>
                </div>

                <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                  Produtos em destaque
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {filteredProducts.length} produtos encontrados
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters((value) => !value)}
                  className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition ${
                    showFilters
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </button>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-9 text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="featured">Destaques</option>
                    <option value="new">Mais recentes</option>
                    <option value="rating">Melhor avaliados</option>
                    <option value="price-low">Menor preço</option>
                    <option value="price-high">Maior preço</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                </div>

                <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white sm:flex">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`flex h-10 w-10 items-center justify-center ${
                      view === "grid"
                        ? "bg-slate-950 text-white"
                        : "text-slate-400"
                    }`}
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`flex h-10 w-10 items-center justify-center ${
                      view === "list"
                        ? "bg-slate-950 text-white"
                        : "text-slate-400"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <p className="mb-3 text-xs font-black text-slate-900">
                      Categoria
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {categories.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setCategory(item.name)}
                          className={`rounded-lg px-3 py-2 text-[11px] font-bold ${
                            category === item.name
                              ? "bg-orange-500 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <p className="text-xs font-black text-slate-900">
                        Preço máximo
                      </p>
                      <span className="text-xs font-bold text-orange-500">
                        {formatPrice(maxPrice)}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="250"
                      value={maxPrice}
                      onChange={(event) =>
                        setMaxPrice(Number(event.target.value))
                      }
                      className="mt-5 w-full accent-orange-500"
                    />

                    <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                      <span>500 MT</span>
                      <span>10.000 MT</span>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        setCategory("Todos");
                        setMaxPrice(7000);
                        setSearch("");
                        setSort("featured");
                      }}
                      className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-600"
                    >
                      Limpar filtros
                    </button>
                  </div>
                </div>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl bg-white py-20 text-center">
                <Search className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-4 text-xl font-black">
                  Nenhum produto encontrado
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Tente outra pesquisa ou remova alguns filtros.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("Todos");
                    setMaxPrice(7000);
                  }}
                  className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white"
                >
                  Limpar pesquisa
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    favorite={favorites.includes(product.id)}
                    onFavorite={() => toggleFavorite(product.id)}
                    onAdd={() => addToCart(product)}
                    onOpen={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col gap-5 rounded-2xl bg-white p-4 shadow-sm sm:flex-row"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-48 w-full rounded-xl object-cover sm:h-40 sm:w-48"
                    />

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                          {product.category}
                        </span>

                        <h3 className="mt-1 text-xl font-black">
                          {product.name}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                          {product.description}
                        </p>

                        <div className="mt-3">
                          <Rating
                            value={product.rating}
                            reviews={product.reviews}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          {product.oldPrice && (
                            <p className="text-xs text-slate-400 line-through">
                              {formatPrice(product.oldPrice)}
                            </p>
                          )}
                          <p className="text-2xl font-black">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => toggleFavorite(product.id)}
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                              favorites.includes(product.id)
                                ? "border-red-200 text-red-500"
                                : "border-slate-200 text-slate-500"
                            }`}
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                favorites.includes(product.id)
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black text-white hover:bg-orange-500"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-7 text-white md:p-10">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">
                  <TicketPercent className="h-3.5 w-3.5" />
                  Oferta especial
                </div>

                <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                  Mais estilo. Mais tecnologia. Mais Prime.
                </h2>

                <p className="mt-3 text-sm leading-6 text-orange-50">
                  Encontre produtos selecionados para deixar o seu dia
                  mais simples, bonito e completo.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMaxPrice(3000);
                  scrollToProducts();
                }}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-orange-600"
              >
                Explorar ofertas
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>

      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Store className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-black">{storeName}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-500">
                    Prime Store
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
                Uma experiência de compra moderna, simples e segura,
                criada para encontrar aquilo que você procura.
              </p>

              <div className="mt-5 flex gap-2">
                {[Instagram, Facebook, MessageCircle].map(
                  (Icon, index) => (
                    <button
                      key={index}
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-950 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black">Comprar</h3>

              <div className="mt-5 space-y-3">
                {[
                  "Novidades",
                  "Mais vendidos",
                  "Ofertas",
                  "Moda",
                  "Tecnologia",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (item === "Moda") setCategory("Moda");
                      else if (item === "Tecnologia")
                        setCategory("Tecnologia");
                      else setCategory("Todos");

                      scrollToProducts();
                    }}
                    className="block text-left text-sm text-slate-500 transition hover:text-orange-500"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black">Atendimento</h3>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-xs font-bold">Telefone</p>
                    <p className="mt-1 text-xs text-slate-400">
                      +258 84 000 0000
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-xs font-bold">E-mail</p>
                    <p className="mt-1 text-xs text-slate-400">
                      suporte@prime.store
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-xs font-bold">Horário</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Segunda a sábado, 08h–18h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black">Segurança</h3>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <Lock className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-600">
                    Pagamento protegido
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-600">
                    Compra segura
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <PackageCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-600">
                    Produtos selecionados
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 md:flex-row">
            <p>
              © {new Date().getFullYear()} {storeName}. Todos os direitos
              reservados.
            </p>

            <div className="flex gap-5">
              <button type="button">Privacidade</button>
              <button type="button">Termos</button>
              <button type="button">Ajuda</button>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onQuantity={changeQuantity}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
        />
      )}

      <CheckoutModal
        open={checkoutOpen}
        total={
          cartTotal >= 5000 || cartTotal === 0
            ? cartTotal
            : cartTotal + 250
        }
        onClose={() => setCheckoutOpen(false)}
        onComplete={() => {
          setCheckoutOpen(false);
          setCart([]);
          setToast("Pedido concluído com sucesso.");
          window.setTimeout(() => setToast(""), 3000);
        }}
      />

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[130] flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl">
          <Check className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}

      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="fixed bottom-5 right-5 z-40 hidden h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-xl ring-1 ring-slate-100 md:flex"
      >
        <ArrowDown className="h-4 w-4 rotate-180" />
      </button>
    </div>
  );
}