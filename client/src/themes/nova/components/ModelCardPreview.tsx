import { MessageCircle } from "lucide-react";

import {
  PRODUCT_CARD_MODELS,
  getProductCardModelLabel,
  type ProductCardModel,
} from "../productCardModels";

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
}: {
  value: string | null | undefined;
  onChange: (model: ProductCardModel) => void;
  disabled?: boolean;
  previewImage?: PreviewImage;
}) {
  const selected = value ?? "1";

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {PRODUCT_CARD_MODELS.map((model) => {
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
};

export default ProductCardModelSelector;
