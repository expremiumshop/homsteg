export type MarketMode = "demo" | "store";

export type MarketStore = {
  name: string;
  category?: string | null;
  currency?: string | null;
};

export type MarketProduct = {
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
  slug?: string;
  stock?: number;
  images?: string[];
  options?: {
    name: string;
    values: string[];
  }[];
};

export type MarketCategory = {
  name: string;
  icon: string;
};

export type MarketRelatedProduct = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string | null;
};

export const image = (
  id: string,
  width = 900,
) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=88`;

export const formatPrice = (value: number) =>
  `${new Intl.NumberFormat("pt-MZ").format(value)} MT`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getMarketProductSlug = (
  product: Pick<MarketProduct, "slug" | "name">,
) => product.slug?.trim() || slugify(product.name);

export const marketDemoProducts: MarketProduct[] = [
  {
    id: 1,
    name: "Smartphone Galaxy Nova",
    category: "Eletrónica",
    price: 18990,
    oldPrice: 21990,
    rating: 4.8,
    reviews: 132,
    sold: 341,
    badge: "Oferta",
    image: image("photo-1511707171634-5f897ff02aa9"),
    description:
      "Smartphone potente com câmara de alta resolução, bateria de longa duração e ecrã imersivo.",
    options: [
      {
        name: "Cor",
        values: ["Preto", "Prata", "Azul"],
      },
      {
        name: "Armazenamento",
        values: ["128GB", "256GB"],
      },
    ],
  },
  {
    id: 2,
    name: "Ténis Runner Flex",
    category: "Desporto",
    price: 3990,
    oldPrice: 4890,
    rating: 4.7,
    reviews: 98,
    sold: 264,
    badge: "Mais vendido",
    image: image("photo-1542291026-7eec264c27ff"),
    description:
      "Ténis de corrida leves e confortáveis com entressola amortecedora para o dia inteiro.",
    options: [
      {
        name: "Tamanho",
        values: ["38", "39", "40", "41", "42", "43"],
      },
    ],
  },
  {
    id: 3,
    name: "Mochila Urbana 30L",
    category: "Acessórios",
    price: 2490,
    rating: 4.9,
    reviews: 76,
    sold: 189,
    badge: "Novo",
    image: image("photo-1553062407-98eeb64c6a62"),
    description:
      "Mochila espaçosa com compartimento acolchoado para portátil e bolsos organizadores.",
  },
  {
    id: 4,
    name: "Fones Bluetooth Pro",
    category: "Eletrónica",
    price: 3290,
    oldPrice: 3990,
    rating: 4.8,
    reviews: 211,
    sold: 603,
    badge: "Oferta",
    image: image("photo-1505740420928-5e560c06d30e"),
    description:
      "Áudio imersivo com cancelamento ativo de ruído e bateria para 30 horas de música.",
    options: [
      {
        name: "Cor",
        values: ["Preto", "Branco"],
      },
    ],
  },
  {
    id: 5,
    name: "Camisa Casual Slim",
    category: "Moda",
    price: 1490,
    rating: 4.6,
    reviews: 64,
    sold: 148,
    badge: "Popular",
    image: image("photo-1521572163474-6864f9cf17ab"),
    description:
      "Camisa de algodão com corte moderno, ideal para o trabalho e para ocasiões casuais.",
    options: [
      {
        name: "Tamanho",
        values: ["S", "M", "L", "XL"],
      },
    ],
  },
  {
    id: 6,
    name: "Cafeteira Elétrica",
    category: "Casa",
    price: 2790,
    rating: 4.7,
    reviews: 89,
    sold: 176,
    badge: "Casa",
    image: image("photo-1517668808822-9ebb02f2a0e6"),
    description:
      "Café perfeito todas as manhãs com filtro reutilizável e desligamento automático.",
  },
  {
    id: 7,
    name: "Relógio Sport Steel",
    category: "Acessórios",
    price: 3490,
    oldPrice: 4190,
    rating: 4.8,
    reviews: 57,
    sold: 132,
    badge: "Oferta",
    image: image("photo-1524805444758-089113d48a6d"),
    description:
      "Relógio resistente à água com bracelete de aço e movimento de precisão.",
  },
  {
    id: 8,
    name: "Lâmpada LED Inteligente",
    category: "Casa",
    price: 1190,
    rating: 4.5,
    reviews: 143,
    sold: 398,
    image: image("photo-1507473885765-e6ed057f782c"),
    description:
      "Controlo por aplicação e 16 milhões de cores para criar o ambiente perfeito.",
  },
  {
    id: 9,
    name: "Teclado Mechanical Pro",
    category: "Eletrónica",
    price: 2190,
    oldPrice: 2990,
    rating: 4.8,
    reviews: 118,
    sold: 273,
    badge: "Oferta",
    image: image("photo-1552346154-21d32810aba3"),
    description:
      "Teclado mecânico com resposta rápida e estética premium para o seu setup.",
  },
  {
    id: 10,
    name: "Vestido Midi Verão",
    category: "Moda",
    price: 1990,
    oldPrice: 2690,
    rating: 4.9,
    reviews: 82,
    sold: 205,
    badge: "Novo",
    image: image("photo-1595777457583-95e059d581b8"),
    description:
      "Vestido midi leve com estampado exclusivo, perfeito para os dias quentes.",
    options: [
      {
        name: "Tamanho",
        values: ["S", "M", "L", "XL"],
      },
    ],
  },
  {
    id: 11,
    name: "Kit Halteres Ajustáveis",
    category: "Desporto",
    price: 4590,
    rating: 4.7,
    reviews: 44,
    sold: 96,
    badge: "Top",
    image: image("photo-1535632066927-ab7c9ab60908"),
    description:
      "Kit de halteres ajustáveis de 2 a 20 kg para treino de força em casa.",
  },
  {
    id: 12,
    name: "Aspirador Robô Clean",
    category: "Casa",
    price: 8990,
    oldPrice: 10990,
    rating: 4.6,
    reviews: 67,
    sold: 141,
    badge: "Oferta",
    image: image("photo-1558317374-067fb5f30001"),
    description:
      "Aspirador robô com navegação inteligente e controlo por aplicação.",
  },
];

export const marketDemoCategories: MarketCategory[] = [
  { name: "Eletrónica", icon: "smartphone" },
  { name: "Moda", icon: "shirt" },
  { name: "Casa", icon: "home" },
  { name: "Acessórios", icon: "watch" },
  { name: "Desporto", icon: "dumbbell" },
];

export const marketDemoBanners = [
  {
    title: "Tudo o que precisa, num só lugar",
    subtitle:
      "Milhares de produtos com entrega em todo o país.",
    button: "Ver ofertas",
    image: image("photo-1607082348824-0a96f2a4b9da", 1500),
  },
  {
    title: "Super Mercado da Semana",
    subtitle:
      "Descontos semanais nas melhores marcas até 50%.",
    button: "Aproveitar",
    image: image("photo-1472851294608-062f824d29cc", 1500),
  },
  {
    title: "Entregas em 24 horas",
    subtitle:
      "Nas principais cidades, com acompanhamento do pedido.",
    button: "Comprar agora",
    image: image("photo-1556742049-0cfed4f6a45d", 1500),
  },
];

export const marketDemoTopBenefits = [
  { icon: "truck", title: "Entrega em horas", text: "Nas principais cidades" },
  { icon: "shield", title: "Pagamento seguro", text: "M-Pesa, e-Mola e cartão" },
  { icon: "refresh", title: "Devoluções fáceis", text: "Até 7 dias" },
  { icon: "headphones", title: "Suporte dedicado", text: "Atendimento humano" },
];

export const marketDemoPromotion = {
  title: "Mega Liquidação Market",
  subtitle:
    "Até 50% de desconto em categorias selecionadas. Aproveite antes que acabe!",
  cta: "Ver promoções",
};

export const marketPopularSearches = [
  "Smartphone",
  "Ténis",
  "Fones",
  "Casa",
  "Ofertas",
];

export const marketFreeShippingThreshold = 5000;
