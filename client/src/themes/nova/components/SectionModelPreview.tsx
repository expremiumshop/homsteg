import {
  ChevronRight,
  Grid2X2,
  Image as ImageIcon,
  Mail,
  Menu,
  MessageCircle,
  Search,
  Send,
  ShoppingCart,
  User,
} from "lucide-react";

import {
  HEADER_MODELS,
  HEADER_UNLOCKABLE_MODELS,
  getHeaderModelLabel,
  type HeaderModel,
} from "../headerModels";

import {
  FOOTER_MODELS,
  FOOTER_UNLOCKABLE_MODELS,
  getFooterModelLabel,
  type FooterModel,
} from "../footerModels";

import {
  CATEGORY_CARD_MODELS,
  CATEGORY_CARD_UNLOCKABLE_MODELS,
  getCategoryCardModelLabel,
  type CategoryCardModel,
} from "../categoryCardModels";

/* =========================================================
   Miniaturas + seletores dos modelos de Header,
   Footer e Cartões de Categoria (Seções) — mesma
   linguagem visual dos seletores existentes
   (cartões brancos, bordas cinza, seleção com anel
   escuro, badge "Ativo").
   ========================================================= */

const HEADER_MODEL_HINTS: Record<HeaderModel, string> = {
  "1": "Header atual da loja.",
  "2": "Barra única minimalista.",
  "3": "Barra escura centrada.",
};

function HeaderMiniature({ model }: { model: HeaderModel }) {
  if (model === "2") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex h-10 items-center justify-between px-2.5">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-lime-400 text-[9px] font-black text-[#111713]">
              M
            </span>

            <span className="h-1.5 w-10 rounded bg-slate-300" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="hidden h-5 w-16 items-center rounded-md border border-gray-200 sm:flex">
              <Search size={9} className="mx-auto text-gray-400" />
            </span>

            <ShoppingCart size={11} className="text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  if (model === "3") {
    return (
      <div className="overflow-hidden rounded-xl bg-[#111713] shadow-sm">
        <div className="flex flex-col items-center gap-1 px-2.5 py-2">
          <span className="h-1.5 w-12 rounded bg-white/80" />

          <span className="flex h-4 w-full items-center rounded-full bg-white/10">
            <Search size={8} className="ml-1.5 text-gray-300" />
          </span>
        </div>
      </div>
    );
  }

  /* Modelo 1 — clássico: topbar + barra principal */
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex h-2.5 items-center justify-between bg-[#111713] px-2">
        <span className="h-1 w-8 rounded bg-white/50" />

        <span className="h-1 w-6 rounded bg-white/30" />
      </div>

      <div className="flex h-8 items-center gap-1.5 px-2.5">
        <span className="h-1.5 w-10 rounded bg-slate-800" />

        <span className="ml-auto flex h-4 w-16 items-center rounded-full border-2 border-emerald-600" />
      </div>
    </div>
  );
}

/**
 * Seletor dos modelos de header. Quando `unlockedModels`
 * é fornecido, APENAS os modelos comprados no Market
 * aparecem; sem compras, a secção fica vazia.
 */
