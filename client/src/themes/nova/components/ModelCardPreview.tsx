import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";

import {
  PRODUCT_CARD_MODELS,
  PRODUCT_CARD_UNLOCKABLE_MODELS,
  getProductCardModelLabel,
  type ProductCardModel,
} from "../productCardModels";

import {
  NAV_BUTTON_MODELS,
  NAV_BUTTON_UNLOCKABLE_MODELS,
  getNavButtonModelLabel,
  type NavButtonModel,
} from "../navButtonModels";

type PreviewImage = string | null;

/**
 * Miniatura estática de cada modelo, desenhada com a
 * mesma linguagem visual do cartão real do tema Nova
 * (rounded-2xl, shadow-sm, bg-white, emerald-600).
 */
function ModelMiniature({
  model,
  image,
}: {
  model: ProductCardModel;
  image: PreviewImage;
}) {
  const img = (
    <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-slate-100">
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 rounded-lg bg-slate-200" />
        </div>
      )}
    </div>
  );

  if (model === "2") {
    return <div className="overflow-hidden rounded-2xl shadow-sm">{img}</div>;
  }

  if (model === "3") {
    return (
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {img}

        <div className="px-2 py-1.5">
          <span className="text-[11px] font-bold text-slate-900">
            1 250,00 MZN
          </span>
        </div>
      </div>
    );
  }

  if (model === "4") {
    return (
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {img}

        <div className="px-2 py-1.5">
          <div className="h-2.5 w-4/5 rounded bg-slate-300" />
        </div>
      </div>
    );
  }

  if (model === "5") {
    return (
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {img}

        <div className="flex flex-col gap-1 px-2 py-1.5">
          <div className="h-2.5 w-4/5 rounded bg-slate-300" />

          <span className="text-[11px] font-bold text-slate-900">
            1 250,00 MZN
          </span>

          <span className="mt-0.5 flex h-6 items-center justify-center gap-1 rounded-lg bg-emerald-600 text-[10px] font-bold text-white">
            <MessageCircle size={11} />
            Comprar
          </span>
        </div>
      </div>
    );
  }

  /* Modelo 6 — Elevado (Market 1product) */
  if (model === "6") {
    return (
      <div className="flex h-28 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {img}

        <div className="flex flex-1 flex-col p-1.5">
          <span className="h-1 w-6 rounded bg-slate-200" />

          <span className="mt-0.5 h-1.5 w-4/5 rounded bg-slate-300" />

          <div className="mt-auto flex items-center justify-between">
            <span className="text-[8px] font-black text-emerald-700">
              1 250 MT
            </span>

            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#111713] text-[7px] font-bold text-white">
              +
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* Modelo 7 — Compacto (Market 2product) */
  if (model === "7") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {img}

        <div className="p-1.5">
          <span className="block h-1.5 w-4/5 rounded bg-slate-300" />

          <span className="mt-0.5 block text-[9px] font-black text-slate-900">
            1 250,00 MZN
          </span>
        </div>
      </div>
    );
  }

  /* Modelo 8 — Horizontal (Market 3product) */
  if (model === "8") {
    return (
      <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-1.5">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-slate-200" />

        <div className="min-w-0 flex-1">
          <span className="block h-1 w-6 rounded bg-slate-200" />

          <span className="mt-0.5 block h-1.5 w-4/5 rounded bg-slate-300" />

          <span className="block text-[8px] font-black text-emerald-700">
            1 250 MT
          </span>
        </div>

        <span className="text-[10px] text-gray-400">›</span>
      </div>
    );
  }

  /* Modelo 1 — clássico: nome + loja + preço */
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {img}

      <div className="flex flex-col gap-1 px-2 py-1.5">
        <div className="h-2.5 w-4/5 rounded bg-slate-300" />

        <span className="text-[10px] font-medium text-slate-400">
          A tua loja
        </span>

        <span className="text-[11px] font-bold text-slate-900">
          1 250,00 MZN
        </span>
      </div>
    </div>
  );
}

/**
 * Seletor dos 5 modelos de cartão de produto.
 * Reproduz a identidade visual da página de
 * Personalização (cards brancos, bordas cinza,
 * seleção com anel escuro).
 */
