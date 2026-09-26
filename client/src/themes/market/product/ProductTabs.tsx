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
  "Especificações",
  "Avaliações",
] as const;

export function ProductTabs({
  product,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] =
    useState<
      (typeof tabs)[number]
    >("Descrição");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      {/* TABS */}

      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 px-3 pt-3 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-t-lg px-5 py-3 text-sm font-bold transition ${
              activeTab === tab
                ? "border-b-2 border-emerald-600 text-emerald-700"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}

      <div className="p-5 sm:p-7">
        {activeTab === "Descrição" && (
          <div className="text-sm leading-7 text-slate-500">
            {product.description ||
              "Produto disponível nesta loja Market."}
          </div>
        )}

        {activeTab === "Especificações" && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
              <dt className="shrink-0 text-slate-400">
                Categoria
              </dt>

              <dd className="min-w-0 truncate text-right font-bold text-slate-900">
                {product.category}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
              <dt className="shrink-0 text-slate-400">
                Stock
              </dt>

              <dd className="min-w-0 truncate text-right font-bold text-slate-900">
                {product.stock > 0
                  ? `${product.stock} unidades`
                  : "Esgotado"}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
              <dt className="shrink-0 text-slate-400">
                Entrega
              </dt>

              <dd className="min-w-0 truncate text-right font-bold text-slate-900">
                24 horas
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
              <dt className="shrink-0 text-slate-400">
                Garantia
              </dt>

              <dd className="min-w-0 truncate text-right font-bold text-slate-900">
                7 dias
              </dd>
            </div>
          </dl>
        )}

        {activeTab === "Avaliações" && (
          <div className="text-sm leading-7 text-slate-500">
            As avaliações deste produto serão
            exibidas aqui. Compre com
            confiança: todos os produtos
            Market passam por verificação de
            qualidade.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTabs;
