export type PrimeMode = "demo" | "store";

export type PrimeStore = {
  name: string;
  currency?: string | null;
};

export type PrimeProduct = {
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
  slug?: string;
  stock?: number;
  images?: string[];
  options?: {
    name: string;
    values: string[];
  }[];
};

export type PrimeCategory = {
  name: string;
  icon: string;
};

export type PrimeRelatedProduct = {
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

export const getPrimeProductSlug = (
  product: Pick<PrimeProduct, "slug" | "name">,
) => product.slug?.trim() || slugify(product.name);

export const primeDemoProducts: PrimeProduct[] = [
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
    shipping: "Envio rápida",
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
    shipping: "Envio rápida",
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

export const primeCategories = [
  "Todos",
  "Moda",
  "Beleza",
  "Calçados",
  "Tecnologia",
  "Casa",
  "Acessórios",
  "Joias",
  "Desporto",
];

export const primeBanners = [
  {
    title: "A sua loja. O seu estilo.",
    subtitle:
      "Produtos selecionados com ofertas especiais todos os dias.",
    button: "Comprar agora",
    image: image("photo-1441986300917-64674bd600d8", 1500),
  },
  {
    title: "Ofertas Prime",
    subtitle:
      "Até 40% de desconto em produtos selecionados.",
    button: "Ver ofertas",
    image: image("photo-1556742049-0cfed4f6a45d", 1500),
  },
  {
    title: "Tecnologia para o seu dia",
    subtitle:
      "Descubra acessórios e gadgets que fazem diferença.",
    button: "Explorar tecnologia",
    image: image("photo-1516321318423-f06f85e504b3", 1500),
  },
];

export const primePopularSearches = [
  "Tênis",
  "Smartwatch",
  "Perfume",
  "Headphones",
  "Ofertas",
];

export const primeMenuItems = [
  "Início",
  "Loja",
  "Novidades",
  "Ofertas",
  "Sobre nós",
  "Contacto",
];

export const primeFreeShippingThreshold = 5000;
export const primeShippingFee = 250;
