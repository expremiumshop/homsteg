import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Package,
  Clock3,
  CheckCircle2,
  XCircle,
  Truck,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  items: number;
  date: string;
  status: OrderStatus;
};

const demoOrders: Order[] = [];

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendente",
  processing: "Em preparação",
  shipped: "Enviado",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const statusClasses: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-violet-50 text-violet-700 border-violet-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

function formatMzn(value: number) {
  return `${value.toLocaleString("pt-MZ")} MZN`;
}

function StatusIcon({ status }: { status: OrderStatus }) {
  if (status === "pending") {
    return <Clock3 className="h-3.5 w-3.5" />;
  }

  if (status === "processing") {
    return <Package className="h-3.5 w-3.5" />;
  }

  if (status === "shipped") {
    return <Truck className="h-3.5 w-3.5" />;
  }

  if (status === "completed") {
    return <CheckCircle2 className="h-3.5 w-3.5" />;
  }

  return <XCircle className="h-3.5 w-3.5" />;
}

function EmptyOrders() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Package className="h-7 w-7 text-slate-400" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        Nenhuma encomenda encontrada
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        As encomendas dos seus clientes aparecerão aqui assim que a sua loja
        começar a receber pedidos.
      </p>
    </div>
  );
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>(demoOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "processing",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
            Gestão de vendas
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Encomendas
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Acompanhe e gerencie as encomendas da sua loja.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total
            </span>
            <Package className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {totalOrders}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Todas as encomendas
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Pendentes
            </span>
            <Clock3 className="h-4 w-4 text-amber-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {pendingOrders}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Aguardando processamento
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Em preparação
            </span>
            <Package className="h-4 w-4 text-blue-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {processingOrders}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Sendo preparados
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Concluídas
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {completedOrders}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Pedidos finalizados
          </div>
        </div>
      </div>

      {/* Orders card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar por encomenda ou cliente..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | OrderStatus)
              }
              className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">Todos os estados</option>
              <option value="pending">Pendentes</option>
              <option value="processing">Em preparação</option>
              <option value="shipped">Enviados</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Encomenda
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Cliente
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Itens
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Estado
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Data
                </th>

                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                >
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-slate-900">
                      #{order.id}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <div className="text-sm font-medium text-slate-800">
                        {order.customer}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {order.email}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {order.items}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                    {formatMzn(order.total)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[order.status]}`}
                    >
                      <StatusIcon status={order.status} />
                      {statusLabels[order.status]}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {order.date}
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`Ações da encomenda ${order.id}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && <EmptyOrders />}
        </div>

        {/* Mobile */}
        <div className="divide-y divide-slate-100 md:hidden">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    #{order.id}
                  </div>

                  <div className="mt-1 text-sm text-slate-600">
                    {order.customer}
                  </div>

                  <div className="mt-0.5 text-xs text-slate-400">
                    {order.email}
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                  aria-label={`Ações da encomenda ${order.id}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Total
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {formatMzn(order.total)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Itens
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-700">
                    {order.items}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Estado
                  </div>

                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[order.status]}`}
                    >
                      <StatusIcon status={order.status} />
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Data
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {order.date}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && <EmptyOrders />}
        </div>
      </div>
    </div>
  );
}