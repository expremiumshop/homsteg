export type LuxeMode = "demo" | "store";

export type LuxeStore = {
  name: string;
  currency?: string | null;
  slug?: string | null;
};

export type StoreProduct = {
  id: number | string;
  slug?: string | null;
  description?: string | null;
  name: string;
  category?: string | null;
  priceMzn: number;
  compareAtPriceMzn?: number | null;
  imageUrl?: string | null;
};

export type LuxeProduct = {
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
  slug?: string;
  description?: string | null;
  stock?: number;
};

export type LuxeFlashProduct = {
  name: string;
  price: string;
  oldPrice: string;
  discount: string;
  sold: string;
  image: string;
};

export type LuxeCategoryCard = {
  name: string;
  count: string;
  image: string;
};

export type LuxeBrand = {
  name: string;
  text: string;
  image: string;
};

export type LuxeRelatedProduct = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string | null;
};

export const formatPrice = (amount: number) =>
  `${new Intl.NumberFormat("pt-MZ").format(amount)} MT`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getLuxeProductSlug = (
  product: Pick<LuxeProduct, "slug" | "name">,
) => product.slug?.trim() || slugify(product.name);

export const demoCategories = [
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

export const demoProducts: LuxeProduct[] = [
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

export const brands: LuxeBrand[] = [
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

export const categoryCards: LuxeCategoryCard[] = [
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

export const demoFlashProducts: LuxeFlashProduct[] = [
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
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
  },
];

export const promoCards = [
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

export const footerColumns = [
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
