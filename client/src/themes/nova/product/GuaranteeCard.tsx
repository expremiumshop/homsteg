import {
  ShieldCheck,
  Share2,
  Lock,
} from "lucide-react";

import { useI18n } from "@/lib/i18n-context";

export default function GuaranteeCard() {
  const { t } = useI18n();

  return (
    <div
      className="
        rounded-xl
        p-5
        bg-white
        space-y-5
      "
    >
      {/* PRODUTO PROTEGIDO */}
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <ShieldCheck
          className="
            text-green-600
            w-6
            h-6
          "
        />

        <div>
          <p
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            {t("product.protected")}
          </p>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            {t("product.garantiaLabel")}
          </p>
        </div>
      </div>

      {/* GARANTIA */}
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <Lock
          className="
            text-purple-600
            w-6
            h-6
          "
        />

        <div>
          <p
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            {t("benefit.securePayment")}
          </p>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            {t("product.protectedData")}
          </p>
        </div>
      </div>

      {/* PARTILHAR */}
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <Share2
          className="
            text-gray-600
            w-6
            h-6
          "
        />

        <div>
          <p
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            {t("footer.share")}
          </p>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            {t("product.sendToFriends")}
          </p>
        </div>
      </div>
    </div>
  );
}