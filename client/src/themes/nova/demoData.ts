export type NovaDemoProduct = {
    id: number;
    name: string;
    slug: string;
    description: string;
    priceMzn: number;
    compareAtPriceMzn?: number;
    stock: number;
    category: string;
    imageUrl: string;
  };
  
  export const novaDemoStore = {
    name: "Nova Market",
    category: "Marketplace",
    currency: "MZN",
    country: "Moçambique",
  };
  
  export const novaDemoCategories = [
    "Todos",
    "Moda",
    "Eletrónica",
    "Casa",
    "Acessórios",
    "Calçados",
  ];
  
  export const novaDemoProducts: NovaDemoProduct[] = [
    {
      id: 1,
      name: "Smartphone Nova X",
      slug: "smartphone-nova-x",
      description: "Smartphone moderno para o dia a dia.",
      priceMzn: 12990,
      compareAtPriceMzn: 14990,
      stock: 18,
      category: "Eletrónica",
      imageUrl:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Ténis Urban Pro",
      slug: "tenis-urban-pro",
      description: "Ténis confortável com design moderno.",
      priceMzn: 3490,
      compareAtPriceMzn: 4290,
      stock: 24,
      category: "Calçados",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Mochila Premium",
      slug: "mochila-premium",
      description: "Mochila resistente para trabalho e estudos.",
      priceMzn: 2190,
      stock: 31,
      category: "Acessórios",
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "Relógio Classic",
      slug: "relogio-classic",
      description: "Relógio elegante para qualquer ocasião.",
      priceMzn: 2790,
      compareAtPriceMzn: 3290,
      stock: 15,
      category: "Acessórios",
      imageUrl:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "Camiseta Essential",
      slug: "camiseta-essential",
      description: "Camiseta básica com corte confortável.",
      priceMzn: 990,
      stock: 42,
      category: "Moda",
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      name: "Lâmpada Smart",
      slug: "lampada-smart",
      description: "Iluminação inteligente para a sua casa.",
      priceMzn: 1590,
      compareAtPriceMzn: 1890,
      stock: 20,
      category: "Casa",
      imageUrl:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      name: "Fones Wireless",
      slug: "fones-wireless",
      description: "Áudio sem fios com excelente autonomia.",
      priceMzn: 2490,
      stock: 27,
      category: "Eletrónica",
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      name: "Casaco Modern",
      slug: "casaco-modern",
      description: "Casaco versátil para um visual moderno.",
      priceMzn: 3990,
      compareAtPriceMzn: 4590,
      stock: 12,
      category: "Moda",
      imageUrl:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    },
  ];