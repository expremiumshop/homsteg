export type UrbanMode = "demo" | "store";

export type UrbanStore = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  category?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  description?: string | null;
};

export type UrbanProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  badge?: string;
  slug?: string;
  description?: string | null;
  stock?: number;
};

export type UrbanRelatedProduct = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string | null;
};

export type UrbanCategory = {
  name: string;
  image: string;
};

export const urbanDemoStore: UrbanStore = {
  name: "Urban",
  slug: "urban",
  description:
    "Descubra uma seleção moderna de produtos para o seu estilo.",
};

export const urbanDemoProducts: UrbanProduct[] = [
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

export const urbanDemoCategories: UrbanCategory[] = [
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

export const urbanProductFilters = [
  "Todos",
  "Moda",
  "Calçados",
  "Acessórios",
];

export const urbanPopularSearches = [
  "Tênis",
  "Jaquetas",
  "Acessórios",
  "Novidades",
  "Ofertas",
];

export const urbanMenuItems = [
  "Início",
  "Loja",
  "Novidades",
  "Ofertas",
  "Sobre nós",
  "Contacto",
];

export const urbanBenefits = [
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

export const formatPrice = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatPriceMzn = (value: number) => {
  return `${Number(value ?? 0).toLocaleString("pt-MZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} MT`;
};

export const slugify = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const getUrbanProductSlug = (product: Pick<UrbanProduct, "slug" | "name">) => {
  return product.slug?.trim() || slugify(product.name);
};
