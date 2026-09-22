  import {
    ArrowUpRight,
    BarChart3,
    Box,
    Copy,
    ShoppingCart,
    Users,
  } from "lucide-react";
  import { trpc } from "@/lib/trpc";
  import { toast } from "sonner";
  import { getPublicStoreUrl } from "@/lib/store-url";
  
  export default function OverviewPage({
    storeId,
    storeSlug,
  }: {
    storeId?: string;
    storeSlug?: string;
  }) {
    const summaryQuery = trpc.dashboard.summary.useQuery(
      { storeId: storeId ?? "" },
      {
        enabled: Boolean(storeId),
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
      },
    );

    const summary = summaryQuery.data;
    const recentProducts = summary?.products.recent ?? [];
    const publicStoreUrl = storeSlug
      ? getPublicStoreUrl(storeSlug)
      : undefined;

    async function copyPublicStoreUrl() {
      if (!publicStoreUrl) {
        return;
      }

      try {
        await navigator.clipboard.writeText(publicStoreUrl);
        toast.success("URL da loja copiada.");
      } catch {
        const input = document.createElement("textarea");

        input.value = publicStoreUrl;
        input.style.position = "fixed";
        input.style.opacity = "0";

        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();

        toast.success("URL da loja copiada.");
      }
    }

    return (
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600">
            Visão geral
          </p>
  
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Bom dia! 👋
          </h1>
  
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe o desempenho da sua loja num só lugar.
          </p>
        </div>

        {publicStoreUrl && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="public-store-url"
                  className="text-sm font-bold text-slate-950"
                >
                  URL pública da loja
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  Partilhe este endereço com os seus clientes.
                </p>

                <input
                  id="public-store-url"
                  readOnly
                  value={publicStoreUrl}
                  className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={copyPublicStoreUrl}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                <Copy className="h-4 w-4" />
                Copiar
              </button>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Receita total"
            value="0 MZN"
            description="Nenhuma venda registada"
            icon={BarChart3}
          />
  
          <StatCard
            title="Encomendas"
            value="0"
            description="Nenhuma encomenda"
            icon={ShoppingCart}
          />
  
          <StatCard
            title="Clientes"
            value="0"
            description="Nenhum cliente"
            icon={Users}
          />
  
          <StatCard
            title="Produtos"
            value={String(summary?.products.total ?? 0)}
            description={
              summary?.products.total
                ? "Produtos registados"
                : "Comece adicionando produtos"
            }
            icon={Box}
          />
        </div>
  
        {/* Área principal */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Vendas */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Vendas
                </h2>
  
                <p className="mt-1 text-xs text-slate-500">
                  Desempenho das vendas da sua loja.
                </p>
              </div>
  
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Últimos 30 dias
              </button>
            </div>
  
            <div className="mt-6 flex h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                  <BarChart3 className="h-5 w-5 text-slate-400" />
                </div>
  
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  Ainda não existem vendas
                </p>
  
                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                  Quando a sua loja começar a receber encomendas,
                  os dados das vendas aparecerão aqui.
                </p>
              </div>
            </div>
          </div>
  
          {/* Ações rápidas */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Comece a sua loja
              </h2>
  
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Complete estes passos para preparar a sua loja
                para receber clientes.
              </p>
            </div>
  
            <div className="mt-5 space-y-3">
              <QuickAction
                number="01"
                title="Adicionar produtos"
                description="Cadastre os primeiros produtos."
                href="/app/products"
              />
  
              <QuickAction
                number="02"
                title="Criar categorias"
                description="Organize os produtos da loja."
                href="/app/categories"
              />
  
              <QuickAction
                number="03"
                title="Personalizar loja"
                description="Escolha o visual da sua loja."
                href="/store/themes"
              />
  
              <QuickAction
                number="04"
                title="Configurar pagamentos"
                description="Prepare o checkout."
                href="/app/payments"
              />
            </div>
          </div>
        </div>
  
        {/* Produtos e encomendas */}
        <div className="grid gap-6 lg:grid-cols-2">
          <EmptyPanel
            icon={Box}
            title="Produtos recentes"
            description="Os produtos adicionados à sua loja aparecerão aqui."
            action="Ver produtos"
            href="/app/products"
            items={recentProducts.map((product) => product.name)}
          />
  
          <EmptyPanel
            icon={ShoppingCart}
            title="Encomendas recentes"
            description="As encomendas dos seus clientes aparecerão aqui."
            action="Ver encomendas"
            href="/app/orders"
          />
        </div>
      </div>
    );
  }
  
  function StatCard({
    title,
    value,
    description,
    icon: Icon,
  }: {
    title: string;
    value: string;
    description: string;
    icon: typeof BarChart3;
  }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {title}
            </p>
  
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              {value}
            </p>
          </div>
  
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Icon className="h-5 w-5 text-slate-500" />
          </div>
        </div>
  
        <p className="mt-3 text-xs text-slate-400">
          {description}
        </p>
      </div>
    );
  }
  
  function QuickAction({
    number,
    title,
    description,
    href,
  }: {
    number: string;
    title: string;
    description: string;
    href: string;
  }) {
    return (
      <a
        href={href}
        className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-slate-200 hover:bg-slate-50"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-bold text-white">
          {number}
        </div>
  
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-950">
            {title}
          </p>
  
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {description}
          </p>
        </div>
  
        <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-slate-700" />
      </a>
    );
  }
  
  function EmptyPanel({
    icon: Icon,
    title,
    description,
    action,
    href,
    items,
  }: {
    icon: typeof Box;
    title: string;
    description: string;
    action: string;
    href: string;
    items?: string[];
  }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Icon className="h-5 w-5 text-slate-500" />
          </div>
  
          <div>
            <h2 className="text-base font-bold text-slate-950">
              {title}
            </h2>
  
            <p className="mt-0.5 text-xs text-slate-500">
              {description}
            </p>
          </div>
        </div>
  
        <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="truncate text-xs text-slate-400">
            {items?.length
              ? items.join(" · ")
              : "Ainda sem dados"}
          </span>
  
          <a
            href={href}
            className="text-xs font-bold text-slate-700 hover:text-slate-950 hover:underline"
          >
            {action}
          </a>
        </div>
      </div>
    );
  }
