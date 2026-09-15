import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Globe2,
  Layers3,
  Menu,
  Palette,
  Play,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  featureData,
  navItems,
  planData,
  storeDemos,
  templates,
} from "../data";

const iconMap = {
  box: Box,
  chart: BarChart3,
  palette: Palette,
  globe: Globe2,
  users: Users,
  shield: ShieldCheck,
  truck: Truck,
  sparkles: Sparkles,
} as const;

function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  onClick?: () => void;
}) {
  const variants = {
    primary:
      "bg-lime-400 text-black hover:bg-lime-300",
    ghost:
      "bg-transparent text-slate-900 hover:bg-slate-100",
    outline:
      "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTemplate, setActiveTemplate] = useState(0);

  const start = () => {
    setMobileOpen(false);
    navigate("/criar-conta");
  };

  const login = () => {
    setMobileOpen(false);
    navigate("/login");
  };

  const selectedTemplate = useMemo(
    () => templates[activeTemplate],
    [activeTemplate],
  );

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#f7f8f4]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-lime-400">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight">
              HOMSTEG<span className="text-lime-500">.</span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" className="px-3" onClick={login}>
              Entrar
            </Button>

            <Button onClick={start}>
              Criar loja
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <button
            type="button"
            className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-[#f7f8f4] px-6 py-5 lg:hidden">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-slate-700"
                >
                  {item.label}
                </a>
              ))}

              <Button
                variant="ghost"
                className="mt-2 w-full"
                onClick={login}
              >
                Entrar
              </Button>

              <Button
                className="w-full"
                onClick={start}
              >
                Criar loja
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
              <Sparkles className="h-4 w-4 text-lime-500" />
              Cria a tua loja online
            </div>

            <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              A tua loja.
              <br />
              <span className="text-lime-500">Do teu jeito.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              Cria, personaliza e gere a tua loja online com a HOMSTEG.
              Tudo num único lugar, simples e preparado para crescer contigo.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                className="w-full px-7 py-4 sm:w-auto"
                onClick={start}
              >
                Começar gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full px-7 py-4 sm:w-auto"
                onClick={() => {
                  const element = document.getElementById("demos");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Play className="mr-2 h-4 w-4" />
                Ver exemplos
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-lime-500" />
                Sem cartão bancário
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-lime-500" />
                Configuração simples
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-lime-500" />
                Gestão centralizada
              </span>
            </div>
          </div>
        </section>

        <section
          id="recursos"
          className="border-y border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-lime-600">
                Tudo o que precisas
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Uma plataforma feita para o teu negócio.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Ferramentas essenciais para criares e administrares a tua
                loja sem complicações.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {featureData.map((feature) => {
                const Icon =
                  iconMap[feature.icon as keyof typeof iconMap] ?? Box;

                return (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-slate-200 bg-[#f7f8f4] p-7"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-lime-400">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-6 text-lg font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="demos"
          className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-lime-600">
                Lojas criadas com HOMSTEG
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Começa com uma base. Personaliza tudo.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Escolhe um estilo e adapta a tua loja ao teu negócio.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={start}
            >
              Criar a minha loja
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="space-y-3">
              {storeDemos.map((demo, index) => (
                <button
                  key={demo.name}
                  type="button"
                  onClick={() => setActiveTemplate(index)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    activeTemplate === index
                      ? "border-black bg-black text-white"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{demo.name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>

                  <p
                    className={`mt-1 text-sm ${
                      activeTemplate === index
                        ? "text-white/60"
                        : "text-slate-500"
                    }`}
                  >
                    {demo.category}
                  </p>
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <p className="font-bold">{selectedTemplate.name}</p>
                  <p className="text-sm text-slate-500">
                    {selectedTemplate.category}
                  </p>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <span className="h-3 w-3 rounded-full bg-slate-200" />
                  <span className="h-3 w-3 rounded-full bg-slate-200" />
                  <span className="h-3 w-3 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="min-h-[380px] bg-[#f7f8f4] p-6 sm:p-10">
                <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-lime-400">
                        <Store className="h-5 w-5" />
                      </div>
                      <span className="font-black">
                        {selectedTemplate.name}
                      </span>
                    </div>

                    <div className="hidden items-center gap-4 text-xs font-medium text-slate-500 sm:flex">
                      <span>Início</span>
                      <span>Produtos</span>
                      <span>Sobre</span>
                    </div>
                  </div>

                  <div className="mt-10 grid gap-8 md:grid-cols-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-lime-600">
                        Loja online
                      </span>

                      <h3 className="mt-3 text-4xl font-black tracking-tight">
                        Vende mais.
                        <br />
                        Trabalha melhor.
                      </h3>

                      <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                        Uma experiência moderna para apresentar produtos,
                        receber pedidos e fazer crescer o teu negócio.
                      </p>

                      <Button
                        className="mt-6"
                        onClick={start}
                      >
                        Comprar agora
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="aspect-square rounded-2xl bg-slate-100"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-black text-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
                  Feito para crescer
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                  A tua loja acompanha o teu negócio.
                </h2>

                <p className="mt-5 max-w-xl text-lg leading-8 text-white/60">
                  Começa de forma simples e adiciona novas funcionalidades
                  quando o teu negócio precisar.
                </p>

                <Button
                  className="mt-8"
                  onClick={start}
                >
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <BarChart3 className="h-7 w-7 text-lime-400" />
                  <h3 className="mt-5 font-bold">Dados do negócio</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Acompanha o desempenho da tua loja.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <Palette className="h-7 w-7 text-lime-400" />
                  <h3 className="mt-5 font-bold">Vários temas</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Personaliza a aparência da tua loja.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <Users className="h-7 w-7 text-lime-400" />
                  <h3 className="mt-5 font-bold">Clientes</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Gere clientes e pedidos num só lugar.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <Truck className="h-7 w-7 text-lime-400" />
                  <h3 className="mt-5 font-bold">Entregas</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Organiza os métodos de entrega da tua loja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="planos"
          className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-lime-600">
              Planos
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Escolhe o plano certo para começar.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Começa com o essencial e evolui quando o teu negócio crescer.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {planData.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-7 ${
                  index === 1
                    ? "border-black bg-black text-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                {index === 1 && (
                  <span className="absolute right-5 top-5 rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black">
                    Popular
                  </span>
                )}

                <h3 className="text-xl font-black">{plan.name}</h3>

                <p
                  className={`mt-2 text-sm ${
                    index === 1
                      ? "text-white/50"
                      : "text-slate-500"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mt-7">
                  <span className="text-4xl font-black">
                    {plan.price}
                  </span>

                  {(plan as { period?: string }).period && (
                    <span
                      className={`ml-1 text-sm ${
                        index === 1
                          ? "text-white/50"
                          : "text-slate-500"
                      }`}
                    >
                      {(plan as { period?: string }).period}
                    </span>
                  )}
                </div>

                <Button
                  variant={index === 1 ? "primary" : "outline"}
                  className="mt-7 w-full"
                  onClick={start}
                >
                  Começar
                </Button>

                <div className="mt-7 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          index === 1
                            ? "text-lime-400"
                            : "text-lime-600"
                        }`}
                      />
                      <span
                        className={
                          index === 1
                            ? "text-white/70"
                            : "text-slate-600"
                        }
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="faq"
          className="border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-lime-600">
                Perguntas frequentes
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Tens alguma dúvida?
              </h2>
            </div>

            <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
              {[
                {
                  question: "Preciso de conhecimentos técnicos?",
                  answer:
                    "Não. A HOMSTEG foi pensada para que possas criar e gerir a tua loja sem precisares de programar.",
                },
                {
                  question: "Posso personalizar a minha loja?",
                  answer:
                    "Sim. Podes escolher temas e personalizar diferentes elementos da tua loja de acordo com o teu negócio.",
                },
                {
                  question: "Posso mudar de plano depois?",
                  answer:
                    "Sim. O objetivo é permitir que a tua loja cresça contigo e que possas evoluir para outro plano quando precisares.",
                },
                {
                  question: "Os meus produtos ficam separados de outras lojas?",
                  answer:
                    "Sim. Cada loja possui os seus próprios dados, produtos, configurações e membros.",
                },
              ].map((faq, index) => {
                const isOpen = activeFaq === index;

                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveFaq(isOpen ? null : index)
                      }
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="font-bold">
                        {faq.question}
                      </span>

                      {isOpen ? (
                        <ChevronDown className="h-5 w-5 shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="pb-6 pr-10 text-sm leading-7 text-slate-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="overflow-hidden rounded-[2rem] bg-lime-400 px-7 py-12 sm:px-12 lg:px-16 lg:py-16">
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Pronto para criar a tua loja?
                </h2>

                <p className="mt-5 max-w-xl text-lg leading-8 text-black/60">
                  Junta-te à HOMSTEG e começa a construir a tua presença
                  online.
                </p>
              </div>

              <Button
                className="shrink-0 bg-black text-white hover:bg-slate-900"
                onClick={start}
              >
                Criar minha loja
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-lime-400">
                <Store className="h-4 w-4" />
              </div>

              <span className="font-black">
                HOMSTEG<span className="text-lime-500">.</span>
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              A tua plataforma para criar lojas online.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
            <a href="#recursos" className="hover:text-black">
              Recursos
            </a>
            <a href="#demos" className="hover:text-black">
              Exemplos
            </a>
            <a href="#planos" className="hover:text-black">
              Planos
            </a>
            <a href="#faq" className="hover:text-black">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
