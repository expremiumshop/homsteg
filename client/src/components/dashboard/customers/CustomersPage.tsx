import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserPlus,
  ShoppingBag,
  MoreHorizontal,
} from "lucide-react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  createdAt: string;
};

const demoCustomers: Customer[] = [];

function formatMzn(value: number) {
  return `${value.toLocaleString("pt-MZ")} MZN`;
}

function EmptyCustomers() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Users className="h-7 w-7 text-slate-400" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        Nenhum cliente encontrado
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Os clientes da sua loja aparecerão aqui quando começarem a realizar
        compras.
      </p>
    </div>
  );
}

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(demoCustomers);
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term),
    );
  }, [customers, search]);

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.orders > 0,
  ).length;

  const newCustomers = customers.filter((customer) => {
    const created = new Date(customer.createdAt);
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return created >= thirtyDaysAgo;
  }).length;

  const totalOrders = customers.reduce(
    (total, customer) => total + customer.orders,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
          Gestão de clientes
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Clientes
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Consulte e acompanhe os clientes da sua loja.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total de clientes
            </span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {totalCustomers}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Clientes registados
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Clientes ativos
            </span>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {activeCustomers}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Com pelo menos uma compra
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Novos clientes
            </span>
            <UserPlus className="h-4 w-4 text-blue-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {newCustomers}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Últimos 30 dias
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Encomendas
            </span>
            <ShoppingBag className="h-4 w-4 text-violet-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {totalOrders}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Compras realizadas
          </div>
        </div>
      </div>

      {/* Customers */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Toolbar */}
        <div className="border-b border-slate-100 p-4">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar cliente..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Cliente
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Contacto
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Encomendas
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Total gasto
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Cliente desde
                </th>

                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                        {customer.name
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="text-sm font-medium text-slate-800">
                          {customer.name}
                        </div>

                        <div className="mt-0.5 text-xs text-slate-400">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {customer.phone}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {customer.orders}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                    {formatMzn(customer.totalSpent)}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {customer.createdAt}
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`Ações de ${customer.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && <EmptyCustomers />}
        </div>

        {/* Mobile */}
        <div className="divide-y divide-slate-100 md:hidden">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                    {customer.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {customer.name}
                    </div>

                    <div className="mt-0.5 truncate text-xs text-slate-400">
                      {customer.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                  aria-label={`Ações de ${customer.name}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Contacto
                  </div>

                  <div className="mt-1 text-sm text-slate-600">
                    {customer.phone}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Encomendas
                  </div>

                  <div className="mt-1 text-sm font-medium text-slate-700">
                    {customer.orders}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Total gasto
                  </div>

                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {formatMzn(customer.totalSpent)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Cliente desde
                  </div>

                  <div className="mt-1 text-sm text-slate-600">
                    {customer.createdAt}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCustomers.length === 0 && <EmptyCustomers />}
        </div>
      </div>
    </div>
  );
}