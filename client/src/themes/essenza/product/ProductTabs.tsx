import { useState } from "react";

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
  const [activeTab, setActiveTab] =
    useState<
      (typeof tabs)[number]
    >("Descrição");

  return (
    <div className="border-t border-neutral-200">
      {/* TABS */}

      <div className="flex items-center gap-8 overflow-x-auto pt-6 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 pb-3 text-[11px] uppercase tracking-[0.16em] transition ${
              activeTab === tab
                ? "border-b border-neutral-950 text-neutral-950"
                : "text-neutral-400 hover:text-neutral-950"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}

      <div className="py-6 text-sm leading-7 text-neutral-500">
        {activeTab === "Descrição" && (
          <p className="max-w-2xl">
            {product.description ||
              "Peça disponível nesta loja Essenza."}
          </p>
        )}

        {activeTab === "Detalhes" && (
          <dl className="grid max-w-2xl gap-x-10 gap-y-3 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-2.5">
              <dt className="text-neutral-400">
                Categoria
              </dt>

              <dd className="text-right font-medium text-neutral-950">
                {product.category}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-2.5">
              <dt className="text-neutral-400">
                Stock
              </dt>

              <dd className="text-right font-medium text-neutral-950">
                {product.stock > 0
                  ? `${product.stock} unidades`
                  : "Esgotado"}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-2.5">
              <dt className="text-neutral-400">
                Entrega
              </dt>

              <dd className="text-right font-medium text-neutral-950">
                24 horas
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-2.5">
              <dt className="text-neutral-400">
                Troca
              </dt>

              <dd className="text-right font-medium text-neutral-950">
                7 dias
              </dd>
            </div>
          </dl>
        )}

        {activeTab === "Cuidados" && (
          <p className="max-w-2xl">
            Cuidar bem da sua peça garante
            longevidade. Siga as
            instruções na etiqueta, evite
            exposição prolongada ao sol e
            guarde em local seco e arejado.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductTabs;
