import {
  Award,
  Lock,
  Headphones,
  Truck,
} from "lucide-react";

import {
  chazucaColors,
  chazucaHeadingFont,
  chazucaBodyFont,
} from "../theme";

type BenefitsSectionProps = {
  storeName?: string;
  title?: string;
  description?: string;
};

export function BenefitsSection({
  storeName = "Chazuca Lab",
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
        "Drops e colaborações com criadores e artistas independentes.",
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
        fontFamily: chazucaBodyFont,
      }}
    >
      <div className="mb-8 text-center">
        <h2
          className="text-2xl sm:text-3xl"
          style={{
            fontFamily:
              chazucaHeadingFont,
            fontWeight: 700,
            color: chazucaColors.text,
          }}
        >
          {heading}
        </h2>

        <p
          className="mt-2 text-sm"
          style={{
            color:
              chazucaColors.textMuted,
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
              className="flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-3xl border px-6 py-8 text-center transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-100"
              style={{
                background:
                  chazucaColors.surface,
                borderColor:
                  chazucaColors.border,
                color: chazucaColors.text,
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{
                  background:
                    "color-mix(in srgb, #7c3aed 12%, transparent)",
                  color: "#7c3aed",
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
                    chazucaColors.textMuted,
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
          className="rounded-3xl border px-6 py-10 sm:px-10"
          style={{
            background:
              chazucaColors.surface,
            borderColor:
              chazucaColors.border,
          }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-[11px] uppercase tracking-[0.28em]"
              style={{
                color:
                  chazucaColors.accent,
              }}
            >
              Sobre o lab
            </p>

            <h3
              className="mt-3 text-2xl"
              style={{
                fontFamily:
                  chazucaHeadingFont,
                fontWeight: 700,
                color:
                  chazucaColors.text,
              }}
            >
              {storeName}
            </h3>

            <div
              className="mt-5 space-y-4 text-sm leading-7"
              style={{
                color:
                  chazucaColors.textMuted,
              }}
            >
              <p>
                A{" "}
                <strong
                  style={{
                    color:
                      chazucaColors.text,
                  }}
                >
                  {storeName}
                </strong>{" "}
                é um espaço criativo onde
                streetwear, tech e arte se
                cruzam. Cada drop é pensado
                como uma edição limitada:
                peças ousadas, produzidas em
                pequenas séries e com arte
                de autores locais.
              </p>

              <p>
                Quando acaba, acabou. Por
                isso trabalhamos com drops
                curtos, colaborações
                surpresa e uma comunidade
                que define tendência em vez
                de a seguir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
