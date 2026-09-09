export const storeDemos = [
  { slug: "atelier-nova", name: "Atelier Nova", category: "Fashion", tone: "Editorial", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85", accent: "#d8ff4a" },
  { slug: "sora-beauty", name: "Sora Beauty", category: "Beauty", tone: "Soft & clean", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=85", accent: "#ffc7c2" },
  { slug: "volt-lab", name: "Volt Lab", category: "Electronics", tone: "Future utility", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=85", accent: "#c8d8ff" },
  { slug: "forma-home", name: "Forma Home", category: "Home", tone: "Warm minimal", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85", accent: "#f3d4a5" },
  { slug: "monument", name: "Monument", category: "Luxury", tone: "Quiet luxury", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85", accent: "#ddd5c7" },
  { slug: "pico-play", name: "Pico Play", category: "Kids", tone: "Playful systems", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=85", accent: "#ffd66b" },
  { slug: "stride-club", name: "Stride Club", category: "Sports", tone: "High energy", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85", accent: "#b9efdc" },
  { slug: "crave-kitchen", name: "Crave Kitchen", category: "Food", tone: "Tasty & direct", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85", accent: "#ffb48e" },
  { slug: "orbit-tech", name: "Orbit Tech", category: "Technology", tone: "Signal & speed", image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=85", accent: "#bcd5ff" },
  { slug: "common-goods", name: "Common Goods", category: "General Store", tone: "Everyday better", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85", accent: "#d7d4c6" },
];

export const templates = [
  { name: "Monument", category: "Luxury", description: "Espaço editorial para marcas com presença e detalhe.", image: storeDemos[4].image, badge: "Mais usado" },
  { name: "Sora", category: "Beauty", description: "Um canvas calmo para produtos que falam por si.", image: storeDemos[1].image, badge: "Novo" },
  { name: "Volt", category: "Technology", description: "Precisão, contraste e velocidade para produtos tech.", image: storeDemos[2].image, badge: "Popular" },
  { name: "Atelier", category: "Fashion", description: "Grid flexível para coleções e drops editoriais.", image: storeDemos[0].image, badge: "Editorial" },
  { name: "Forma", category: "Home", description: "Uma casa digital quente, modular e sofisticada.", image: storeDemos[3].image, badge: "Minimal" },
  { name: "Stride", category: "Sports", description: "Ritmo visual para comunidades em movimento.", image: storeDemos[6].image, badge: "Express" },
];

export const planData = [
  { name: "Free", price: "0", description: "Para começar a vender sem fricção.", features: ["10 produtos", "1 loja publicada", "Checkout essencial", "Suporte por email"], cta: "Começar grátis" },
  { name: "Starter", price: "480", description: "O essencial para uma operação em crescimento.", features: ["100 produtos", "Domínio HOMSTEG", "Cupons e descontos", "Analytics básico"], cta: "Escolher Starter" },
  { name: "Business", price: "1.590", description: "Para equipas que vendem todos os dias.", features: ["1.000 produtos", "Domínio próprio", "Analytics avançado", "Até 5 membros"], cta: "Escolher Business", featured: true },
  { name: "Pro", price: "2.150", description: "Mais controlo para marcas com ambição.", features: ["5.000 produtos", "Automação de marketing", "Relatórios avançados", "Até 15 membros"], cta: "Escolher Pro" },
  { name: "Enterprise", price: "8.900", description: "Infraestrutura e apoio à medida.", features: ["Produtos ilimitados", "SLA dedicado", "Permissões avançadas", "Suporte prioritário"], cta: "Falar com vendas" },
];

export const productSeed = [
  { id: "PRD-1042", name: "Sculptural Candle", category: "Home", price: "1.890 MZN", stock: 28, status: "Ativo", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=240&q=80" },
  { id: "PRD-1041", name: "Everyday Tote", category: "Accessories", price: "2.450 MZN", stock: 12, status: "Ativo", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=240&q=80" },
  { id: "PRD-1040", name: "Cloud Knit", category: "Fashion", price: "3.200 MZN", stock: 6, status: "Stock baixo", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=240&q=80" },
  { id: "PRD-1039", name: "Desk Light 02", category: "Lighting", price: "4.890 MZN", stock: 0, status: "Sem stock", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=240&q=80" },
];

export const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Recursos", href: "#recursos" },
  { label: "Lojas", href: "#lojas" },
  { label: "Templates", href: "#templates" },
  { label: "Preços", href: "#precos" },
  { label: "FAQ", href: "#faq" },
];

export const featureData = [
  { icon: "box", title: "Produtos sem limite mental", text: "Variantes, stock, categorias e colecções num só fluxo." },
  { icon: "chart", title: "Decisões com contexto", text: "Vendas, conversão e ticket médio sem exportar folhas de cálculo." },
  { icon: "palette", title: "Design que é seu", text: "Comece com um template e faça a marca aparecer em cada detalhe." },
  { icon: "globe", title: "Pronto para vender local", text: "MZN, WhatsApp, entregas nacionais e pontos de recolha." },
  { icon: "users", title: "Clientes no centro", text: "Histórico, endereços e relação com cada cliente da sua loja." },
  { icon: "shield", title: "Dados isolados por loja", text: "A arquitectura multi-tenant protege cada operação desde a base." },
  { icon: "truck", title: "Checkout sem fricção", text: "Entrega, pagamento e confirmação desenhados para converter." },
  { icon: "sparkles", title: "Marketing que trabalha", text: "Descontos, destaques, campanhas e SEO no mesmo lugar." },
];

export type DemoStore = typeof storeDemos[number];
export type Product = typeof productSeed[number];
