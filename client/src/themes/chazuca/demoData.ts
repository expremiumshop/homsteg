export type ChazucaMode = "demo" | "store";

export type ChazucaStore = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  category?: string | null;
  currency?: string | null;
  status?: string | null;
  whatsapp?: string | null;
};

export type ChazucaProduct = {
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

export type ChazucaBanner = {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
};

export type ChazucaBenefit = {
  title: string;
};

export type ChazucaPromotion = {
  title: string;
  subtitle: string;
  cta: string;
};

export type ChazucaRelatedProduct = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string | null;
};

export type ChazucaCategory = {
  id: string | number;
  name: string;
};

/* ============================================================
   DADOS DE DEMONSTRAÇÃO — CHAZUCA LAB
   ============================================================ */

export const chazucaDemoStore = {
  name: "Chazuca Lab",
  category: "Criativo",
  currency: "MZN",
  country: "Moçambique",
};

export const chazucaDemoCategories = [
  "Todos",
  "Streetwear",
  "Acessórios",
  "Tech",
  "Arte",
  "Musica",
];

export const chazucaDemoBanners: ChazucaBanner[] = [
  {
    title: "Cria sem pedir licença",
    subtitle: "Peças ousadas para quem define tendência.",
    cta: "Entrar no clima",
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Drop 04 — Neon Roots",
    subtitle: "Edição limitada, disponível até esgotar.",
    cta: "Ver o drop",
    image:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Colab Chazuca × Artistas",
    subtitle: "Arte local em cada peça.",
    cta: "Explorar",
    image:
      "https://images.unsplash.com/photo-1493020258366-be3ead61c1bd?auto=format&fit=crop&w=1600&q=80",
  },
];

export const chazucaDemoTopBenefits: ChazucaBenefit[] = [
  { title: "Drops limitados" },
  { title: "Arte de autores locais" },
  { title: "Envio expresso" },
];

export const chazucaDemoPromotion: ChazucaPromotion = {
  title: "DROP 04 — NEON ROOTS",
  subtitle: "Quando acaba, acabou. Garante a tua peça.",
  cta: "Comprar o drop",
};

export const chazucaDemoProducts: ChazucaProduct[] = [
  {
    id: 1,
    name: "Hoodie Neon Roots",
    slug: "hoodie-neon-roots",
    description: "Algodão pesado, serigrafia glow.",
    price: 4890,
    oldPrice: 5890,
    stock: 20,
    category: "Streetwear",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Snapback Roxo Elétrico",
    slug: "snapback-roxo-eletrico",
    description: "Bordado 3D, fecho metálico.",
    price: 1890,
    stock: 34,
    category: "Acessórios",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Ténis Hype Chroma",
    slug: "tenis-hype-chroma",
    description: "Pigmento roxo com detalhes rosa shock.",
    price: 7490,
    oldPrice: 8990,
    stock: 12,
    category: "Streetwear",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Smartwatch Pulse Violet",
    slug: "smartwatch-pulse-violet",
    description: "Pulseira silicone, mostrador AMOLED.",
    price: 9990,
    stock: 8,
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Poster Graffiti Nº 7",
    slug: "poster-graffiti-no7",
    description: "Impressão giclée, assinada pelo autor.",
    price: 1590,
    stock: 40,
    category: "Arte",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Fones Bass Boom",
    slug: "fones-bass-boom",
    description: "Graves profundos, luz RGB.",
    price: 4290,
    oldPrice: 5290,
    stock: 17,
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
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

export const getChazucaProductSlug = (
  product: Pick<ChazucaProduct, "slug" | "name">,
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
