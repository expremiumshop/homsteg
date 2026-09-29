import {
    FolderTree,
    Image as ImageIcon,
    Plus,
    Search,
    X,
  } from "lucide-react";
  import { useMemo, useState } from "react";
  import { trpc } from "@/lib/trpc";

  type Category = {
    id: string;
    name: string;
    productCount: number;
  };

  export default function CategoriesPage({
    storeId,
  }: {
    storeId?: string;
  }) {
    const [search, setSearch] = useState("");

    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const productsQuery = trpc.products.list.useQuery(
      { storeId: storeId ?? "" },
      {
        enabled: Boolean(storeId),
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
      },
    );

    const categoriesQuery = trpc.categories.list.useQuery(
      { storeId: storeId ?? "" },
      {
        enabled: Boolean(storeId),
        refetchOnWindowFocus: true,
      },
    );

    const createCategory =
      trpc.categories.create.useMutation();
    const renameCategory =
      trpc.categories.rename.useMutation();

    const utils = trpc.useUtils();

    /*
     * Categorias reais da loja, criadas pelo utilizador.
     * A contagem de produtos é apenas estatística:
     * as categorias NUNCA são derivadas dos produtos.
     */
    const categories = useMemo<Category[]>(() => {
      const rows = categoriesQuery.data ?? [];
      const products = productsQuery.data ?? [];

      const countByNormalizedName = new Map<
        string,
        number
      >();

      for (const product of products) {
        if (!product.category) {
          continue;
        }

        const key = product.category
          .trim()
          .toLowerCase();

        countByNormalizedName.set(
          key,
          (countByNormalizedName.get(key) ?? 0) + 1,
        );
      }

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        productCount:
          countByNormalizedName.get(
            row.name.toLowerCase(),
          ) ?? 0,
      }));
    }, [categoriesQuery.data, productsQuery.data]);

    const filteredCategories = useMemo(() => {
      const normalizedSearch = search.trim().toLowerCase();

      if (!normalizedSearch) {
        return categories;
      }

      return categories.filter((category) =>
        category.name
          .toLowerCase()
          .includes(normalizedSearch),
      );
    }, [categories, search]);

    const productsLinked = categories.reduce(
      (total, category) => total + category.productCount,
      0,
    );

    async function handleCreate(name: string) {
      if (!storeId) {
        return;
      }

      await createCategory.mutateAsync({
        storeId,
        name,
      });

      await utils.categories.list.invalidate({
        storeId,
      });
      await utils.products.list.invalidate({
        storeId,
      });

      setCreating(false);
    }

    async function handleRename(
      category: Category,
      name: string,
    ) {
      if (!storeId) {
        return;
      }

      await renameCategory.mutateAsync({
        storeId,
        categoryId: category.id,
        name,
      });

      await utils.categories.list.invalidate({
        storeId,
      });
      await utils.products.list.invalidate({
        storeId,
      });

      setEditing(null);
    }

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
            onClick={() => setCreating(true)}
            disabled={!storeId}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Nova categoria
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Total de categorias"
            value={categories.length}
          />

          <StatCard
            label="Produtos associados"
            value={productsLinked}
          />
        </div>

        {/* Pesquisa */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
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

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing(category)}
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
            <EmptyCategoriesState
              search={search}
              onCreate={() => setCreating(true)}
            />
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

                <button
                  type="button"
                  onClick={() => setEditing(category)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <EmptyCategoriesState
              search={search}
              onCreate={() => setCreating(true)}
            />
          )}
        </div>

        {creating && (
          <CategoryFormModal
            title="Nova categoria"
            submitLabel="Criar categoria"
            pending={createCategory.isPending}
            onClose={() => setCreating(false)}
            onSubmit={handleCreate}
          />
        )}

        {editing && (
          <CategoryFormModal
            title="Editar categoria"
            submitLabel="Guardar alterações"
            initialName={editing.name}
            pending={renameCategory.isPending}
            onClose={() => setEditing(null)}
            onSubmit={(name) => handleRename(editing, name)}
          />
        )}
      </div>
    );
  }

  function CategoryFormModal({
    title,
    submitLabel,
    initialName = "",
    pending,
    onClose,
    onSubmit,
  }: {
    title: string;
    submitLabel: string;
    initialName?: string;
    pending: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void | Promise<void>;
  }) {
    const [name, setName] = useState(initialName);
    const [error, setError] = useState("");

    const trimmed = name.trim();

    function handleSubmit() {
      if (!trimmed) {
        setError("Digite o nome da categoria.");
        return;
      }

      if (trimmed.length > 80) {
        setError("O nome deve ter no máximo 80 caracteres.");
        return;
      }

      setError("");
      void onSubmit(trimmed);
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-bold text-slate-950">
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 px-5 py-5">
            <label className="block text-sm font-medium text-slate-700">
              Nome da categoria

              <input
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
                maxLength={80}
                autoFocus
                placeholder="Ex: Moda masculina"
                className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={pending}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "A guardar..." : submitLabel}
            </button>
          </div>
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
          <FolderTree className="h-5 w-5 text-slate-400" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-950">
            {category.name}
          </p>
        </div>
      </div>
    );
  }

  function EmptyCategoriesState({
    search,
    onCreate,
  }: {
    search: string;
    onCreate: () => void;
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
            onClick={onCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Criar categoria
          </button>
        )}
      </div>
    );
  }
