import { useState } from "react";

import { useI18n } from "@/lib/i18n-context";

interface ProductTabsProps {
  product: any;
}

export default function ProductTabs({
  product,
}: ProductTabsProps) {
  const { t } = useI18n();

  const [active, setActive] = useState("description");

  const tabs = [
    {
      id: "description",
      name: t("product.tabDescription"),
    },
    {
      id: "details",
      name: t("product.tabDetails"),
    },
    {
      id: "reviews",
      name: t("product.reviewsTab"),
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
              {t("product.description")}
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
                t("product.descriptionFallback")}
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
              {t("product.details")}
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
                <strong>{t("product.category")}:</strong>{" "}
                {product?.category ||
                  t("product.categoryFallback")}
              </p>

              <p>
                <strong>{t("product.availability")}:</strong>{" "}
                {Number(product?.stock ?? 0) > 0
                  ? t("product.inStock")
                  : t("product.outOfStock")}
              </p>

              <p>
                <strong>{t("product.shippingLabel")}:</strong>{" "}
                {t("product.international")}
              </p>

              <p>
                <strong>{t("product.garantiaLabel")}:</strong>{" "}
                {t("product.garantiaLabel")}
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
              {t("product.reviewsTab")}
            </h3>

            <p
              className="
                break-words
                text-gray-500
                [overflow-wrap:anywhere]
              "
            >
              {t("product.reviewsEmpty")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}