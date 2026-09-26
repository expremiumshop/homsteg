export type EssenzaMode = "demo" | "store";

export type EssenzaStore = {
  name: string;
  category?: string | null;
  currency?: string | null;
};

export type EssenzaProduct = {
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

export type EssenzaCategory = {
  name: string;
  icon: string;
};

export type EssenzaRelatedProduct = {
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

export const getEssenzaProductSlug = (
  product: Pick<EssenzaProduct, "slug" | "name">,
) => product.slug?.trim() || slugify(product.name);

export const essenzaDemoProducts: EssenzaProduct[] = [
  {
    id: 1,
    name: "Perfume Essentiel 100ml",
    category: "Beleza",
    price: 4990,
    oldPrice: 6290,
    rating: 4.9,
    reviews: 148,
    sold: 412,
    badge: "Ícone",
    image: image("photo-1541643600914-78b084683601"),
    description:
      "Fragrância sofisticada com notas amadeiradas e fundo âmbar. Composição exclusiva para quem valoriza o essencial.",
    options: [
      {
        name: "Volume",
        values: ["50ml", "100ml"],
      },
    ],
  },
  {
    id: 2,
    name: "Kit Skincare Essencial",
    category: "Beleza",
    price: 3290,
    oldPrice: 4190,
    rating: 4.8,
    reviews: 96,
    sold: 267,
    badge: "Ritual",
    image: image("photo-1556228578-8c89e6adf883"),
    description:
      "Rotina completa em três passos: limpeza, hidratação e proteção. Fórmulas limpas e texturas leves.",
  },
  {
    id: 3,
    name: "Bolsa Minimal Structure",
    category: "Acessórios",
    price: 5490,
    rating: 4.9,
    reviews: 74,
    sold: 158,
    badge: "Novo",
    image: image("photo-1515562141207-7a88fb7ce338"),
    description:
      "Silhueta estruturada em couro de origem responsável. Design atemporal para todas as estações.",
    options: [
      {
        name: "Cor",
        values: ["Preto", "Castanho", "Areia"],
      },
    ],
  },
  {
    id: 4,
    name: "Vestido Lino Sereno",
    category: "Moda",
    price: 4290,
    oldPrice: 5290,
    rating: 4.8,
    reviews: 112,
    sold: 231,
    badge: "Seleção",
    image: image("photo-1524805444758-089113d48a6d"),
    description:
      "Linho natural com caimento fluido e acabamento artesanal. Peça essencial para um guarda-roupa consciente.",
    options: [
      {
        name: "Tamanho",
        values: ["S", "M", "L", "XL"],
      },
    ],
  },
  {
    id: 5,
    name: "Camisa Popeline Essential",
    category: "Moda",
    price: 2290,
    rating: 4.7,
    reviews: 88,
    sold: 194,
    image: image("photo-1521572163474-6864f9cf17ab"),
    description:
      "Popeline de algodão egípcio com corte clássico. A base de qualquer vestimenta elegante.",
    options: [
      {
        name: "Tamanho",
        values: ["S", "M", "L", "XL", "XXL"],
      },
      {
        name: "Cor",
        values: ["Branco", "Preto", "Azul-noite"],
      },
    ],
  },
  {
    id: 6,
    name: "Relógio Monolith Steel",
    category: "Acessórios",
    price: 7890,
    oldPrice: 9490,
    rating: 4.9,
    reviews: 61,
    sold: 127,
    badge: "Ícone",
    image: image("photo-1523275335684-37898b6baf30"),
    description:
      "Caixa em aço escovado, mostrador minimalista e movimento de precisão. Presença silenciosa e definitiva.",
  },
  {
    id: 7,
    name: "Colar Linha Pura",
    category: "Joias",
    price: 2490,
    oldPrice: 3190,
    rating: 4.8,
    reviews: 57,
    sold: 143,
    image: image("photo-1483985988355-763728e1935b"),
    description:
      "Corrente fina em banho de ouro 18k com pingente geométrico. Delicadeza para o dia a dia.",
  },
  {
    id: 8,
    name: "Brincos Gota Cristal",
    category: "Joias",
    price: 1890,
    rating: 4.9,
    reviews: 43,
    sold: 98,
    badge: "Seleção",
    image: image("photo-1595777457583-95e059d581b8"),
    description:
      "Cristais lapidados em formato de gota com fecho seguro. Elegância discreta para ocasiões especiais.",
  },
  {
    id: 9,
    name: "Luminária Silhouette",
    category: "Casa",
    price: 3690,
    rating: 4.7,
    reviews: 52,
    sold: 117,
    image: image("photo-1599643478518-a784e5dc4c8f"),
    description:
      "Design escultórico com luz difusa e regulagem por toque. Cria atmosfera em qualquer ambiente.",
  },
  {
    id: 10,
    name: "Garrafa Thermal Noir",
    category: "Casa",
    price: 1290,
    oldPrice: 1690,
    rating: 4.8,
    reviews: 134,
    sold: 342,
    image: image("photo-1594035910387-fea47794261f"),
    description:
      "Aço inoxidable com parede dupla a vácuo. Mantém a temperatura por 24 horas. Acabamento fosco premium.",
    options: [
      {
        name: "Cor",
        values: ["Preto", "Prata", "Verde-sálvia"],
      },
    ],
  },
  {
    id: 11,
    name: "Camisola Knit Quiet",
    category: "Moda",
    price: 2990,
    oldPrice: 3790,
    rating: 4.8,
    reviews: 79,
    sold: 186,
    badge: "Novo",
    image: image("photo-1591369822096-ffd140ec948f"),
    description:
      "Tricô de lã merino com textura suave e corte relaxado. Conforto discreto para dias frios.",
    options: [
      {
        name: "Tamanho",
        values: ["S", "M", "L", "XL"],
      },
    ],
  },
  {
    id: 12,
    name: "Óculos Linear Sun",
    category: "Acessórios",
    price: 2790,
    rating: 4.7,
    reviews: 66,
    sold: 152,
    image: image("photo-1511499767150-a48a237f0083"),
    description:
      "Armação em acetato italiano com lentes polarizadas. Linhas limpas que complementam qualquer visual.",
  },
];

export const essenzaDemoCategories: EssenzaCategory[] = [
  { name: "Moda", icon: "shirt" },
  { name: "Beleza", icon: "sparkles" },
  { name: "Acessórios", icon: "watch" },
  { name: "Joias", icon: "gem" },
  { name: "Casa", icon: "home" },
];

export const essenzaDemoBanners = [
  {
    title: "O essencial é suficiente",
    subtitle:
      "Peças selecionadas com design atemporal e materiais honestos.",
    button: "Descobrir coleção",
    image: image("photo-1441986300917-64674bd600d8", 1500),
  },
  {
    title: "Nova coleção Sereno",
    subtitle:
      "Linho, algodão e silhuetas limpas para todas as estações.",
    button: "Ver coleção",
    image: image("photo-1490481651871-ab68de25d43d", 1500),
  },
  {
    title: "Beleza consciente",
    subtitle:
      "Fórmulas limpas, embalagens responsáveis e rituais simples.",
    button: "Explorar beleza",
    image: image("photo-1487222477894-8943e31ef7b2", 1500),
  },
];

export const essenzaDemoTopBenefits = [
  { icon: "truck", title: "Entrega em 24h", text: "Principais cidades" },
  { icon: "shield", title: "Compra segura", text: "Pagamento protegido" },
  { icon: "refresh", title: "Troca em 7 dias", text: "Sem complicações" },
  { icon: "headphones", title: "Atendimento dedicado", text: "Equipa especializada" },
];

export const essenzaDemoPromotion = {
  title: "Coleção Essencial",
  subtitle:
    "Peças permanentes com preço justo, sempre disponíveis. Menos, mas melhor.",
  cta: "Ver coleção",
};

export const essenzaPopularSearches = [
  "Perfume",
  "Linho",
  "Colar",
  "Skincare",
  "Novidades",
];

export const essenzaFreeShippingThreshold = 5000;
