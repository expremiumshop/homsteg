import {
  Award,
  Lock,
  Headphones,
  Truck,
} from "lucide-react";

import {
  calizaColors,
  calizaHeadingFont,
  calizaBodyFont,
} from "../theme";

type BenefitsSectionProps = {
  storeName?: string;
  title?: string;
  description?: string;
};

export function BenefitsSection({
  storeName = "Caliza Studio",
  title,
  description,
}: BenefitsSectionProps) {
  const benefits = [
    {
      icon: Truck,
      title: "Entrega em Moçambique",
      description:
        "Receba os seus produtos com segurança e acompanhe a sua entrega.",
    },
    {
      icon: Lock,
      title: "Compra segura",
      description:
        "Os seus dados são tratados com segurança durante a sua compra.",
    },
    {
      icon: Award,
      title: "Peças de autor",
      description:
        "Objetos selecionados de ateliers e criadores independentes.",
    },
    {
      icon: Headphones,
      title: "Suporte ao cliente",
      description:
        "Conte com a nossa equipa para ajudar sempre que precisar.",
    },
  ];

  const heading =
    title ||
    `Porquê comprar na ${storeName}?`;

  const subtitle =
    description ||
    "Uma experiência de compra simples, segura e confiável.";

  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8"
      style={{
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="mb-8 text-center">
        <h2
          className="text-2xl sm:text-3xl"
          style={{
            fontFamily:
              calizaHeadingFont,
            fontWeight: 500,
            color: calizaColors.text,
          }}
        >
          {heading}
        </h2>

        <p
          className="mt-2 text-sm"
          style={{
            color:
              calizaColors.textMuted,
          }}
        >
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div
              key={benefit.title}
              className="flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-xl border px-6 py-8 text-center transition hover:-translate-y-0.5 hover:shadow-md"
              style={{
                background:
                  calizaColors.surface,
                borderColor:
                  calizaColors.border,
                color: calizaColors.text,
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{
                  background:
                    "color-mix(in srgb, #c2410c 12%, transparent)",
                  color: "#c2410c",
                }}
              >
                <Icon size={22} />
              </div>

              <h3 className="text-base font-semibold">
                {benefit.title}
              </h3>

              <p
                className="text-sm leading-6"
                style={{
                  color:
                    calizaColors.textMuted,
                }}
              >
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* SOBRE A LOJA */}

      <div className="mt-12">
        <div
          className="rounded-2xl border px-6 py-10 sm:px-10"
          style={{
            background:
              calizaColors.surface,
            borderColor:
              calizaColors.border,
          }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-[11px] uppercase tracking-[0.28em]"
              style={{
                color:
                  calizaColors.accent,
              }}
            >
              Sobre o studio
            </p>

            <h3
              className="mt-3 text-2xl"
              style={{
                fontFamily:
                  calizaHeadingFont,
                fontWeight: 500,
                color:
                  calizaColors.text,
              }}
            >
              {storeName}
            </h3>

            <div
              className="mt-5 space-y-4 text-sm leading-7"
              style={{
                color:
                  calizaColors.textMuted,
              }}
            >
              <p>
                A{" "}
                <strong
                  style={{
                    color:
                      calizaColors.text,
                  }}
                >
                  {storeName}
                </strong>{" "}
                reúne peças de cerâmica, arte
                e objetos de autor inspirados
                na paisagem mediterrânica.
                Cada coleção é pensada como um
                todo: materiais honestos,
                formas simples e texturas que
                convidam ao toque.
              </p>

              <p>
                Trabalhamos com ateliers
                independentes e produções em
                pequenas séries, para oferecer
                peças com carácter — feitas
                para serem usadas, oferecidas
                e guardadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
