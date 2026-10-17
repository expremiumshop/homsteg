import {
  ChevronRight,
  Grid2X2,
  Image as ImageIcon,
  ArrowUpRight,
} from "lucide-react";

import { Link } from "wouter";

import {
  normalizeCategoryCardModel,
  type CategoryCardModel,
} from "../categoryCardModels";

import { useI18n } from "@/lib/i18n-context";

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
  /*
   * Antes dos returns antecipados (regra dos hooks).
   */
  const { t } = useI18n();

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
        {t("categories.title")}
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
                  {t("categories.viewProducts")}
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
                    {t("categories.explore")}
                  </p>
                </div>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white">
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </span>
              </Link>
            );
          }

          if (cardModel === "4") {
            return (
              <Link key={category.id} href={href} className="flex items-center gap-4 rounded-xl border border-sky-100 bg-sky-50 p-4">
                <span className="text-3xl font-black text-sky-200">01</span>
                <span className="min-w-0 flex-1"><strong className="block truncate text-sm text-sky-950">{category.name}</strong><small className="text-[11px] text-sky-700">{t("categories.explore")}</small></span>
                <ArrowUpRight size={18} className="text-sky-700" />
              </Link>
            );
          }

          if (cardModel === "5") {
            return (
              <Link key={category.id} href={href} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-700 to-purple-950 p-5 text-white">
                <span className="absolute right-4 top-3 text-xl text-fuchsia-200">✦</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-fuchsia-200">{t("categories.title")}</span>
                <strong className="mt-5 block text-lg">{category.name}</strong>
                <small className="mt-1 block text-white/75">{t("categories.viewProducts")}</small>
              </Link>
            );
          }

          if (cardModel === "6") {
            return (
              <Link key={category.id} href={href} className="flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 p-2 pr-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-200 text-lg text-amber-950">✦</span>
                <span className="min-w-0 flex-1"><strong className="block truncate text-sm text-amber-950">{category.name}</strong><small className="text-[10px] text-amber-700">{t("categories.viewProducts")}</small></span>
                <ChevronRight size={18} className="text-amber-700" />
              </Link>
            );
          }

          if (cardModel === "7") {
            return (
              <Link key={category.id} href={href} className="border-l-4 border-rose-500 bg-white px-4 py-3 shadow-sm">
                <small className="text-[9px] uppercase tracking-widest text-rose-500">{t("categories.title")}</small>
                <span className="mt-1 flex items-center justify-between gap-2"><strong className="truncate font-serif text-base text-slate-900">{category.name}</strong><ArrowUpRight size={16} className="shrink-0 text-rose-500" /></span>
              </Link>
            );
          }

          if (cardModel === "8") {
            return (
              <Link key={category.id} href={href} className="grid grid-cols-[1fr_auto] overflow-hidden rounded-xl border border-slate-200 bg-white">
                <span className="p-4"><small className="text-[9px] font-bold uppercase tracking-wider text-teal-700">{t("categories.title")}</small><strong className="mt-1 block text-sm text-slate-900">{category.name}</strong><small className="mt-1 block text-[10px] text-slate-500">{t("categories.explore")}</small></span>
                <span className="flex w-14 items-center justify-center bg-teal-700 text-white"><ChevronRight size={18} /></span>
              </Link>
            );
          }

          if (cardModel === "9") {
            return (
              <Link key={category.id} href={href} className="flex items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-white">
                <span className="h-2 w-2 rounded-full bg-lime-400" />
                <strong className="flex-1 text-xs">{category.name}</strong>
                <small className="text-[9px] text-slate-300">{t("categories.viewProducts")}</small>
                <ChevronRight size={15} className="text-lime-300" />
              </Link>
            );
          }

          if (cardModel === "10") {
            return (
              <Link key={category.id} href={href} className="rounded-xl border border-emerald-200 bg-white p-4">
                <span className="flex items-start justify-between"><small className="rounded-md bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-800">01 / 04</small><ArrowUpRight size={16} className="text-emerald-700" /></span>
                <strong className="mt-5 block text-base font-black tracking-tight text-slate-900">{category.name}</strong>
                <span className="mt-2 block h-1 w-10 rounded-full bg-emerald-500" />
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
