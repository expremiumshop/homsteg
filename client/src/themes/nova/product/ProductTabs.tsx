import { useState } from "react";

interface ProductTabsProps {
  product: any;
}

export default function ProductTabs({
  product,
}: ProductTabsProps) {
  const [active, setActive] = useState("description");

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
    <div
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-xl
        bg-white
      "
    >
      {/* MENU DAS ABAS */}
      <div
        className="
          flex
          min-w-0
          overflow-x-auto
        "
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`
              shrink-0
              whitespace-nowrap
              px-6
              py-4
              text-sm
              font-semibold
              transition-colors
              ${
                active === tab.id
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}
      <div
        className="
          min-w-0
          max-w-full
          overflow-hidden
          p-6
        "
      >
        {/* DESCRIÇÃO */}
        {active === "description" && (
          <div
            className="
              min-w-0
              max-w-full
              space-y-4
            "
          >
            <h3
              className="
                text-xl
                font-bold
                text-gray-900
              "
            >
              Descrição do produto
            </h3>

            <p
              className="
                min-w-0
                max-w-full
                whitespace-pre-wrap
                break-words
                [overflow-wrap:anywhere]
                leading-relaxed
                text-gray-600
              "
            >
              {product?.description ||
                "Informações detalhadas do produto aparecerão aqui."}
            </p>
          </div>
        )}

        {/* DETALHES */}
        {active === "details" && (
          <div
            className="
              min-w-0
              max-w-full
              space-y-3
            "
          >
            <h3
              className="
                text-xl
                font-bold
                text-gray-900
              "
            >
              Detalhes do produto
            </h3>

            <div
              className="
                min-w-0
                max-w-full
                space-y-2
                text-sm
                text-gray-700
              "
            >
              <p
                className="
                  break-words
                  [overflow-wrap:anywhere]
                "
              >
                <strong>Categoria:</strong>{" "}
                {product?.category || "Sem categoria"}
              </p>

              <p>
                <strong>Disponibilidade:</strong>{" "}
                {Number(product?.stock ?? 0) > 0
                  ? "Em estoque"
                  : "Sem estoque"}
              </p>

              <p>
                <strong>Envio:</strong>{" "}
                Internacional
              </p>

              <p>
                <strong>Garantia:</strong>{" "}
                Garantia
              </p>
            </div>
          </div>
        )}

        {/* AVALIAÇÕES */}
        {active === "reviews" && (
          <div
            className="
              min-w-0
              max-w-full
            "
          >
            <h3
              className="
                mb-3
                text-xl
                font-bold
                text-gray-900
              "
            >
              Avaliações
            </h3>

            <p
              className="
                break-words
                text-gray-500
                [overflow-wrap:anywhere]
              "
            >
              As avaliações dos clientes aparecerão aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}