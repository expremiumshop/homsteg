import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import HomstegLogo from "@/components/HomstegLogo";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Globe2,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Package,
  Palette,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  TrendingUp,
  Truck,
  Users,
  X,
  Zap,
  Gift,
} from "lucide-react";

type Feature = {
  icon: ReactNode;
  title: string;
  description: string;
  accent: string;
};

/*
 * Benefícios da home: comerciais e simples.
 * Não se revela aqui qualquer regra de limite de
 * produtos/stock — o utilizador entra, cria a loja
 * e começa a usá-la normalmente.
 */
const benefits: string[] = [
  "Loja online completa",
  "Produtos, pedidos e clientes",
  "Todos os temas disponíveis",
  "Gestão de stock",
  "Painel administrativo",
  "Banner, logo e identidade da loja",
  "Integração com WhatsApp",
  "Market de modelos e componentes",
];

const faqItems = [
  {
    question: "A HOMSTEG é realmente gratuita?",
    answer:
      "Sim. Criar e usar a tua loja é 100% gratuito, para sempre. Não existem planos, mensalidades, subscrições nem taxas de utilização da plataforma.",
  },
  {
    question: "Então o que são os créditos?",
    answer:
      "Os créditos são o único sistema pago da HOMSTEG. Servem apenas para comprar ou desbloquear funcionalidades, modelos e componentes específicos no Market — e toda loja começa automaticamente com 100.000 créditos gratuitos, sem compra nem ação. Criar e usar a loja continua sempre gratuito.",
  },
  {
    question: "Preciso saber programação para criar uma loja?",
    answer:
      "Não. O HOMSTEG foi pensado para que possas criar e gerir a tua loja através do painel, sem precisares escrever código.",
  },
  {
    question: "Posso mudar o tema da minha loja?",
    answer:
      "Sim. Todos os temas — incluindo Nova, Luxe, Urban, Prime e outros — estão disponíveis gratuitamente para todas as lojas.",
  },
  {
    question: "Posso vender através do WhatsApp?",
    answer:
      "Sim. A experiência da loja pode ser integrada ao fluxo de contacto e pedidos através do WhatsApp.",
  },
];;

const features: Feature[] = [
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: "Painel completo",
    description:
      "Controla produtos, pedidos, clientes, stock, vendas e aparência da tua loja num único lugar.",
    accent: "bg-[#e8eee9] text-[#34483d]",
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Temas profissionais",
    description:
      "Escolhe entre Nova, Luxe, Urban e Prime e adapta a experiência à identidade do teu negócio.",
    accent: "bg-[#e8eee9] text-[#34483d]",
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: "Produtos e stock",
    description:
      "Adiciona produtos, variantes, imagens, preços, stock e categorias sem complicações.",
    accent: "bg-[#e8eee9] text-[#34483d]",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Analytics",
    description:
      "Acompanha vendas, pedidos e desempenho da tua loja através de informação clara.",
    accent: "bg-[#e8eee9] text-[#34483d]",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Equipa",
    description:
      "Dá acesso à tua equipa e organiza permissões de acordo com cada função.",
    accent: "bg-[#e8eee9] text-[#34483d]",
  },
  {
    icon: <Globe2 className="h-6 w-6" />,
    title: "A tua própria presença",
    description:
      "Publica a tua loja com um endereço profissional e prepara-a para crescer.",
    accent: "bg-[#e8eee9] text-[#34483d]",
  },
];

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  className?: string;
}) {
  const styles = {
    primary:
      "bg-[#34483d] text-white hover:bg-[#26382f]",
    secondary:
      "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    dark:
      "bg-[#283b31] text-white hover:bg-[#26382f]",
    ghost:
      "bg-white/10 text-white hover:bg-white/15 border border-white/10",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function ProductMini({
  image,
  name,
  price,
  badge,
}: {
  image: string;
  name: string;
  price: string;
  badge?: string;
}) {
  return (
    <div className="group rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,.08)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-28 overflow-hidden rounded-xl bg-slate-100">
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold text-slate-900 backdrop-blur">
            {badge}
          </span>
        )}
      </div>
      <div className="px-1.5 pb-1 pt-2">
        <p className="truncate text-[11px] font-semibold text-slate-900">
          {name}
        </p>
        <p className="mt-0.5 text-[11px] font-bold text-violet-600">{price}</p>
      </div>
    </div>
  );
}

/*
 * SHOWCASE DE HERO — vitrine editorial premium.
 *
 * Composição de revista: "folha" em papel osso sobre o
 * vídeo escuro do hero, coluna de texto com serifada
 * (Playfair Display), fotografia do produto a sangrar
 * com zoom lento, filete de progresso e índice de
 * cenas clicável. Sem portas, sem néon — apenas tinta,
 * espaço em branco e movimento subtil.
 *
 * Roda em loop (CSS + um único interval) e pausa ao
 * passar o rato por cima.
 */
const showcaseScenes = [
  {
    id: "fashion",
    kicker: "NOVA COLEÇÃO",
    title: "Estilo que acompanha",
    title2: "o teu ritmo",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
    product: "Sneaker Urban",
    price: "MT 2.490",
    productImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "tech",
    kicker: "LANÇAMENTO",
    title: "Tecnologia que trabalha",
    title2: "por ti",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80",
    product: "Watch Classic",
    price: "MT 3.890",
    productImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "coffee",
    kicker: "CAFÉS ESPECIAIS",
    title: "Sabores feitos à mão",
    title2: "com identidade",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80",
    product: "Blend da Casa",
    price: "MT 1.250",
    productImage:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=85",
  },
] as const;

const SHOWCASE_INTERVAL_MS = 8000;

