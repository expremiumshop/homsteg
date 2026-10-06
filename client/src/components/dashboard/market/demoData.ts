import type { MarketCategory } from "./registry";

/* =========================================================
   MARKET — DADOS DEMONSTRATIVOS (fictícios)

   Itens fictícios para os previews do Market:
   o cliente vê exatamente o que está a comprar antes de
   desbloquear.

   Nada aqui é comercial — os preços e disponibilidade vêm
   SEMPRE da base de dados
   (market.features via market.features.useQuery).

   ========================================================= */

/* ---------------------------------------------------------
   PRODUTOS DEMO — cartões de produto (1..8)
   --------------------------------------------------------- */

export type MarketDemoProduct = {
  name: string;
  price: number;
  imageUrl?: string;
  image?: string;
  slug?: string;
  description?: string;
  compareAtPrice?: number | null;
  featured?: boolean;
  storeName?: string;
  category?: string | null;
};

export const MARKET_DEMO_PRODUCTS: MarketDemoProduct[] = [
  {
    name: "Ténis Urban Pro",
    price: 3490,
    category: "Calçados",
  },
  {
    name: "Smartphone Nova X",
    price: 12990,
    category: "Eletrónica",
  },
  {
    name: "Mochila Premium",
    price: 2190,
    category: "Acessórios",
  },
  {
    name: "Fones Pulse",
    price: 4590,
    category: "Eletrónica",
  },
  {
    name: "Relógio Minimal",
    price: 5890,
    category: "Acessórios",
  },
  {
    name: "Câmara Vintage",
    price: 8990,
    category: "Eletrónica",
  },
  {
    name: "Óculos Solaris",
    price: 1990,
    category: "Acessórios",
  },
  {
    name: "Perfume Essence",
    price: 7490,
    category: "Beleza",
  },
];

/* ---------------------------------------------------------
   CATEGORIAS DEMO — cartões de categoria (1..3)
   --------------------------------------------------------- */

export const MARKET_DEMO_CATEGORIES: MarketCategory[] = [
  {
    slug: "moda",
    name: "Moda",
  },
  {
    slug: "eletronica",
    name: "Eletrónica",
  },
  {
    slug: "casa",
    name: "Casa & Deco",
  },
];

  /* ---------------------------------------------------------
   CATEGORIA DEMO — banners 1..4
   --------------------------------------------------------- */

export const MARKET_DEMO_CATEGORY: MarketCategory = {
  slug: "destaque",
  name: "Grandes ofertas, todos os dias",
  imageUrl: null,
};

export const MARKET_DEMO_SECTION_NAME = "Nova Market";
