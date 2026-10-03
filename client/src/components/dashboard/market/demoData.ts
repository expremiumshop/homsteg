/* =========================================================
   MARKET — DADOS DEMONSTRATIVOS (fictícios)

   Imagens e itens fictícios para os previews do Market:
   o cliente vê exatamente o que está a comprar antes de
   desbloquear. Nada aqui é comercial — os preços e
   disponibilidade vêm SEMPRE da base de dados
   (market.features via market.features.useQuery).

   Convenção de imagens: URLs públicos (Unsplash), mesma
   técnica usada pelos dados demo dos temas
   (client/src/themes/nova/demoData.ts).
   ========================================================= */

import type { MarketCategory } from "./registry";

/* ---------------------------------------------------------
   PRODUTOS DEMO — cartões de produto (1..8)
   --------------------------------------------------------- */

export type MarketDemoProduct = {
  name: string;
  price: number;
  imageUrl: string;
  category?: string | null;
};

export const MARKET_DEMO_PRODUCTS: MarketDemoProduct[] = [
  {
    name: "Ténis Urban Pro",
    price: 3490,
    category: "Calçados",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Smartphone Nova X",
    price: 12990,
    category: "Eletrónica",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mochila Premium",
    price: 2190,
    category: "Acessórios",
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Fones Pulse",
    price: 4590,
    category: "Eletrónica",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Relógio Minimal",
    price: 5890,
    category: "Acessórios",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Câmara Vintage",
    price: 8990,
    category: "Eletrónica",
    imageUrl:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Óculos Solaris",
    price: 1990,
    category: "Acessórios",
    imageUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Perfume Essence",
    price: 7490,
    category: "Beleza",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
  },
];

/* ---------------------------------------------------------
   CATEGORIAS DEMO — cartões de categoria (1..3)
   --------------------------------------------------------- */

export const MARKET_DEMO_CATEGORIES: MarketCategory[] = [
  {
    slug: "moda",
    name: "Moda",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "eletronica",
    name: "Eletrónica",
    imageUrl:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "casa",
    name: "Casa & Deco",
    imageUrl:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
  },
];

/* ---------------------------------------------------------
   BANNER DEMO — modelos 5..10 (com imagem de fundo)
   --------------------------------------------------------- */

export const MARKET_DEMO_BANNER = {
  title: "Coleção Nova — até 40% off",
  subtitle: "Frete grátis acima de 2.500 MT",
  imageUrl:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
};

/* ---------------------------------------------------------
   CATEGORIA DEMO — banners 1..4 (texto sobre gradiente,
   sem imagem) e headers/footers
   --------------------------------------------------------- */

export const MARKET_DEMO_CATEGORY: MarketCategory = {
  slug: "destaque",
  name: "Grandes ofertas, todos os dias",
  imageUrl: null,
};

export const MARKET_DEMO_SECTION_NAME = "Nova Market";
