import { useI18n } from "@/lib/i18n-context";

interface ProductInfoProps {
  product: any;
}

export default function ProductInfo({
  product,
}: ProductInfoProps) {
  /*
   * Moeda da loja (Configurações → Idioma e moeda): o preço
   * deixou de estar fixo em MZN.
   */
  const { t, currency } = useI18n();
  const discount = product?.compare_at_price
    ? Math.round(
        ((Number(product.compare_at_price) -
          Number(product.price)) /
          Number(product.compare_at_price)) *
          100
      )
    : 0;

  return (
    <div className="space-y-4">
      {/* =====================================================
          PREÇO
          ===================================================== */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* PREÇO ATUAL */}
          <span className="text-3xl font-bold text-red-600">
            {Number(product?.price ?? 0).toFixed(2)} {currency}
          </span>

          {/* PREÇO ANTERIOR */}
          {product?.compare_at_price && (
            <span className="text-base text-gray-400 line-through">
              {Number(product.compare_at_price).toFixed(2)} {currency}
            </span>
          )}

          {/* DESCONTO */}
          {discount > 0 && (
            <span
              className="
                rounded
                bg-red-600
                px-2.5
                py-1
                text-xs
                font-semibold
                text-white
              "
            >
              -{discount}%
            </span>
          )}
        </div>

        {/* OFERTA */}
        <p className="mt-2 text-sm font-medium text-red-600">
          {t("product.limitedOffer")}
        </p>
      </div>

      {/* =====================================================
          CUPOM
          ===================================================== */}
      <div
        className="
          flex
          items-center
          justify-between
          rounded-lg
          bg-orange-50
          p-3.5
        "
      >
        <div>
          <p className="text-sm font-semibold text-orange-700">
            {t("product.couponShort")}
          </p>

          <p className="text-xs text-gray-600">
            {t("product.saveOnThis")}
          </p>
        </div>

        <button
          type="button"
          className="
            rounded-lg
            bg-orange-500
            px-3.5
            py-1.5
            text-xs
            font-semibold
            text-white
          "
        >
          {t("product.get")}
        </button>
      </div>

      {/* =====================================================
          ESTOQUE
          ===================================================== */}
      <div className="text-xs text-gray-600">
        {t("product.stockLeft")}{" "}
        <span className="mx-1 font-bold text-red-600">
          {product?.stock ?? 0}
        </span>{" "}
        {t("product.unitsAvailable")}
      </div>
    </div>
  );
}