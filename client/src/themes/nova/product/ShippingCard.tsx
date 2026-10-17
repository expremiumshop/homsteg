import {
    Truck,
    MapPin,
    Clock,
  } from "lucide-react";

  import { useI18n } from "@/lib/i18n-context";

  export default function ShippingCard() {
    const { t } = useI18n();
    return (
      <div
        className="
          space-y-4
          rounded-xl
          bg-white
          p-5
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <Truck
            className="
              h-6
              w-6
              text-blue-600
            "
          />
  
          <div>
            <h3
              className="
                font-semibold
                text-gray-900
              "
            >
              {t("product.shippingTitle")}
            </h3>
  
            <p
              className="
                text-sm
                text-gray-500
              "
            >
              {t("product.shippingSafe")}
            </p>
          </div>
        </div>
  
        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
          "
        >
          {/* DESTINO */}
          <div
            className="
              flex
              gap-3
              rounded-lg
              bg-gray-50
              p-3
            "
          >
            <MapPin className="text-red-500" />
  
            <div>              <p className="text-sm font-medium">
                {t("product.destination")}
              </p>

              <p className="text-xs text-gray-500">
                {t("product.selectAddress")}
              </p>
            </div>
          </div>
  
          {/* PRAZO */}
          <div
            className="
              flex
              gap-3
              rounded-lg
              bg-gray-50
              p-3
            "
          >
            <Clock className="text-green-600" />
  
            <div>              <p className="text-sm font-medium">
                {t("product.estimatedTime")}
              </p>

              <p className="text-xs text-gray-500">
                {t("product.businessDays")}
              </p>
            </div>
          </div>
        </div>
  
        <div
          className="
            text-sm
            font-medium
            text-green-600
          "
        >
          ✓ {t("product.trackingAfterShipping")}
        </div>
      </div>
    );
  }