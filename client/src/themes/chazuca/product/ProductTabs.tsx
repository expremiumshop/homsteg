import { useState } from "react";

import {
  chazucaColors,
  chazucaHeadingFont,
  chazucaBodyFont,
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
          chazucaColors.border,
        fontFamily: chazucaBodyFont,
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
                ? "border-b-2"
                : ""
            }`}
            style={{
              borderColor:
                activeTab === tab
                  ? chazucaColors.primary
                  : "transparent",
              color:
                activeTab === tab
                  ? chazucaColors.text
                  : chazucaColors.textMuted,
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
          color: chazucaColors.textMuted,
        }}
      >
        {activeTab === "Descrição" && (
          <p className="max-w-2xl">
            {product.description ||
              "Peça disponível nesta loja Chazuca."}
          </p>
        )}

        {activeTab === "Detalhes" && (
          <dl className="grid max-w-2xl gap-x-10 gap-y-3 sm:grid-cols-2">
            <div
              className="flex items-center justify-between gap-4 border-b pb-2.5"
              style={{
                borderColor:
                  chazucaColors.border,
              }}
            >
              <dt>Categoria</dt>

              <dd
                className="text-right font-medium"
                style={{
                  color:
                    chazucaColors.text,
                }}
              >
                {product.category}
              </dd>
            </div>

            <div
              className="flex items-center justify-between gap-4 border-b pb-2.5"
              style={{
                borderColor:
                  chazucaColors.border,
              }}
            >
              <dt>Stock</dt>

              <dd
                className="text-right font-medium"
                style={{
                  color:
                    chazucaColors.text,
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
                  chazucaColors.border,
              }}
            >
              <dt>Entrega</dt>

              <dd
                className="text-right font-medium"
                style={{
                  color:
                    chazucaColors.text,
                }}
              >
                Nacional
              </dd>
            </div>

            <div
              className="flex items-center justify-between gap-4 border-b pb-2.5"
              style={{
                borderColor:
                  chazucaColors.border,
              }}
            >
              <dt>Troca</dt>

              <dd
                className="text-right font-medium"
                style={{
                  color:
                    chazucaColors.text,
                }}
              >
                7 dias
              </dd>
            </div>
          </dl>
        )}

        {activeTab === "Cuidados" && (
          <p className="max-w-2xl">
            Cada drop é pensado para
            durar. Lave o streetwear do
            avesso com água fria, evite
            secar em luz solar direta e
            guarde acessórios tech em
            local seco. Peças de arte
            devem ser emolduradas ou
            guardadas longe de humidade.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductTabs;
