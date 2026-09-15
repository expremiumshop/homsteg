import {
    FolderTree,
    Image as ImageIcon,
    Plus,
    Search,
    ToggleLeft,
  } from "lucide-react";
  import { useMemo, useState } from "react";
  
  type Category = {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string | null;
    active: boolean;
    productCount: number;
  };
  
  const demoCategories: Category[] = [];
  
  export default function CategoriesPage() {
    const [search, setSearch] = useState("");
    const [showInactive, setShowInactive] = useState(false);
  
    const filteredCategories = useMemo(() => {
      const normalizedSearch = search.trim().toLowerCase();
  
      return demoCategories.filter((category) => {
        const matchesSearch =
          !normalizedSearch ||
          category.name.toLowerCase().includes(normalizedSearch) ||
          category.description?.toLowerCase().includes(normalizedSearch);
  
        const matchesStatus = showInactive || category.active;
  
        return matchesSearch && matchesStatus;
      });
    }, [search, showInactive]);
  
    const activeCount = demoCategories.filter(
      (category) => category.active,
    ).length;
  
    const inactiveCount = demoCategories.length - activeCount;
  
    return (
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600">
              Catálogo
            </p>
  
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Categorias
            </h1>
  
            <p className="mt-1 text-sm text-slate-500">
              Organize os produtos da sua loja por categorias.
            </p>
          </div>
  
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Nova categoria
          </button>
        </div>
  
        {/* Estatísticas */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total de categorias"
            value={demoCategories.length}
          />
  
          <StatCard
            label="Categorias ativas"
            value={activeCount}
          />
  
          <StatCard
            label="Categorias inativas"
            value={inactiveCount}
          />
        </div>
  
        {/* Pesquisa e filtros */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar categorias..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>
  
            <button
              type="button"
              onClick={() => setShowInactive((current) => !current)}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition",
                showInactive
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              <ToggleLeft className="h-4 w-4" />
  
              {showInactive
                ? "Ocultar inativas"
                : "Mostrar inativas"}
            </button>
          </div>
        </div>
  
        {/* Desktop */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Categoria
                </th>
  
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Produtos
                </th>
  
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Estado
                </th>
  
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Ações
                </th>
              </tr>
            </thead>
  
            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/50"
                >
                  <td className="px-5 py-4">
                    <CategoryIdentity category={category} />
                  </td>
  
                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                    {category.productCount}
                  </td>
  
                  <td className="px-5 py-4">
                    <StatusBadge active={category.active} />
                  </td>
  
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-lg px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          {filteredCategories.length === 0 && (
            <EmptyCategoriesState search={search} />
          )}
        </div>
  
        {/* Mobile */}
        <div className="space-y-3 md:hidden">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <CategoryIdentity category={category} />
  
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Produtos
                  </p>
  
                  <p className="mt-1 text-sm font-bold text-slate-950">
                    {category.productCount}
                  </p>
                </div>
  
                <StatusBadge active={category.active} />
              </div>
  
              <button
                type="button"
                className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Editar categoria
              </button>
            </div>
          ))}
  
          {filteredCategories.length === 0 && (
            <EmptyCategoriesState search={search} />
          )}
        </div>
      </div>
    );
  }
  
  function StatCard({
    label,
    value,
  }: {
    label: string;
    value: number;
  }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>
  
        <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          {value}
        </p>
      </div>
    );
  }
  
  function CategoryIdentity({
    category,
  }: {
    category: Category;
  }) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <FolderTree className="h-5 w-5 text-slate-400" />
          )}
        </div>
  
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-950">
            {category.name}
          </p>
  
          {category.description ? (
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {category.description}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-slate-400">
              Sem descrição
            </p>
          )}
        </div>
      </div>
    );
  }
  
  function StatusBadge({
    active,
  }: {
    active: boolean;
  }) {
    if (active) {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
          Ativa
        </span>
      );
    }
  
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
        Inativa
      </span>
    );
  }
  
  function EmptyCategoriesState({
    search,
  }: {
    search: string;
  }) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          {search ? (
            <Search className="h-6 w-6 text-slate-400" />
          ) : (
            <ImageIcon className="h-6 w-6 text-slate-400" />
          )}
        </div>
  
        <h3 className="mt-4 text-sm font-bold text-slate-950">
          {search
            ? "Nenhuma categoria encontrada"
            : "Ainda não existem categorias"}
        </h3>
  
        <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
          {search
            ? "Tente pesquisar usando outro nome."
            : "Crie a primeira categoria para começar a organizar os produtos da sua loja."}
        </p>
  
        {!search && (
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Criar categoria
          </button>
        )}
      </div>
    );
  }