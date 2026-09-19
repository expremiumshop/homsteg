import { useEffect, useMemo, useState } from "react";

import {
  Archive,
  CheckCircle2,
  Package,
  Plus,
  Search,
  XCircle,
} from "lucide-react";

import NewProductModal from "./NewProductModal";
import { trpc } from "@/lib/trpc";

type ProductStatus = "active" | "draft" | "archived";

type Product = {
  id: number;
  name: string;
  category: string;
  priceMzn: number;
  stock: number;
  status: ProductStatus;
  imageUrl?: string | null;
};

function formatMzn(value: number) {
  return `${value.toLocaleString("pt-MZ")} MZN`;
}

function getStatusLabel(status: ProductStatus) {
  if (status === "active") return "Ativo";
  if (status === "draft") return "Rascunho";
  return "Arquivado";
}

function StatusBadge({ status }: { status: ProductStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {getStatusLabel(status)}
      </span>
    );
  }

  if (status === "draft") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
        <Package className="h-3.5 w-3.5" />
        {getStatusLabel(status)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
      <XCircle className="h-3.5 w-3.5" />
      {getStatusLabel(status)}
    </span>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="text-sm font-medium text-red-600">
        Sem stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="text-sm font-medium text-amber-600">
        {stock} unidades
      </span>
    );
  }

  return (
    <span className="text-sm text-slate-600">
      {stock} unidades
    </span>
  );
}

function EmptyProducts() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Package className="h-7 w-7 text-slate-400" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        Nenhum produto encontrado
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Os produtos da sua loja aparecerão aqui quando começar a
        adicioná-los.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
  iconClassName,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>

        <span className={iconClassName}>{icon}</span>
      </div>

      <div className="mt-3 text-2xl font-semibold text-slate-950">
        {value}
      </div>

      <div className="mt-1 text-xs text-slate-400">
        {description}
      </div>
    </div>
  );
}

export default function ProductsPage({
  storeId,
}: {
  storeId?: string;
}) {
  const productsQuery = trpc.products.list.useQuery(
    { storeId: storeId ?? "" },
    {
      enabled: Boolean(storeId),
      refetchInterval: 30_000,
      refetchOnWindowFocus: true,
    },
  );

  const products = (productsQuery.data ?? []) as Product[];

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | ProductStatus
  >("all");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [showNewProduct, setShowNewProduct] = useState(false);

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) =>
        products.some((product) => product.id === id),
      ),
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        product.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.status === "active",
  ).length;

  const draftProducts = products.filter(
    (product) => product.status === "draft",
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0,
  ).length;

  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) =>
      selectedIds.includes(product.id),
    );

  function toggleProduct(id: number) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((productId) => productId !== id)
        : [...current, id],
    );
  }

  function toggleAllVisible() {
    if (allVisibleSelected) {
      setSelectedIds((current) =>
        current.filter(
          (id) =>
            !filteredProducts.some(
              (product) => product.id === id,
            ),
        ),
      );

      return;
    }

    setSelectedIds((current) => {
      const ids = new Set(current);

      filteredProducts.forEach((product) => {
        ids.add(product.id);
      });

      return Array.from(ids);
    });
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
            Gestão de produtos
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                Produtos
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Adicione, organize e acompanhe os produtos da sua loja.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowNewProduct(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Novo produto
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total de produtos"
            value={totalProducts}
            description="Produtos registados"
            icon={<Package className="h-4 w-4" />}
            iconClassName="text-slate-400"
          />

          <StatCard
            label="Produtos ativos"
            value={activeProducts}
            description="Disponíveis na loja"
            icon={<CheckCircle2 className="h-4 w-4" />}
            iconClassName="text-emerald-500"
          />

          <StatCard
            label="Rascunhos"
            value={draftProducts}
            description="Ainda não publicados"
            icon={<Package className="h-4 w-4" />}
            iconClassName="text-blue-500"
          />

          <StatCard
            label="Sem stock"
            value={outOfStockProducts}
            description="Produtos sem unidades"
            icon={<Archive className="h-4 w-4" />}
            iconClassName="text-red-500"
          />
        </div>

        {/* Products */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Pesquisar produto..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`h-9 shrink-0 rounded-lg px-3 text-xs font-medium transition ${
                    statusFilter === "all"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  Todos
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("active")}
                  className={`h-9 shrink-0 rounded-lg px-3 text-xs font-medium transition ${
                    statusFilter === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  Ativos
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("draft")}
                  className={`h-9 shrink-0 rounded-lg px-3 text-xs font-medium transition ${
                    statusFilter === "draft"
                      ? "bg-slate-100 text-slate-700"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  Rascunhos
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("archived")}
                  className={`h-9 shrink-0 rounded-lg px-3 text-xs font-medium transition ${
                    statusFilter === "archived"
                      ? "bg-red-50 text-red-600"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  Arquivados
                </button>
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            {filteredProducts.length === 0 ? (
              <EmptyProducts />
            ) : (
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="w-12 px-5 py-3">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleAllVisible}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 accent-emerald-600"
                        aria-label="Selecionar todos os produtos"
                      />
                    </th>

                    <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Produto
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Categoria
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Preço
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Stock
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Estado
                    </th>

                    <th className="w-24 px-5 py-3" />
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(
                            product.id,
                          )}
                          onChange={() =>
                            toggleProduct(product.id)
                          }
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 accent-emerald-600"
                          aria-label={`Selecionar ${product.name}`}
                        />
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-4 w-4 text-slate-400" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-slate-800">
                              {product.name}
                            </div>

                            <div className="mt-0.5 text-xs text-slate-400">
                              ID #{product.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {product.category}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        {formatMzn(product.priceMzn)}
                      </td>

                      <td className="px-5 py-4">
                        <StockBadge stock={product.stock} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={product.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          className="h-8 rounded-lg px-3 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 accent-emerald-600"
                    aria-label={`Selecionar ${product.name}`}
                  />

                  <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {product.name}
                        </div>

                        <div className="mt-0.5 truncate text-xs text-slate-400">
                          {product.category}
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={product.status} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 pl-7">
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Preço
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {formatMzn(product.priceMzn)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Stock
                    </div>

                    <div className="mt-1">
                      <StockBadge stock={product.stock} />
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Categoria
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      {product.category}
                    </div>
                  </div>

                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      className="h-8 rounded-lg px-3 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && <EmptyProducts />}
          </div>

          {/* Selected products info */}
          {selectedIds.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-500">
                  {selectedIds.length} produto
                  {selectedIds.length === 1 ? "" : "s"} selecionado
                  {selectedIds.length === 1 ? "" : "s"}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-xs font-medium text-slate-500 transition hover:text-slate-800"
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNewProduct && (
        <NewProductModal
          storeId={storeId}
          onClose={() => setShowNewProduct(false)}
        />
      )}
    </>
  );
}
