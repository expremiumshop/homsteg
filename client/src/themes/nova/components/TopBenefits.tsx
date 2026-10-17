import {
  Zap,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

import { useI18n } from "@/lib/i18n-context";
import type { TranslationKey } from "@/lib/i18n";

/*
 * O título de cada benefício vem do catálogo: a lista é
 * estática (ícone + chave), o texto é resolvido no render
 * para acompanhar o idioma da loja.
 */
const benefits: {
  icon: typeof Zap;
  titleKey: TranslationKey;
}[] = [
  {
    icon: Zap,
    titleKey: "benefit.fastDelivery",
  },
  {
    icon: ShieldCheck,
    titleKey: "benefit.securePayment",
  },
  {
    icon: BadgeCheck,
    titleKey: "benefit.verifiedSellers",
  },
];

export function TopBenefits() {
  const { t } = useI18n();

  return (
    <section className="w-full px-3 py-1 md:px-6 md:py-2">
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1440px]
          grid-cols-3
          gap-2
          md:gap-4
        "
      >
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          const title = t(benefit.titleKey);

          return (
            <div
              key={benefit.titleKey}
              className="
                flex
                min-h-[80px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                bg-white
                px-2
                py-2
                text-center
                md:min-h-[105px]
                md:px-5
                md:py-4
              "
            >
              <Icon
                className="
                  mb-1.5
                  h-5
                  w-5
                  text-primary
                  md:mb-2
                  md:h-6
                  md:w-6
                "
              />

              <h3
                className="
                  text-[11px]
                  font-bold
                  leading-tight
                  text-foreground
                  sm:text-xs
                  md:text-sm
                  lg:text-base
                "
              >
                {title}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TopBenefits;