export function ProductCardModelSelector({
  value,
  onChange,
  disabled = false,
  previewImage = null,
  unlockedModels,
}: {
  value: string | null | undefined;
  onChange: (model: ProductCardModel) => void;
  disabled?: boolean;
  previewImage?: PreviewImage;
  /**
   * Modelos desbloqueados pela loja via Market
   * (stores.market purchases). Quando fornecido, APENAS
   * estes modelos são mostrados — os não comprados ficam
   * escondidos (comprados no Market, visíveis lá).
   */
  unlockedModels?: readonly ProductCardModel[] | null;
}) {
  const selected = value ?? "1";

  const visibleModels =
    unlockedModels === undefined
      ? PRODUCT_CARD_MODELS
      : PRODUCT_CARD_UNLOCKABLE_MODELS.filter((model) =>
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
                  {getProductCardModelLabel(model)}
                </h4>

                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  {PRODUCT_CARD_MODEL_HINTS[model]}
                </p>
              </div>

              {isActive && (
                <span className="rounded-full bg-[#111713] px-2.5 py-1 text-[10px] font-bold text-white">
                  Ativo
                </span>
              )}
            </div>

            <div className="mt-4 flex items-end gap-3">
              <div className="w-28">
                <ModelMiniature model={model} image={previewImage} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

const PRODUCT_CARD_MODEL_HINTS: Record<
  ProductCardModel,
  string
> = {
  "1": "Estilo atual da loja.",
  "2": "Apenas a imagem do produto.",
  "3": "Imagem com o preço por baixo.",
  "4": "Imagem com o nome por baixo.",
  "5": "Imagem, nome, preço e botão Comprar.",
  "6": "Sombra suave, categoria e botão circular.",
  "7": "Quadrado, com nome e preço em destaque.",
  "8": "Linha com imagem à esquerda e seta.",
};

export default ProductCardModelSelector;

/* =========================================================
   BOTÕES DE NAVEGAÇÃO — miniaturas + seletor
   (mesma linguagem visual do seletor de cartões)
   ========================================================= */

const NAV_ITEMS = [
  { name: "Home", icon: Home },
  { name: "Mensagens", icon: MessageCircle },
  { name: "Carrinho", icon: ShoppingCart },
  { name: "Conta", icon: User },
];

/**
 * Miniatura estática de cada modelo de botão de
 * navegação, desenhada com a mesma linguagem visual da
 * barra real do tema Nova (rounded-2xl, bg-white,
 * shadow, primary).
 */
function NavButtonMiniature({
  model,
}: {
  model: NavButtonModel;
}) {
  return (
    <div
      className={`
        flex w-full items-center overflow-hidden bg-white shadow-sm
        ${model === "2" ? "rounded-full" : "rounded-2xl"}
        border border-gray-200
      `}
    >
      {NAV_ITEMS.map((item, index) => {
        const Icon = item.icon;

        const active = index === 0;

        return (
          <div
            key={item.name}
            className={`
              flex min-h-[44px] flex-1 flex-col items-center justify-center
              ${model === "3" ? "" : "gap-0.5"}
              ${
                model === "4" && active
                  ? "bg-[#141714] text-white"
                  : active
                    ? "text-[#141714]"
                    : "text-gray-400"
              }
            `}
          >
            <div
              className={
                model === "5" && active
                  ? "flex h-6 w-6 items-center justify-center rounded-full bg-[#141714] text-white"
                  : ""
              }
            >
              <Icon size={15} />
            </div>

            {model !== "3" && (
              <span
                className={`
                  text-[8px]
                  ${
                    model === "5" && active
                      ? "font-bold text-[#141714]"
                      : "font-medium"
                  }
                `}
              >
                {item.name}
              </span>
            )}

            {model === "3" && active && (
              <div className="h-1 w-1 rounded-full bg-[#141714]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

const NAV_BUTTON_MODEL_HINTS: Record<
  NavButtonModel,
  string
> = {
  "1": "Estilo atual da loja.",
  "2": "Barra em pílula compacta.",
  "3": "Apenas ícones, sem rótulos.",
  "4": "Separador ativo preenchido.",
  "5": "Item ativo elevado com sombra.",
};

/**
 * Seletor dos 5 modelos de botões de navegação.
 * Mesma identidade visual do seletor de cartões
 * (cards brancos, bordas cinza, seleção com anel escuro).
 */
export function NavButtonModelSelector({
  value,
  onChange,
  disabled = false,
  unlockedModels,
}: {
  value: string | null | undefined;
  onChange: (model: NavButtonModel) => void;
  disabled?: boolean;
  /**
   * Modelos desbloqueados pela loja via Market
   * (store_market_features). Quando fornecido, APENAS
   * estes modelos são mostrados — os não comprados ficam
   * escondidos (comprados no Market, visíveis lá).
   */
  unlockedModels?: readonly NavButtonModel[] | null;
}) {
  const selected = value ?? "1";

  const visibleModels =
    unlockedModels === undefined
      ? NAV_BUTTON_MODELS
      : NAV_BUTTON_UNLOCKABLE_MODELS.filter((model) =>
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
                  {getNavButtonModelLabel(model)}
                </h4>

                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  {NAV_BUTTON_MODEL_HINTS[model]}
                </p>
              </div>

              {isActive && (
                <span className="rounded-full bg-[#111713] px-2.5 py-1 text-[10px] font-bold text-white">
                  Ativo
                </span>
              )}
            </div>

            <div className="mt-4">
              <NavButtonMiniature model={model} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
