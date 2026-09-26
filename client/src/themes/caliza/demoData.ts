export type CalizaMode = "demo" | "store";

export type CalizaStore = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  category?: string | null;
  currency?: string | null;
  status?: string | null;
  whatsapp?: string | null;
};

export type CalizaProduct = {
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  stock: number;
  category: string;
  featured?: boolean;
  image?: string | null;
};

export type CalizaBanner = {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
};

export type CalizaBenefit = {
  title: string;
};

export type CalizaPromotion = {
  title: string;
  subtitle: string;
  cta: string;
};

export type CalizaRelatedProduct = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string | null;
};

export type CalizaCategory = {
  id: string | number;
  name: string;
};

/* ============================================================
   DADOS DE DEMONSTRAÇÃO — CALIZA STUDIO
   ============================================================ */

export const calizaDemoStore = {
  name: "Caliza Studio",
  category: "Moderno",
  currency: "MZN",
  country: "Moçambique",
};

export const calizaDemoCategories = [
  "Todos",
  "Moda",
  "Acessórios",
  "Casa",
  "Arte",
  "Cerâmica",
];

export const calizaDemoBanners: CalizaBanner[] = [
  {
    title: "Beleza esculpida no simples",
    subtitle: "Objetos e peças com alma de atelier.",
    cta: "Conhecer o studio",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Terracota & Cal",
    subtitle: "Uma paleta inspirada na paisagem mediterrânica.",
    cta: "Ver peças",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
  },
];

export const calizaDemoTopBenefits: CalizaBenefit[] = [
  { title: "Peças de autor" },
  { title: "Edições limitadas" },
  { title: "Embalagem de presente" },
];

export const calizaDemoPromotion: CalizaPromotion = {
  title: "Colecção Pedra Branca",
  subtitle: "Cerâmica artesanal em edição limitada.",
  cta: "Ver colecção",
};

export const calizaDemoProducts: CalizaProduct[] = [
  {
    id: 1,
    name: "Vaso Terracota Artesanal",
    slug: "vaso-terracota-artesanal",
    description: "Cerâmica torrada à mão, acabamento mate.",
    price: 3490,
    stock: 10,
    category: "Cerâmica",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Camisa de Algodão Cru",
    slug: "camisa-algodao-cru",
    description: "Tecido estruturado, botões de madeira.",
    price: 4290,
    oldPrice: 4990,
    stock: 13,
    category: "Moda",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Cesto de Palma Trançada",
    slug: "cesto-palma-trancada",
    description: "Fibra natural, fecho com asa de couro.",
    price: 2190,
    stock: 18,
    category: "Casa",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Relógio Areia & Bronze",
    slug: "relogio-areia-bronze",
    description: "Pulso em pele vegetal, caixa em bronze.",
    price: 8490,
    oldPrice: 9890,
    stock: 6,
    category: "Acessórios",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Ténis Terracota Suede",
    slug: "tenis-terracota-suede",
    description: "Suede tom terra, sola de borracha natural.",
    price: 5890,
    stock: 9,
    category: "Moda",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Quadro Textura Cal",
    slug: "quadro-textura-cal",
    description: "Pintura original sobre tela de linho.",
    price: 12900,
    stock: 3,
    category: "Arte",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
];

/* ============================================================
   HELPERS DO TEMA
   ============================================================ */

export const formatPrice = (value: number | string) => {
  const n = Number(value);

  if (!Number.isFinite(n)) {
    return "0 MT";
  }

  return `${n.toLocaleString("pt-MZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} MT`;
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getCalizaProductSlug = (
  product: Pick<CalizaProduct, "slug" | "name">,
) => product.slug?.trim() || slugify(product.name);

export const discountPercent = (
  price: number,
  oldPrice: number | null | undefined,
) => {
  if (oldPrice == null || oldPrice <= price) {
    return null;
  }

  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

export const storeQuery = (storeSlug?: string) =>
  storeSlug ? `?storeSlug=${encodeURIComponent(storeSlug)}` : "";
