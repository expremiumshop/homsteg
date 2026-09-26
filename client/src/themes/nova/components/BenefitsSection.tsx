import {
    Truck,
    Lock,
    Award,
    Headphones,
  } from "lucide-react";
  
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
      title: "Produtos verificados",
      description:
        "Encontre produtos e vendedores selecionados para uma experiência melhor.",
    },
    {
      icon: Headphones,
      title: "Suporte ao cliente",
      description:
        "Conte com a nossa equipa para ajudar sempre que precisar.",
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
    const title =
      aboutTitle || `Porquê comprar na ${storeName}?`;
  
    const description =
      aboutDescription ||
      "Uma experiência de compra simples, segura e confiável.";
  
    const defaultSlogan =
      `${storeName} — qualidade que chega até si.`;
  
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
  
              return (
                <div
                  key={benefit.title}
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
  
                  <div>
                    <h3 className="text-base font-bold text-foreground @[720px]:text-lg">
                      {benefit.title}
                    </h3>
  
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {benefit.description}
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
  
                <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground @[720px]:text-base">
                  <p>
                    A{" "}
                    <strong className="text-foreground">
                      {storeName}
                    </strong>{" "}
                    é uma loja dedicada à comercialização de produtos
                    de qualidade, selecionados cuidadosamente para
                    oferecer aos nossos clientes{" "}
                    <strong className="text-foreground">
                      excelência, variedade e preços competitivos
                    </strong>
                    .
                  </p>
  
                  <p>
                    Trabalhamos para oferecer uma ampla variedade de
                    produtos, selecionando opções que aliam{" "}
                    <strong className="text-foreground">
                      qualidade, bom preço e estilo
                    </strong>
                    .
                  </p>
  
                  <p>
                    O nosso compromisso é tornar produtos de qualidade
                    acessíveis a clientes em todo o território
                    nacional. Procuramos oferecer uma experiência de
                    compra simples, segura e conveniente.
                  </p>
  
                  <p>
                    Na{" "}
                    <strong className="text-foreground">
                      {storeName}
                    </strong>
                    , acreditamos que comprar deve ser uma experiência
                    simples, segura e satisfatória. Por isso, procuramos
                    oferecer produtos cuidadosamente selecionados,
                    preços justos e um atendimento focado nas
                    necessidades de cada cliente.
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