export function HeaderModelSelector({
  value,
  onChange,
  disabled = false,
  unlockedModels,
}: {
  value: string | null | undefined;
  onChange: (model: HeaderModel) => void;
  disabled?: boolean;
  unlockedModels?: readonly HeaderModel[] | null;
}) {
  const selected = value ?? "1";

  const visibleModels =
    unlockedModels === undefined
      ? HEADER_MODELS
      : HEADER_UNLOCKABLE_MODELS.filter((model) =>
          (unlockedModels ?? []).includes(model),
        );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visibleModels.map((model) => {
        const isActive = model === selected;

        return (
          <button
            key={model}
            type="button"
            disabled={disabled}
            onClick={() => onChange(model)}
            className={`
              overflow-hidden rounded-2xl border bg-white p-4 text-left transition
              ${
                isActive
                  ? "border-[#111713] ring-1 ring-[#111713]"
                  : "border-gray-200 hover:border-gray-300"
              }
              disabled:cursor-not-allowed disabled:opacity-60
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#111713]">
                  {getHeaderModelLabel(model)}
                </h4>

                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  {HEADER_MODEL_HINTS[model]}
                </p>
              </div>

              {isActive && (
                <span className="rounded-full bg-[#111713] px-2.5 py-1 text-[10px] font-bold text-white">
                  Ativo
                </span>
              )}
            </div>

            <div className="mt-4">
              <HeaderMiniature model={model} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

const FOOTER_MODEL_HINTS: Record<FooterModel, string> = {
  "1": "Footer atual da loja.",
  "2": "Fundo escuro com newsletter.",
  "3": "Uma linha minimalista.",
};

function FooterMiniature({ model }: { model: FooterModel }) {
  if (model === "2") {
    return (
      <div className="overflow-hidden rounded-xl bg-[#111713] shadow-sm">
        <div className="grid grid-cols-2 gap-2 px-2.5 py-2">
          <div className="space-y-1">
            <span className="block h-1.5 w-12 rounded bg-white/70" />

            <span className="flex h-3.5 items-center rounded-full bg-white/10" />
          </div>

          <div className="space-y-1">
            <span className="block h-1.5 w-8 rounded bg-white/50" />

            <span className="block h-1 w-10 rounded bg-white/30" />

            <span className="block h-1 w-8 rounded bg-white/30" />
          </div>
        </div>
      </div>
    );
  }

  if (model === "3") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-2.5 py-2">
          <span className="h-1.5 w-8 rounded bg-slate-800" />

          <span className="h-1 w-10 rounded bg-slate-300" />

          <span className="h-1 w-6 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  /* Modelo 1 — clássico: colunas de links */
  return (
    <div className="overflow-hidden rounded-xl bg-blue-950 shadow-sm">
      <div className="grid grid-cols-3 gap-2 px-2.5 py-2.5">
        <span className="block h-1.5 w-8 rounded bg-white/70" />

        <span className="block h-1.5 w-8 rounded bg-white/70" />

        <span className="block h-1.5 w-8 rounded bg-white/70" />

        <span className="block h-1 w-10 rounded bg-white/30" />

        <span className="block h-1 w-9 rounded bg-white/30" />

        <span className="block h-1 w-10 rounded bg-white/30" />
      </div>
    </div>
  );
}

/**
 * Seletor dos modelos de footer. Quando `unlockedModels`
 * é fornecido, APENAS os modelos comprados no Market
 * aparecem; sem compras, a secção fica vazia.
 */
export function FooterModelSelector({
  value,
  onChange,
  disabled = false,
  unlockedModels,
}: {
  value: string | null | undefined;
  onChange: (model: FooterModel) => void;
  disabled?: boolean;
  unlockedModels?: readonly FooterModel[] | null;
}) {
  const selected = value ?? "1";

  const visibleModels =
    unlockedModels === undefined
      ? FOOTER_MODELS
      : FOOTER_UNLOCKABLE_MODELS.filter((model) =>
          (unlockedModels ?? []).includes(model),
        );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visibleModels.map((model) => {
        const isActive = model === selected;

        return (
          <button
            key={model}
            type="button"
            disabled={disabled}
            onClick={() => onChange(model)}
            className={`
              overflow-hidden rounded-2xl border bg-white p-4 text-left transition
              ${
                isActive
                  ? "border-[#111713] ring-1 ring-[#111713]"
                  : "border-gray-200 hover:border-gray-300"
              }
              disabled:cursor-not-allowed disabled:opacity-60
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#111713]">
                  {getFooterModelLabel(model)}
                </h4>

                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  {FOOTER_MODEL_HINTS[model]}
                </p>
              </div>

              {isActive && (
                <span className="rounded-full bg-[#111713] px-2.5 py-1 text-[10px] font-bold text-white">
                  Ativo
                </span>
              )}
            </div>

            <div className="mt-4">
              <FooterMiniature model={model} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

const CATEGORY_MODEL_HINTS: Record<
  CategoryCardModel,
  string
> = {
  "1": "Imagem com nome sobreposto.",
  "2": "Ícone com contagem de produtos.",
  "3": "Borda clara com seta lateral.",
};

function CategoryMiniature({
  model,
}: {
  model: CategoryCardModel;
}) {
  if (model === "2") {
    return (
      <div className="flex h-12 flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white shadow-sm">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime-100">
          <Grid2X2 size={9} className="text-[#111713]" />
        </span>

        <span className="h-1 w-12 rounded bg-slate-300" />
      </div>
    );
  }

  if (model === "3") {
    return (
      <div className="flex h-12 items-center justify-between rounded-xl bg-gray-50 px-2.5 shadow-sm">
        <div className="space-y-1">
          <span className="block h-1.5 w-12 rounded bg-slate-400" />

          <span className="block h-1 w-9 rounded bg-slate-200" />
        </div>

        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-200 bg-white">
          <ChevronRight size={9} className="text-gray-500" />
        </span>
      </div>
    );
  }

  /* Modelo 1 — imagem com nome sobreposto */
  return (
    <div className="relative h-12 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-900 to-[#111713] shadow-sm">
      <ImageIcon
        size={10}
        className="absolute right-1.5 top-1.5 text-white/50"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
        <span className="block h-1.5 w-12 rounded bg-white/90" />
      </div>
    </div>
  );
}

/**
 * Seletor dos modelos de cartões de categoria (Seções).
 * Quando `unlockedModels` é fornecido, APENAS os modelos
 * comprados no Market aparecem; sem compras, a secção
 * fica vazia.
 */
export function CategoryCardModelSelector({
  value,
  onChange,
  disabled = false,
  unlockedModels,
}: {
  value: string | null | undefined;
  onChange: (model: CategoryCardModel) => void;
  disabled?: boolean;
  unlockedModels?: readonly CategoryCardModel[] | null;
}) {
  const selected = value ?? "1";

  const visibleModels =
    unlockedModels === undefined
      ? CATEGORY_CARD_MODELS
      : CATEGORY_CARD_UNLOCKABLE_MODELS.filter((model) =>
          (unlockedModels ?? []).includes(model),
        );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visibleModels.map((model) => {
        const isActive = model === selected;

        return (
          <button
            key={model}
            type="button"
            disabled={disabled}
            onClick={() => onChange(model)}
            className={`
              overflow-hidden rounded-2xl border bg-white p-4 text-left transition
              ${
                isActive
                  ? "border-[#111713] ring-1 ring-[#111713]"
                  : "border-gray-200 hover:border-gray-300"
              }
              disabled:cursor-not-allowed disabled:opacity-60
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#111713]">
                  {getCategoryCardModelLabel(model)}
                </h4>

                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  {CATEGORY_MODEL_HINTS[model]}
                </p>
              </div>

              {isActive && (
                <span className="rounded-full bg-[#111713] px-2.5 py-1 text-[10px] font-bold text-white">
                  Ativo
                </span>
              )}
            </div>

            <div className="mt-4">
              <CategoryMiniature model={model} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
