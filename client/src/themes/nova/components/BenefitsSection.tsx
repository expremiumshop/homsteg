import {
    Truck,
    Lock,
    Award,
    Headphones,
  } from "lucide-react";

  import { useI18n } from "@/lib/i18n-context";
  import type { TranslationKey } from "@/lib/i18n";

  /*
   * Título e descrição de cada benefício vêm do catálogo:
   * a lista guarda chaves, o texto é resolvido no render.
   */
  const benefits: {
    icon: typeof Truck;
    titleKey: TranslationKey;
    descriptionKey: TranslationKey;
  }[] = [
    {
      icon: Truck,
      titleKey: "benefits.deliveryTitle",
      descriptionKey: "benefits.deliveryText",
    },
    {
      icon: Lock,
      titleKey: "benefits.safeBuyTitle",
      descriptionKey: "benefits.safeBuyText",
    },
    {
      icon: Award,
      titleKey: "benefits.verifiedTitle",
      descriptionKey: "benefits.verifiedText",
    },
    {
      icon: Headphones,
      titleKey: "benefits.supportTitle",
      descriptionKey: "benefits.supportText",
    },
  ];
  
  interface BenefitsSectionProps {
    storeName?: string;
    aboutTitle?: string;
    aboutDescription?: string;
    slogan?: string;
  }
  
  export function BenefitsSection({
    storeName = "Nova Store",
    aboutTitle,
    aboutDescription,
    slogan,
  }: BenefitsSectionProps) {
    const { t } = useI18n();

    const title =
      aboutTitle || t("benefits.whyTitle", { store: storeName });

    const description =
      aboutDescription || t("benefits.whyText");

    const defaultSlogan = t("benefits.slogan", {
      store: storeName,
    });
  
    return (
      <section className="@container w-full px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 text-center @[720px]:text-left">
            <h2 className="text-2xl font-bold text-foreground @[720px]:text-3xl">
              {title}
            </h2>
  
            <p className="mt-2 text-sm text-muted-foreground @[720px]:text-base">
              {description}
            </p>
          </div>
  
          <div className="grid grid-cols-1 gap-4 @[720px]:grid-cols-4 @[720px]:gap-5">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              const benefitTitle = t(benefit.titleKey);
              const benefitDescription = t(benefit.descriptionKey);
  
              return (
                <div
                  key={benefit.titleKey}
                  className="
                    flex
                    min-h-[120px]
                    items-center
                    gap-4
                    rounded-2xl
                    bg-white
                    px-5
                    py-5
                    shadow-sm
                    transition
                    hover:-translate-y-1
                    hover:shadow-md
                    @[720px]:min-h-[190px]
                    @[720px]:flex-col
                    @[720px]:items-center
                    @[720px]:justify-center
                    @[720px]:px-4
                    @[720px]:text-center
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-primary/10
                      @[720px]:h-14
                      @[720px]:w-14
                    "
                  >
                    <Icon className="h-6 w-6 text-primary @[720px]:h-7 @[720px]:w-7" />
                  </div>
  
                  <div>                    <h3 className="text-base font-bold text-foreground @[720px]:text-lg">
                      {benefitTitle}
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {benefitDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
  
          <div className="mt-10">
            <div className="rounded-2xl bg-white p-6 shadow-sm @[720px]:p-8 @[960px]:p-10">
              <div className="max-w-5xl">
                <h2 className="text-2xl font-bold text-foreground @[720px]:text-3xl">
                  {storeName}
                </h2>
  
                <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground @[720px]:text-base">                  <p>
                    A{" "}
                    <strong className="text-foreground">
                      {storeName}
                    </strong>
                    {t("benefits.about1a")}
                    <strong className="text-foreground">
                      {t("benefits.about1b")}
                    </strong>
                    .
                  </p>

                  <p>
                    {t("benefits.about2a")}
                    <strong className="text-foreground">
                      {t("benefits.about2b")}
                    </strong>
                    .
                  </p>

                  <p>{t("benefits.about3")}</p>

                  <p>
                    Na{" "}
                    <strong className="text-foreground">
                      {storeName}
                    </strong>
                    {t("benefits.about4")}
                  </p>
                </div>
  
                <div className="mt-6 pt-5">
                  <p className="text-sm font-semibold text-foreground @[720px]:text-base">
                    {slogan || defaultSlogan}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }