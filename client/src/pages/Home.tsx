import { useState, type ReactNode } from "react";
import { useLocation } from "wouter";
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
  Sparkles,
  Store,
  TrendingUp,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";

type Plan = {
  name: string;
  price: string;
  period: string;
  limit: string;
  description: string;
  features: string[];
  featured?: boolean;
};

type Feature = {
  icon: ReactNode;
  title: string;
  description: string;
  accent: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "0",
    period: "para sempre",
    limit: "50 produtos",
    description: "Tudo o que precisas para começar a vender online.",
    features: [
      "Loja online",
      "50 produtos",
      "Tema base",
      "Gestão de stock",
      "Gestão de pedidos",
      "Painel administrativo",
      "Banner da loja",
      "Logo e informações da loja",
      "Link para WhatsApp",
    ],
  },
  {
    name: "Starter",
    price: "480",
    period: "/mês",
    limit: "580 produtos",
    description: "Para lojas que já estão a crescer e precisam de mais controlo.",
    features: [
      "Tudo do Free",
      "580 produtos",
      "Todos os temas disponíveis",
      "Variantes de produtos",
      "Galeria de imagens",
      "Promoções",
      "Cupons",
      "Relatórios básicos",
      "Mais personalização",
    ],
  },
  {
    name: "Business",
    price: "1.590",
    period: "/mês",
    limit: "2.450 produtos",
    description: "Mais ferramentas para transformar a loja num negócio completo.",
    features: [
      "Tudo do Starter",
      "2.450 produtos",
      "Domínio personalizado",
      "Relatórios avançados",
      "Gestão avançada de pedidos",
      "Marketing e promoções",
      "Mais membros da equipa",
      "Permissões de equipa",
      "Personalização avançada",
    ],
    featured: true,
  },
  {
    name: "Professional",
    price: "2.150",
    period: "/mês",
    limit: "5.850 produtos",
    description: "Para operações maiores que precisam de escala e controlo.",
    features: [
      "Tudo do Business",
      "5.850 produtos",
      "Analytics avançado",
      "Stock avançado",
      "Marketing avançado",
      "Mais membros da equipa",
      "Permissões avançadas",
      "Personalização completa",
      "Maior capacidade operacional",
    ],
  },
  {
    name: "Enterprise",
    price: "8.900",
    period: "/mês",
    limit: "Produtos ilimitados",
    description: "Infraestrutura e capacidade para operações de grande dimensão.",
    features: [
      "Tudo do Professional",
      "Produtos ilimitados",
      "Variantes ilimitadas",
      "Equipas maiores",
      "Permissões avançadas",
      "Domínio personalizado",
      "Integrações personalizadas",
      "Maior capacidade",
      "Suporte prioritário",
    ],
  },
];

const features: Feature[] = [
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: "Painel completo",
    description:
      "Controla produtos, pedidos, clientes, stock, vendas e aparência da tua loja num único lugar.",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Temas profissionais",
    description:
      "Escolhe entre Nova, Luxe, Urban e Prime e adapta a experiência à identidade do teu negócio.",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: "Produtos e stock",
    description:
      "Adiciona produtos, variantes, imagens, preços, stock e categorias sem complicações.",
    accent: "from-fuchsia-500 to-purple-500",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Analytics",
    description:
      "Acompanha vendas, pedidos e desempenho da tua loja através de informação clara.",
    accent: "from-blue-500 to-cyan-400",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Equipa",
    description:
      "Dá acesso à tua equipa e organiza permissões de acordo com cada função.",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: <Globe2 className="h-6 w-6" />,
    title: "A tua própria presença",
    description:
      "Publica a tua loja com um endereço profissional e prepara-a para crescer.",
    accent: "from-cyan-400 to-violet-500",
  },
];

const faqItems = [
  {
    question: "Preciso saber programação para criar uma loja?",
    answer:
      "Não. O HOMSTEG foi pensado para que possas criar e gerir a tua loja através do painel, sem precisares escrever código.",
  },
  {
    question: "Posso mudar o tema da minha loja?",
    answer:
      "Sim. O HOMSTEG disponibiliza temas diferentes, incluindo Nova, Luxe, Urban e Prime, para que possas escolher o estilo da tua loja.",
  },
  {
    question: "Posso adicionar muitos produtos?",
    answer:
      "Sim. O limite depende do plano. O Free permite 50 produtos, enquanto o Enterprise permite produtos ilimitados.",
  },
  {
    question: "Posso vender através do WhatsApp?",
    answer:
      "Sim. A experiência da loja pode ser integrada ao fluxo de contacto e pedidos através do WhatsApp.",
  },
  {
    question: "Posso ter domínio próprio?",
    answer:
      "Os planos superiores podem utilizar domínio personalizado, permitindo apresentar a loja com uma presença própria.",
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
      "bg-violet-600 text-white shadow-[0_14px_40px_rgba(124,58,237,.28)] hover:bg-violet-500 hover:-translate-y-0.5",
    secondary:
      "bg-white text-slate-900 shadow-[0_12px_35px_rgba(15,23,42,.10)] hover:-translate-y-0.5",
    dark:
      "bg-slate-950 text-white shadow-[0_12px_35px_rgba(15,23,42,.18)] hover:bg-slate-800 hover:-translate-y-0.5",
    ghost:
      "bg-white/10 text-white hover:bg-white/15 border border-white/10",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          dark ? "bg-white text-slate-950" : "bg-slate-950 text-white"
        } shadow-lg`}
      >
        <Store className="h-5 w-5" strokeWidth={2.3} />
      </div>
      <span
        className={`text-[18px] font-black tracking-[-0.04em] ${
          dark ? "text-white" : "text-slate-950"
        }`}
      >
        HOMSTEG
      </span>
    </div>
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
            <div className="relative min-h-[215px] overflow-hidden rounded-[22px] bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-700 p-6 text-white">
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
            <Logo dark />
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
                Olá, Fochineti 👋
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
    <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-violet-100 via-white to-cyan-100 p-3 shadow-[0_25px_70px_rgba(79,70,229,.12)]">
      <div className="relative h-[440px] overflow-hidden rounded-[24px]">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85"
          alt="Pessoa a fazer compras numa loja online"
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f6fa] text-slate-950">
      <style>{`
        @keyframes floatA {
          0%,100% { transform: translate3d(0,0,0) rotate(0deg); }
          50% { transform: translate3d(0,-12px,0) rotate(1deg); }
        }

        @keyframes floatB {
          0%,100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,10px,0); }
        }

        @keyframes pulseGlow {
          0%,100% { opacity:.45; transform:scale(1); }
          50% { opacity:.75; transform:scale(1.08); }
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
        .homsteg-glow { animation:pulseGlow 4s ease-in-out infinite; }
        .homsteg-reveal { animation:reveal .8s cubic-bezier(.22,1,.36,1) both; }
        .homsteg-marquee { animation:marquee 25s linear infinite; }
        .homsteg-shine { animation:shine 2.8s ease-in-out infinite; }

        html { scroll-behavior:smooth; }
      `}</style>

      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl bg-white/85 px-4 shadow-[0_12px_40px_rgba(15,23,42,.08)] backdrop-blur-xl sm:px-6">
          <a href="#" className="shrink-0">
            <Logo />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
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
              href="#planos"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              Planos
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

          <div className="hidden items-center gap-2 md:flex">
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
            className="rounded-xl p-2 text-slate-900 md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mx-auto mt-2 max-w-7xl rounded-2xl bg-white p-4 shadow-xl md:hidden">
            <div className="space-y-1">
              {[
                ["#plataforma", "Plataforma"],
                ["#temas", "Temas"],
                ["#planos", "Planos"],
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
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#080b18] pb-24 pt-36 text-white sm:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,.30),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(6,182,212,.20),transparent_28%),radial-gradient(circle_at_70%_85%,rgba(217,70,239,.16),transparent_32%)]" />

        <div
          className="absolute inset-0 opacity-[.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="homsteg-glow absolute -left-24 top-32 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="homsteg-glow absolute -right-24 top-72 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-14 lg:grid-cols-[.85fr_1.15fr]">
            <div className="homsteg-reveal">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-[11px] font-semibold text-white/80 ring-1 ring-white/10">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                A nova forma de criar uma loja online
              </div>

              <h1 className="max-w-2xl text-[clamp(3rem,6vw,5.8rem)] font-black leading-[.91] tracking-[-0.07em]">
                O teu negócio.
                <span className="block bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Uma nova experiência.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
                Cria uma loja profissional, gere produtos, pedidos, clientes e
                vendas e dá ao teu negócio uma presença digital que realmente
                parece tua.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" onClick={goCreate}>
                  Começar gratuitamente
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-medium text-white/45">
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  Sem programação
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  Começa grátis
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  Cresce contigo
                </span>
              </div>
            </div>

            <div
              className="homsteg-reveal relative"
              style={{ animationDelay: "180ms" }}
            >
              <StorePreview />
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-3 border-t border-white/10 pt-8 sm:grid-cols-4">
            {[
              ["50+", "produtos no Free"],
              ["4", "temas profissionais"],
              ["5", "planos disponíveis"],
              ["∞", "possibilidades"],
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
      <section id="plataforma" className="bg-[#f5f6fa] py-24 sm:py-32">
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
                  className={`mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-white shadow-lg`}
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
      <section id="recursos" className="overflow-hidden bg-white py-24 sm:py-32">
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
      <section id="temas" className="bg-slate-950 py-24 text-white sm:py-32">
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

      {/* PLANS */}
      <section id="planos" className="bg-[#f5f6fa] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600">
              Planos
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-5xl">
              Começa pequeno.
              <span className="block text-slate-400">Cresce sem trocar de plataforma.</span>
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-500">
              Escolhe a capacidade que faz sentido para o teu negócio hoje e
              muda de plano quando precisares.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[28px] p-6 ${
                  plan.featured
                    ? "bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,.22)]"
                    : "bg-white text-slate-950 shadow-[0_15px_50px_rgba(15,23,42,.06)]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                    Mais completo
                  </div>
                )}

                <p
                  className={`text-sm font-black ${
                    plan.featured ? "text-white" : "text-slate-950"
                  }`}
                >
                  {plan.name}
                </p>

                <p
                  className={`mt-2 text-xs leading-5 ${
                    plan.featured ? "text-white/45" : "text-slate-400"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mt-7">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-black tracking-[-0.05em]">
                      {plan.price === "0" ? "Grátis" : `MT ${plan.price}`}
                    </span>
                    {plan.price !== "0" && (
                      <span
                        className={`pb-1 text-[9px] ${
                          plan.featured ? "text-white/40" : "text-slate-400"
                        }`}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <div
                    className={`mt-4 rounded-xl px-3 py-2 text-[10px] font-black ${
                      plan.featured
                        ? "bg-white/10 text-cyan-200"
                        : "bg-violet-50 text-violet-700"
                    }`}
                  >
                    {plan.limit}
                  </div>
                </div>

                <div className="my-6 h-px bg-current opacity-[.08]" />

                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex gap-2 text-[10px] leading-4 ${
                        plan.featured ? "text-white/65" : "text-slate-500"
                      }`}
                    >
                      <Check
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                          plan.featured
                            ? "text-cyan-300"
                            : "text-violet-600"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={goCreate}
                  className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition ${
                    plan.featured
                      ? "bg-white text-slate-950 hover:bg-cyan-50"
                      : "bg-slate-950 text-white hover:bg-violet-600"
                  }`}
                >
                  Escolher {plan.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-[10px] text-slate-400">
            Preços apresentados em Meticais (MZN/MT).
          </p>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid overflow-hidden rounded-[32px] bg-gradient-to-r from-violet-700 via-indigo-700 to-cyan-600 text-white lg:grid-cols-3">
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
      <section id="faq" className="bg-[#f5f6fa] py-24 sm:py-32">
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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_15px_50px_rgba(124,58,237,.35)]">
            <Store className="h-7 w-7" />
          </div>

          <h2 className="mt-7 text-4xl font-black tracking-[-0.06em] sm:text-6xl">
            A tua próxima loja
            <span className="block bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              começa aqui.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
            Cria gratuitamente, escolhe o teu estilo e começa a construir uma
            experiência de compra que representa o teu negócio.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="secondary" onClick={goCreate}>
              Criar minha loja
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="ghost" onClick={goLogin}>
              Login
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
              <Logo dark />
              <p className="mt-3 max-w-sm text-[10px] leading-5 text-white/30">
                Uma plataforma para criar, gerir e fazer crescer lojas online.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-semibold text-white/35">
              <a href="#plataforma" className="hover:text-white">
                Plataforma
              </a>
              <a href="#temas" className="hover:text-white">
                Temas
              </a>
              <a href="#planos" className="hover:text-white">
                Planos
              </a>
              <a href="#faq" className="hover:text-white">
                FAQ
              </a>
              <button type="button" onClick={goLogin} className="hover:text-white">
                Login
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