import { useState } from "react";

type ProductTabsProps = {
  product: {
    description?: string | null;
    category?: string | null;
    stock?: number | null;
  };
};

export function ProductTabs({
  product,
}: ProductTabsProps) {
  const [active, setActive] =
    useState("description");

  const tabs = [
    {
      id: "description",
      name: "Descrição",
    },
    {
      id: "details",
      name: "Detalhes",
    },
    {
      id: "reviews",
      name: "Avaliações",
    },
  ];

  return (
    <div className="w-full min-w-0">
      {/* MENU DAS ABAS */}
      <div className="flex min-w-0 gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() =>
              setActive(tab.id)
            }
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold transition ${
              active === tab.id
                ? "bg-neutral-950 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}
      <div className="min-w-0 max-w-full pt-8">
        {/* DESCRIÇÃO */}
        {active === "description" && (
          <div className="min-w-0 max-w-full space-y-4">
            <h3 className="text-xl font-black tracking-[-0.03em] text-neutral-950">
              Descrição do produto
            </h3>

            <p className="min-w-0 max-w-full whitespace-pre-wrap break-words text-sm leading-7 text-neutral-500 [overflow-wrap:anywhere]">
              {product?.description ||
                "Informações detalhadas do produto aparecerão aqui."}
            </p>
          </div>
        )}

        {/* DETALHES */}
        {active === "details" && (
          <div className="min-w-0 max-w-full space-y-3 text-sm text-neutral-600">
            <h3 className="text-xl font-black tracking-[-0.03em] text-neutral-950">
              Detalhes do produto
            </h3>

            <p className="break-words [overflow-wrap:anywhere]">
              <strong className="font-bold text-neutral-950">
                Categoria:
              </strong>{" "}
              {product?.category ||
                "Sem categoria"}
            </p>

            <p>
              <strong className="font-bold text-neutral-950">
                Disponibilidade:
              </strong>{" "}
              {Number(
                product?.stock ?? 0,
              ) > 0
                ? "Em stock"
                : "Sem stock"}
            </p>

            <p>
              <strong className="font-bold text-neutral-950">
                Envio:
              </strong>{" "}
              Nacional
            </p>

            <p>
              <strong className="font-bold text-neutral-950">
                Garantia:
              </strong>{" "}
              Garantia de fábrica
            </p>
          </div>
        )}

        {/* AVALIAÇÕES */}
        {active === "reviews" && (
          <div className="min-w-0 max-w-full">
            <h3 className="text-xl font-black tracking-[-0.03em] text-neutral-950">
              Avaliações
            </h3>

            <p className="break-words text-sm text-neutral-500 [overflow-wrap:anywhere]">
              As avaliações dos clientes
              aparecerão aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTabs;
