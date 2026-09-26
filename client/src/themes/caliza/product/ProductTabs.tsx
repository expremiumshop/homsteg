import { useState } from "react";

import {
  calizaColors,
  calizaHeadingFont,
  calizaBodyFont,
} from "../theme";

type ProductTabsProps = {
  product: {
    description?: string | null;
    category: string;
    stock: number;
  };
};

const tabs = [
  "Descrição",
  "Detalhes",
  "Cuidados",
] as const;

export function ProductTabs({
  product,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    (typeof tabs)[number]
  >("Descrição");

  return (
    <div
      className="border-t pt-6"
      style={{
        borderColor:
          calizaColors.border,
        fontFamily: calizaBodyFont,
      }}
    >
      {/* TABS */}

      <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() =>
              setActiveTab(tab)
            }
            className={`shrink-0 pb-3 text-[11px] uppercase tracking-[0.16em] transition ${
              activeTab === tab
                ? "border-b"
                : ""
            }`}
            style={{
              borderColor:
                activeTab === tab
                  ? calizaColors.primary
                  : "transparent",
              color:
                activeTab === tab
                  ? calizaColors.text
                  : calizaColors.textMuted,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}

      <div
        className="py-6 text-sm leading-7"
        style={{
          color: calizaColors.textMuted,
        }}
      >
        {activeTab === "Descrição" && (
          <p className="max-w-2xl">
            {product.description ||
              "Peça disponível nesta loja Caliza."}
          </p>
        )}

        {activeTab === "Detalhes" && (
          <dl className="grid max-w-2xl gap-x-10 gap-y-3 sm:grid-cols-2">
            <div
              className="flex items-center justify-between gap-4 border-b pb-2.5"
              style={{
                borderColor:
                  calizaColors.border,
              }}
            >
              <dt>Categoria</dt>

              <dd
                className="text-right font-medium"
                style={{
                  color:
                    calizaColors.text,
                }}
              >
                {product.category}
              </dd>
            </div>

            <div
              className="flex items-center justify-between gap-4 border-b pb-2.5"
              style={{
                borderColor:
                  calizaColors.border,
              }}
            >
              <dt>Stock</dt>

              <dd
                className="text-right font-medium"
                style={{
                  color:
                    calizaColors.text,
                }}
              >
                {product.stock > 0
                  ? `${product.stock} unidades`
                  : "Esgotado"}
              </dd>
            </div>

            <div
              className="flex items-center justify-between gap-4 border-b pb-2.5"
              style={{
                borderColor:
                  calizaColors.border,
              }}
            >
              <dt>Entrega</dt>

              <dd
                className="text-right font-medium"
                style={{
                  color:
                    calizaColors.text,
                }}
              >
                Nacional
              </dd>
            </div>

            <div
              className="flex items-center justify-between gap-4 border-b pb-2.5"
              style={{
                borderColor:
                  calizaColors.border,
              }}
            >
              <dt>Troca</dt>

              <dd
                className="text-right font-medium"
                style={{
                  color:
                    calizaColors.text,
                }}
              >
                7 dias
              </dd>
            </div>
          </dl>
        )}

        {activeTab === "Cuidados" && (
          <p className="max-w-2xl">
            Cada peça carrega o toque de
            quem a fez. Limpe com um pano
            macio e seco, evite produtos
            abrasivos e proteja cerâmicas e
            fibras naturais da humidade
            prolongada. Guarde em local
            seco e arejado.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductTabs;
