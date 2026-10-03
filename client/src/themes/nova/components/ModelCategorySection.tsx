import {
  ChevronRight,
  Grid2X2,
  Image as ImageIcon,
} from "lucide-react";

import { Link } from "wouter";

import {
  normalizeCategoryCardModel,
  type CategoryCardModel,
} from "../categoryCardModels";

interface ModelCategorySectionProps {
  categories: {
    id: string | number;
    name: string;
    slug: string;
  }[];
  model?: string | null;
  basePath?: string;
  storeSlug?: string;
}

/**
 * Seção de categorias em destaque (tema Nova) com
 * suporte aos 3 modelos escolhíveis na Personalização
 * da loja (secção Seções — cartões de categoria):
 *
 * 1 — Imagem: cartão com imagem de fundo e nome
 *     sobreposto;
 * 2 — Ícone: cartão compacto com ícone;
 * 3 — Borda: cartão claro com borda e seta lateral.
 *
 * A secção só é renderizada quando a loja aplicou um
 * modelo comprado no Market (categoryCardModel definido).
 * Sem modelo aplicado, a loja mantém o comportamento
 * atual (sem secção de categorias).
 */
export function ModelCategorySection({
  categories,
  model,
  basePath = "/themes/nova",
  storeSlug,
}: ModelCategorySectionProps) {
  if (categories.length === 0) {
    return null;
  }

  const cardModel: CategoryCardModel | null = model
    ? normalizeCategoryCardModel(model)
    : null;

  if (!cardModel) {
    return null;
  }

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="mb-4 text-lg font-bold text-slate-950">
        Categorias
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const href = `${basePath}/categoria/${encodeURIComponent(category.slug)}${storeContext}`;

          if (cardModel === "2") {
            return (
              <Link
                key={category.id}
                href={href}
                className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 text-center transition hover:border-emerald-600"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100">
                  <Grid2X2 className="h-5 w-5 text-[#111713]" />
                </span>

                <span className="text-sm font-bold text-[#111713]">
                  {category.name}
                </span>

                <span className="text-[11px] text-gray-400">
                  Ver produtos
                </span>
              </Link>
            );
          }

          if (cardModel === "3") {
            return (
              <Link
                key={category.id}
                href={href}
                className="flex h-28 items-center justify-between gap-3 rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#111713]">
                    {category.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Explorar categoria
                  </p>
                </div>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white">
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </span>
              </Link>
            );
          }

          /* Modelo 1 — imagem com nome sobreposto */
          return (
            <Link
              key={category.id}
              href={href}
              className="group relative h-28 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-[#111713]"
            >
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
                <span className="text-sm font-bold text-white">
                  {category.name}
                </span>
              </div>

              <ImageIcon className="absolute right-3 top-3 h-4 w-4 text-white/50" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default ModelCategorySection;