function HeroShowcase() {
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(
      () =>
        setScene(current => (current + 1) % showcaseScenes.length),
      SHOWCASE_INTERVAL_MS,
    );

    return () => window.clearInterval(timer);
  }, [paused]);

  const active = showcaseScenes[scene];
  const playState = paused ? "paused" : "running";

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[720px]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');
        .hs-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        @keyframes hsKen { from { transform: scale(1.01); } to { transform: scale(1.09); } }
        @keyframes hsRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hsProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .hs-ken { animation: hsKen 9s ease-out both; }
        .hs-rise { animation: hsRise .85s cubic-bezier(.22,1,.36,1) both; }
        .hs-progress { transform-origin: left center; animation: hsProgress 8s linear both; }
        @media (prefers-reduced-motion: reduce) {
          .hs-ken, .hs-rise { animation: none !important; }
        }
      `}</style>

      {/* Halo discreto da folha sobre o vídeo */}
      <div className="absolute -inset-8 rounded-[44px] bg-white/[.06] blur-3xl" />

      <div
        className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#f6f3ec] shadow-[0_45px_120px_rgba(0,0,0,.5)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* CABEÇALHO — marca + índice da edição */}
        <div className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
          <HomstegLogo size={22} className="text-[#283b31]" />
          <span className="text-[9px] font-bold uppercase tracking-[.3em] text-[#283b31]/45">
            Edição{" "}
            {String(scene + 1).padStart(2, "0")} /{" "}
            {String(showcaseScenes.length).padStart(2, "0")}
          </span>
        </div>

        {/* FILETE DE PROGRESSO — avança com a cena */}
        <div className="mx-5 mt-4 h-px bg-[#283b31]/12 sm:mx-7">
          <div
            key={`progress-${active.id}`}
            className="hs-progress h-px w-full bg-[#34483d]/70"
            style={{ animationPlayState: playState }}
          />
        </div>

        {/* CORPO — texto editorial + fotografia do produto */}
        <div
          key={active.id}
          className="grid grid-cols-1 sm:grid-cols-[1fr_1.05fr]"
        >
          {/* Coluna de texto */}
          <div className="relative order-2 flex flex-col justify-center px-5 py-7 sm:order-1 sm:px-7 sm:py-9">
            {/* Textura da ambiente da cena */}
            <img
              src={active.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[.07] mix-blend-multiply"
            />

            <div className="relative">
              <span
                className="hs-rise block text-[9px] font-bold uppercase tracking-[.34em] text-[#34483d]/70"
                style={{ animationDelay: "60ms" }}
              >
                {active.kicker}
              </span>

              <h3
                className="hs-serif hs-rise mt-4 text-[clamp(1.45rem,3.1vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.015em] text-[#1e2b24]"
                style={{ animationDelay: "150ms" }}
              >
                {active.title}
                <span className="block italic text-[#34483d]">
                  {active.title2}
                </span>
              </h3>

              <div
                className="hs-rise mt-6 h-px w-full bg-[#283b31]/12"
                style={{ animationDelay: "260ms" }}
              />

              <div
                className="hs-rise mt-4 flex items-end justify-between gap-4"
                style={{ animationDelay: "340ms" }}
              >
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-[#283b31]/45">
                    Peça em destaque
                  </p>
                  <p className="hs-serif mt-1.5 truncate text-lg text-[#1e2b24]">
                    {active.product}
                  </p>
                </div>
                <p className="hs-serif shrink-0 text-lg text-[#34483d]">
                  {active.price}
                </p>
              </div>

              <span
                className="hs-rise mt-6 inline-flex items-center gap-2 border-b border-[#283b31]/30 pb-1 text-[9px] font-bold uppercase tracking-[.26em] text-[#283b31]"
                style={{ animationDelay: "420ms" }}
              >
                Ver produto
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* Coluna fotográfica */}
          <div className="relative order-1 min-h-[210px] overflow-hidden bg-[#e8e3d8] sm:order-2 sm:min-h-[340px]">
            <img
              key={`photo-${active.id}`}
              src={active.productImage}
              alt={active.product}
              loading="lazy"
              decoding="async"
              className="hs-ken absolute inset-0 h-full w-full object-cover"
              style={{ animationPlayState: playState }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent sm:border-l sm:border-[#283b31]/10" />
          </div>
        </div>

        {/* RODAPÉ — índice de cenas */}
        <div className="flex items-center gap-3 px-5 pb-5 pt-5 sm:px-7 sm:pb-6">
          {showcaseScenes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setScene(index)}
              aria-label={`Ver cena ${index + 1}: ${item.kicker}`}
              aria-current={index === scene}
              className="group flex items-center gap-2"
            >
              <span
                className={`text-[9px] font-bold tracking-[.2em] transition-colors ${
                  index === scene
                    ? "text-[#283b31]"
                    : "text-[#283b31]/30 group-hover:text-[#283b31]/60"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`h-px transition-all duration-500 ${
                  index === scene
                    ? "w-9 bg-[#34483d]"
                    : "w-4 bg-[#283b31]/20 group-hover:bg-[#283b31]/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StorePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="absolute -inset-8 rounded-[42px] bg-violet-500/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_35px_100px_rgba(0,0,0,.32)]">
        <div className="flex h-11 items-center gap-2 bg-slate-100 px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <div className="ml-4 flex h-6 flex-1 items-center rounded-lg bg-white px-3">
            <span className="truncate text-[9px] text-slate-400">
              minha-loja.homsteg.com
            </span>
          </div>
        </div>

        <div className="bg-[#f8f7f4] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-white">
                <ShoppingBag className="h-3.5 w-3.5" />
              </div>
              <span className="text-[11px] font-black">URBAN STORE</span>
            </div>

            <div className="flex gap-3 text-[8px] font-semibold text-slate-500">
              <span>Início</span>
              <span>Produtos</span>
              <span>Sobre</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[1.1fr_.9fr] gap-4">
            <div className="relative min-h-[215px] overflow-hidden rounded-[22px] bg-[#283b31] p-6 text-white">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/30 blur-2xl" />
              <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-fuchsia-500/30 blur-3xl" />

              <div className="relative z-10 max-w-[220px]">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[8px] font-semibold backdrop-blur">
                  NOVA COLEÇÃO
                </span>
                <h3 className="mt-5 text-2xl font-black leading-[1.02] tracking-[-0.05em]">
                  Estilo que
                  <br />
                  acompanha
                  <br />
                  o teu ritmo.
                </h3>
                <button className="mt-5 rounded-xl bg-white px-3.5 py-2 text-[9px] font-bold text-slate-950">
                  Comprar agora
                </button>
              </div>

              <div className="absolute bottom-3 right-3 h-32 w-24 rotate-6 overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80"
                  alt="Moda"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <ProductMini
                image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
                name="Sneaker Urban"
                price="MT 2.490"
                badge="Novo"
              />
              <ProductMini
                image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
                name="Watch Classic"
                price="MT 3.890"
              />
              <ProductMini
                image="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=500&q=80"
                name="Essential Tee"
                price="MT 890"
              />
              <ProductMini
                image="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80"
                name="Collection"
                price="MT 1.590"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-8 bottom-12 hidden rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,.2)] sm:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] font-medium text-slate-400">
              Vendas hoje
            </p>
            <p className="text-sm font-black text-slate-950">+38,6%</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-7 top-20 hidden rounded-2xl bg-slate-950 p-4 text-white shadow-[0_20px_50px_rgba(15,23,42,.3)] sm:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] text-white/50">Novo pedido</p>
            <p className="text-sm font-black">MT 4.850</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  const bars = [34, 52, 42, 68, 58, 82, 72, 92, 66, 88, 76, 96];

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-3 shadow-[0_30px_90px_rgba(15,23,42,.2)]">
      <div className="flex min-h-[410px] overflow-hidden rounded-[22px] bg-[#f7f8fc]">
        <aside className="hidden w-48 shrink-0 bg-slate-950 p-4 md:block">
          <div className="mb-7">
            <HomstegLogo size={36} className="text-white" />
          </div>

          <div className="space-y-1">
            {[
              [<LayoutDashboard />, "Visão geral", true],
              [<Package />, "Produtos", false],
              [<ShoppingBag />, "Pedidos", false],
              [<Users />, "Clientes", false],
              [<Palette />, "Design", false],
            ].map(([icon, label, active], index) => (
              <div
                key={index}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[10px] font-semibold ${
                  active
                    ? "bg-violet-600 text-white"
                    : "text-white/45 hover:bg-white/5"
                }`}
              >
                {icon as ReactNode}
                {label as string}
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-white/5 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-cyan-300" />
              <span className="text-[9px] font-bold text-white">
                Crescimento
              </span>
            </div>
            <p className="text-[8px] leading-relaxed text-white/40">
              A tua loja está a crescer esta semana.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-medium text-slate-400">
                Segunda-feira, 21 Setembro
              </p>
              <h3 className="mt-1 text-lg font-black tracking-[-0.04em] text-slate-950">
                Olá, Chazuca 👋
              </h3>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-[9px] font-bold text-violet-700">
              F
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              ["Vendas", "MT 48.920", "+18,4%"],
              ["Pedidos", "128", "+12,2%"],
              ["Clientes", "864", "+9,8%"],
              ["Produtos", "428", "+4,1%"],
            ].map(([label, value, growth]) => (
              <div
                key={label}
                className="rounded-2xl bg-white p-3 shadow-sm"
              >
                <p className="text-[8px] font-medium text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-black text-slate-950">
                  {value}
                </p>
                <p className="mt-1 text-[7px] font-bold text-emerald-500">
                  {growth}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_.8fr]">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-medium text-slate-400">
                    Desempenho
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-950">
                    Vendas da loja
                  </p>
                </div>
                <span className="rounded-lg bg-violet-50 px-2 py-1 text-[8px] font-bold text-violet-600">
                  30 dias
                </span>
              </div>

              <div className="mt-6 flex h-32 items-end gap-1.5">
                {bars.map((height, index) => (
                  <div
                    key={index}
                    className="flex flex-1 items-end"
                    style={{
                      height: `${height}%`,
                      animation: `barGrow .9s ease-out ${
                        index * 45
                      }ms both`,
                    }}
                  >
                    <div
                      className={`w-full rounded-t-md ${
                        index === 11
                          ? "bg-violet-600"
                          : "bg-violet-100"
                      }`}
                      style={{ height: "100%" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between">
                <p className="text-[8px] text-white/50">Pedidos recentes</p>
                <ArrowUpRight className="h-3.5 w-3.5 text-white/40" />
              </div>

              <div className="mt-4 space-y-3">
                {[
                  ["#28491", "MT 2.490"],
                  ["#28490", "MT 1.890"],
                  ["#28489", "MT 4.850"],
                  ["#28488", "MT 790"],
                ].map(([order, amount]) => (
                  <div
                    key={order}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-white/10" />
                      <span className="text-[8px] font-semibold">
                        {order}
                      </span>
                    </div>
                    <span className="text-[8px] font-bold text-cyan-300">
                      {amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function PeopleShopping() {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-3">
      <div className="relative h-[440px] overflow-hidden rounded-[24px]">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85"
          alt="Pessoa a fazer compras numa loja online"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-medium text-slate-400">
                EXPERIÊNCIA DE COMPRA
              </p>
              <p className="mt-1 text-sm font-black text-slate-950">
                Simples para quem compra.
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState<"store" | "dashboard">(
    "store",
  );
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const goCreate = () => navigate("/criar-conta");
  const goLogin = () => navigate("/login");

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.setAttribute("muted", "");
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.load();

    const tryPlay = () => {
      void video.play().catch(() => undefined);
    };
    const handleFirstInteraction = () => {
      if (video.paused) tryPlay();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && video.paused) tryPlay();
    };

    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadedmetadata", tryPlay);
    document.addEventListener("touchstart", handleFirstInteraction, { passive: true });
    document.addEventListener("pointerdown", handleFirstInteraction);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadedmetadata", tryPlay);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("pointerdown", handleFirstInteraction);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="home-page min-h-screen overflow-x-clip bg-[#f7f8f6] text-slate-950">
      <style>{`
        .home-page { font-family: "Segoe UI", Arial, sans-serif; }
        .home-page .home-title {
          max-width: 16ch;
          font-size: clamp(2.3rem, 4vw, 3.75rem);
          font-weight: 600;
          line-height: 1.06;
          letter-spacing: -.045em;
          text-wrap: balance;
        }
        .home-page h2 {
          font-size: clamp(1.55rem, 3vw, 2.25rem) !important;
          font-weight: 600 !important;
          line-height: 1.2 !important;
          letter-spacing: -.03em !important;
        }
        .home-page .home-hero-grid { grid-template-columns: minmax(0, 1fr); }
        .home-page .home-hero-copy { width: 100%; min-width: 0; }
        .home-page .home-hero-copy p { width: 100%; max-width: 100%; overflow-wrap: anywhere; }
        .home-page h2 .text-slate-400 { color: #59665d !important; }
        .home-page [class*="text-violet-"] { color: #516c58 !important; }
        .home-page .home-accent { color: #dce8de; }
        .home-page .home-hero-video { display: block; }
        .home-page .homsteg-marquee > div { color: #59665d; }
        @media (min-width: 1024px) {
          .home-page .home-hero-grid { grid-template-columns: .85fr 1.15fr; gap: 3.5rem; }
        }
        @media (max-width: 640px) {
          .home-page > section:first-of-type > div { width: 100%; max-width: 100%; }
          .home-page .home-hero-grid, .home-page .home-hero-copy { width: calc(100vw - 80px) !important; max-width: calc(100vw - 80px) !important; }
          .home-page .home-hero-copy p { width: 100%; max-width: 100%; overflow-wrap: normal; font-size: .9375rem; line-height: 1.55; }
          .home-page .home-hero-actions { align-items: flex-start; }
        }

        @keyframes floatA {
          0%,100% { transform: translate3d(0,0,0) rotate(0deg); }
          50% { transform: translate3d(0,-12px,0) rotate(1deg); }
        }

        @keyframes floatB {
          0%,100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,10px,0); }
        }

        @keyframes shine {
          0% { transform:translateX(-120%); }
          100% { transform:translateX(220%); }
        }

        @keyframes reveal {
          0% { opacity:0; transform:translateY(22px); }
          100% { opacity:1; transform:translateY(0); }
        }

        @keyframes barGrow {
          0% { transform:scaleY(0); transform-origin:bottom; }
          100% { transform:scaleY(1); transform-origin:bottom; }
        }

        @keyframes marquee {
          0% { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }

        .homsteg-float-a { animation:floatA 6s ease-in-out infinite; }
        .homsteg-float-b { animation:floatB 5s ease-in-out infinite; }
        .homsteg-reveal { animation:reveal .8s cubic-bezier(.22,1,.36,1) both; }
        .homsteg-marquee { animation:marquee 25s linear infinite; }
        .homsteg-shine { animation:shine 2.8s ease-in-out infinite; }

        html { scroll-behavior:smooth; }
      `}</style>

      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-[100] px-3 pt-3 sm:px-5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl bg-transparent px-4 shadow-[0_12px_40px_rgba(15,23,42,.08)] backdrop-blur-xl sm:px-6">
          <a href="#" className="shrink-0">
            <HomstegLogo size={36} />
          </a>

          <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
            <a
              href="#plataforma"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Plataforma
            </a>
            <a
              href="#temas"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Temas
            </a>
            <a
              href="#gratuito"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Gratuito
            </a>
            <a
              href="#recursos"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Recursos
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              FAQ
            </a>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" className="!bg-transparent !text-slate-700 shadow-none hover:!bg-slate-100" onClick={goLogin}>
              Login
            </Button>
            <Button onClick={goCreate}>
              Criar loja
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <button
            type="button"
            className="rounded-xl p-2 text-slate-900 lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={mobileOpen}
            aria-controls="home-mobile-navigation"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div
          id="home-mobile-navigation"
          className={`${mobileOpen ? "block" : "hidden"} mx-auto mt-2 max-w-7xl rounded-2xl bg-white p-4 shadow-xl lg:hidden`}
        >
          <div className="space-y-1">
            {[
              ["#plataforma", "Plataforma"],
              ["#temas", "Temas"],
              ["#gratuito", "Gratuito"],
              ["#recursos", "Recursos"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="dark" onClick={goLogin}>
              Login
            </Button>
            <Button onClick={goCreate}>Criar loja</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pb-24 pt-36 text-white sm:pt-40">
        <video
          ref={heroVideoRef}
          className="home-hero-video pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        >
          <source
            src="https://videos.pexels.com/video-files/8937981/8937981-sd_960_540_30fps.mp4"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/8937981/8937981-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/6238179/6238179-sd_960_540_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-[#142019]/45" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="home-hero-grid grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-14">
            <div className="home-hero-copy">
              <h1 className="home-title">
                Cria a tua loja online
                <span className="home-accent block">
                  100% grátis
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                Gere produtos, encomendas, clientes e vendas
                <br className="sm:hidden" /> num só painel. A utilização da
                plataforma é gratuita;
                <br className="sm:hidden" /> os créditos servem para comprar
                itens específicos
                <br className="sm:hidden" /> no Market.
              </p>

              <div className="home-hero-actions mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" onClick={goCreate}>
                  Criar loja grátis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Entrar
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-medium text-white/45">
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  Sem mensalidades
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  100% grátis, para sempre
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  Sem cartão de crédito
                </span>
              </div>
            </div>

            <div className="relative min-w-0">
              <HeroShowcase />
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-3 border-t border-white/10 pt-8 sm:grid-cols-4">
            {[
              ["0", "mensalidades"],
              ["8+", "temas disponíveis"],
              ["100%", "grátis para sempre"],
              ["1", "painel para gerir a loja"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-black tracking-[-0.04em]">
                  {value}
                </p>
                <p className="mt-1 text-[10px] font-medium text-white/40">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOGO STRIP */}
      <section className="overflow-hidden bg-white py-7">
        <div className="homsteg-marquee flex w-max gap-12 whitespace-nowrap">
          {[
            "LOJA ONLINE",
            "PRODUTOS",
            "PEDIDOS",
            "CLIENTES",
            "ANALYTICS",
            "STOCK",
            "WHATSAPP",
            "TEMAS",
            "DOMÍNIO",
            "EQUIPA",
            "LOJA ONLINE",
            "PRODUTOS",
            "PEDIDOS",
            "CLIENTES",
            "ANALYTICS",
            "STOCK",
            "WHATSAPP",
            "TEMAS",
            "DOMÍNIO",
            "EQUIPA",
          ].map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center gap-3 text-[10px] font-black tracking-[.18em] text-slate-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM */}
      <section id="plataforma" className="scroll-mt-24 bg-[#f5f6fa] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600">
              Tudo num só lugar
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
              Não é só uma loja.
              <span className="block text-slate-400">É o teu centro de operação.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">
              O HOMSTEG junta as ferramentas que precisas para apresentar,
              vender e gerir o teu negócio numa experiência simples e moderna.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="homsteg-reveal group relative overflow-hidden rounded-[26px] bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(15,23,42,.10)]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div
                  className={`mb-7 flex h-11 w-11 items-center justify-center rounded-xl ${feature.accent}`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg font-black tracking-[-0.03em]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>

                <div className="mt-7 flex items-center gap-2 text-[10px] font-bold text-slate-400 transition-colors group-hover:text-violet-600">
                  Explorar funcionalidade
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD / STORE */}
      <section id="recursos" className="scroll-mt-24 overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-14 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600">
                Do painel para a loja
              </span>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-5xl">
                Tu controlas tudo.
                <span className="block text-slate-400">
                  O cliente vê o resultado.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500">
                Cria produtos no painel, acompanha pedidos, observa as vendas e
                publica uma experiência de compra pensada para os teus clientes.
              </p>

              <div className="mt-8 flex gap-2 rounded-2xl bg-slate-100 p-1.5">
                <button
                  type="button"
                  onClick={() => setActiveDemo("dashboard")}
                  className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold transition ${
                    activeDemo === "dashboard"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  Painel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDemo("store")}
                  className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold transition ${
                    activeDemo === "store"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  Loja
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  ["Gestão simples", "Produtos e pedidos organizados."],
                  ["Experiência moderna", "Uma loja feita para converter."],
                  ["Tudo conectado", "O painel e a loja trabalham juntos."],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{title}</p>
                      <p className="mt-1 text-xs text-slate-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="homsteg-float-a">
              {activeDemo === "dashboard" ? (
                <DashboardPreview />
              ) : (
                <StorePreview />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PEOPLE / COMMERCE */}
      <section className="bg-[#eef0ff] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <PeopleShopping />

            <div>
              <span className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600">
                Feito para pessoas
              </span>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-5xl">
                O teu cliente não quer
                <span className="block text-violet-600">uma loja complicada.</span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-500">
                Quer encontrar o produto, perceber o preço, confiar na loja e
                comprar sem perder tempo. O HOMSTEG coloca essa experiência no
                centro.
              </p>

              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {[
                  [<ShoppingBag />, "Compra simples"],
                  [<CreditCard />, "Checkout preparado"],
                  [<MessageCircle />, "Contacto rápido"],
                  [<ShieldCheck />, "Experiência segura"],
                ].map(([icon, text], index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      {icon}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {text as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THEMES */}
      <section id="temas" className="scroll-mt-24 bg-slate-950 py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">
                Temas HOMSTEG
              </span>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-5xl">
                Quatro estilos.
                <span className="block text-white/35">Uma identidade tua.</span>
              </h2>
            </div>

            <Button variant="ghost" onClick={goCreate}>
              Criar loja
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Nova",
                description: "Minimalista e moderno",
                gradient: "from-violet-500 to-indigo-700",
                image:
                  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&q=80",
              },
              {
                name: "Luxe",
                description: "Elegante e sofisticado",
                gradient: "from-amber-300 to-orange-700",
                image:
                  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80",
              },
              {
                name: "Urban",
                description: "Forte e contemporâneo",
                gradient: "from-cyan-400 to-blue-700",
                image:
                  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
              },
              {
                name: "Prime",
                description: "Premium e marcante",
                gradient: "from-fuchsia-500 to-violet-800",
                image:
                  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80",
              },
            ].map((theme) => (
              <div
                key={theme.name}
                className="group relative overflow-hidden rounded-[28px] bg-white/5 p-2 transition duration-500 hover:-translate-y-2"
              >
                <div className="relative h-80 overflow-hidden rounded-[22px]">
                  <img
                    src={theme.image}
                    alt={theme.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-45 mix-blend-multiply`}
                  />
                  <div className="absolute inset-x-4 bottom-4">
                    <div className="rounded-2xl bg-slate-950/70 p-4 backdrop-blur-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-black">{theme.name}</p>
                          <p className="mt-1 text-[10px] text-white/50">
                            {theme.description}
                          </p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-950">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 100% GRATUITO + CRÉDITOS */}
      <section id="gratuito" className="scroll-mt-24 bg-[#f5f6fa] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600">
              100% gratuito
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-5xl">
              Sem planos.
              <span className="block text-slate-400">Sem mensalidades. Para sempre.</span>
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-500">
              A HOMSTEG não tem planos nem subscrições: criar e usar a tua loja
              é completamente gratuito. Começas logo com 100.000 créditos
              gratuitos, sem compra nem ação — e só gastas mais se quiseres
              desbloquear funcionalidades específicas no Market.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,.22)]">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950 shadow-lg">
                  <Gift className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black">A loja é grátis</h3>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/55">
                Tudo o que precisas para vender online, sem pagar nada pela
                plataforma:
              </p>

              <ul className="mt-6 grid flex-1 gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex gap-2 text-xs leading-5 text-white/70"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={goCreate}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-xs font-bold text-slate-950 transition hover:bg-emerald-50"
              >
                Criar a minha loja grátis
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col rounded-[28px] bg-white p-8 text-slate-950 shadow-[0_15px_50px_rgba(15,23,42,.06)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black">Créditos: só para o Market</h3>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Começas com 100.000 créditos gratuitos, sem compra nem ação.
                Os créditos nunca caducam e nunca são cobrados pela utilização
                da loja. Usas créditos apenas quando quiseres comprar ou
                desbloquear algo no Market:
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {[
                  "Modelos de banner e carrosséis promocionais",
                  "Cartões de produto com design exclusivo",
                  "Cabeçalhos e navegação personalizados",
                  "Rodapés e secções de categorias",
                  "Outros componentes e recursos do Market",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-xs leading-5 text-slate-500">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl bg-violet-50 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-violet-700">
                  Importante
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Não existem mensalidades nem cobranças recorrentes pela
                  utilização da plataforma. A loja funciona por tempo
                  indeterminado, 100% grátis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid overflow-hidden rounded-[32px] bg-[#283b31] text-white lg:grid-cols-3">
            {[
              [<Truck />, "Pedidos organizados", "Sabe sempre o que precisa de ser preparado."],
              [<BarChart3 />, "Dados para crescer", "Percebe o que está a funcionar na tua loja."],
              [<ShieldCheck />, "Estrutura profissional", "Uma base preparada para o teu próximo nível."],
            ].map(([icon, title, text], index) => (
              <div
                key={index}
                className="p-7 lg:p-9"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  {icon}
                </div>
                <h3 className="mt-6 text-base font-black">{title as string}</h3>
                <p className="mt-2 text-xs leading-5 text-white/55">
                  {text as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-[#f5f6fa] py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600">
              Perguntas frequentes
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em]">
              Antes de começares.
            </h2>
          </div>

          <div className="mt-12 space-y-2">
            {faqItems.map((item, index) => {
              const open = openFaq === index;

              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,.04)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                  >
                    <span className="flex items-center gap-3 text-sm font-bold">
                      <CircleHelp className="h-4 w-4 shrink-0 text-violet-600" />
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-12 text-sm leading-6 text-slate-500">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#080b18] py-24 text-white sm:py-32">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <HomstegLogo size={64} iconOnly className="mx-auto" />

          <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] sm:text-6xl">
            A tua próxima loja
            <span className="block bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              começa aqui.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
            Cria a tua loja 100% grátis, escolhe o teu estilo e começa a
            construir uma experiência de compra que representa o teu negócio.
            Sem planos. Sem mensalidades. Para sempre.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="secondary" onClick={goCreate}>
              Criar minha loja
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="ghost" onClick={goLogin}>
              Entrar
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080b18] px-5 pb-8 text-white">
        <div className="mx-auto max-w-7xl border-t border-white/10 pt-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <HomstegLogo size={36} className="text-white" />
              <p className="mt-3 max-w-sm text-[10px] leading-5 text-white/30">
                Cria a tua loja online 100% grátis. Sem planos nem
                mensalidades — créditos apenas para recursos específicos do
                Market.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-semibold text-white/35">
              <a href="#plataforma" className="hover:text-white">
                Plataforma
              </a>
              <a href="#temas" className="hover:text-white">
                Temas
              </a>
              <a href="#gratuito" className="hover:text-white">
                Gratuito
              </a>
              <a href="#faq" className="hover:text-white">
                FAQ
              </a>
              <button type="button" onClick={goLogin} className="hover:text-white">
                Entrar
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-2 border-t border-white/5 pt-5 text-[9px] text-white/25 sm:flex-row">
            <span>© 2026 HOMSTEG. Todos os direitos reservados.</span>
            <span>Construído para quem quer vender online.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
