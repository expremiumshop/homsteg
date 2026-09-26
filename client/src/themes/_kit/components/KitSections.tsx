import { useEffect, useState } from "react";
import { Truck, Lock, Award, Headphones, ChevronLeft, ChevronRight } from "lucide-react";

/* ============================================================
 * BANNER CAROUSEL
 * ============================================================ */
export function KitBannerCarousel({
  slides,
}: {
  slides: { title: string; subtitle: string; cta: string; image: string }[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000,
    );
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[index % slides.length];

  return (
    <section className="w-full px-3 pt-3 sm:px-4">
      <div
        className="relative mx-auto h-[180px] max-w-[1440px] overflow-hidden md:h-[280px]"
        style={{ borderRadius: "var(--tk-card-radius)" }}
      >
        <img
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        <div className="relative flex h-full max-w-[520px] flex-col justify-center gap-3 px-6 md:px-10">
          <h2 className="text-2xl font-bold text-white md:text-4xl">
            {slide.title}
          </h2>
          <p className="text-sm text-white/85 md:text-base">{slide.subtitle}</p>
          <span
            className="w-fit px-5 py-2 text-sm font-bold"
            style={{
              background: "var(--tk-accent)",
              color: "var(--tk-accent-contrast)",
              borderRadius: "var(--tk-radius)",
            }}
          >
            {slide.cta}
          </span>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Seguinte"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index % slides.length ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ============================================================
 * TOP BENEFITS — 3 cartões compactos
 * ============================================================ */
export function KitTopBenefits({
  items,
}: {
  items: { title: string }[];
}) {
  return (
    <section className="w-full px-3 py-2 sm:px-4">
      <div
        className="mx-auto grid w-full max-w-[1440px] grid-cols-3 gap-2 md:gap-4"
      >
        {items.map((item) => (
          <div
            key={item.title}
            className="flex min-h-[72px] flex-col items-center justify-center px-2 py-2 text-center md:min-h-[92px]"
            style={{
              background: "var(--tk-surface)",
              borderRadius: "var(--tk-card-radius)",
              border: "1px solid var(--tk-border)",
            }}
          >
            <h3 className="text-[11px] font-bold leading-tight sm:text-xs md:text-sm">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
 * CATEGORY MENU — chips de categorias
 * ============================================================ */
export function KitCategoryMenu({ categories }: { categories: string[] }) {
  return (
    <section className="w-full px-3 py-2 sm:px-4">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-2">
        {categories.map((category, i) => (
          <span
            key={`${category}-${i}`}
            className="px-4 py-2 text-xs font-bold sm:text-sm"
            style={{
              background:
                i === 0 ? "var(--tk-primary)" : "var(--tk-surface)",
              color:
                i === 0 ? "var(--tk-primary-contrast)" : "var(--tk-text)",
              border: "1px solid var(--tk-border)",
              borderRadius: "999px",
            }}
          >
            {category}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
 * PROMOTION BANNER
 * ============================================================ */
export function KitPromotionBanner({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle: string;
  cta: string;
}) {
  return (
    <section className="w-full px-3 py-4 sm:px-4">
      <div
        className="relative mx-auto max-w-[1440px] overflow-hidden px-6 py-10 text-center md:py-14"
        style={{
          background:
            "linear-gradient(120deg, var(--tk-primary), var(--tk-accent))",
          borderRadius: "var(--tk-card-radius)",
        }}
      >
        <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-white/85 md:text-base">{subtitle}</p>
        <span
          className="mt-5 inline-block px-6 py-2.5 text-sm font-bold"
          style={{
            background: "#ffffff",
            color: "var(--tk-text)",
            borderRadius: "var(--tk-radius)",
          }}
        >
          {cta}
        </span>
      </div>
    </section>
  );
}

/* ============================================================
 * BENEFITS SECTION — "Porquê comprar"
 * ============================================================ */
export function KitBenefitsSection({
  storeName,
  title,
  description,
}: {
  storeName: string;
  title?: string;
  description?: string;
}) {
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

  const heading = title || `Porquê comprar na ${storeName}?`;
  const subtitle =
    description || "Uma experiência de compra simples, segura e confiável.";

  return (
    /* @container + queries de contentor: os cartões respondem à
       largura da própria secção (corrigido na Nova — ver história
       do bug mobile). 1 coluna abaixo de 720px de contentor. */
    <section className="@container w-full px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center @[720px]:text-left">
          <h2 className="text-2xl font-bold text-[var(--tk-text)] @[720px]:text-3xl">
            {heading}
          </h2>
          <p className="mt-2 text-sm text-[var(--tk-muted)] @[720px]:text-base">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 @[720px]:grid-cols-4 @[720px]:gap-5">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="flex min-h-[120px] items-center gap-4 px-5 py-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md @[720px]:min-h-[170px] @[720px]:flex-col @[720px]:items-center @[720px]:justify-center @[720px]:px-4 @[720px]:text-center"
                style={{
                  background: "var(--tk-surface)",
                  borderRadius: "var(--tk-card-radius)",
                  border: "1px solid var(--tk-border)",
                }}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center @[720px]:h-14 @[720px]:w-14"
                  style={{
                    borderRadius: "999px",
                    background:
                      "color-mix(in srgb, var(--tk-primary) 12%, transparent)",
                    color: "var(--tk-primary)",
                  }}
                >
                  <Icon className="h-6 w-6 @[720px]:h-7 @[720px]:w-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--tk-text)] @[720px]:text-lg">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--tk-muted)]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* sobre a loja */}
        <div className="mt-10">
          <div
            className="p-6 shadow-sm @[720px]:p-8"
            style={{
              background: "var(--tk-surface)",
              borderRadius: "var(--tk-card-radius)",
              border: "1px solid var(--tk-border)",
            }}
          >
            <div className="max-w-5xl">
              <h2 className="text-2xl font-bold text-[var(--tk-text)] @[720px]:text-3xl">
                {storeName}
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--tk-muted)] @[720px]:text-base">
                <p>
                  A <strong className="text-[var(--tk-text)]">{storeName}</strong>{" "}
                  é uma loja dedicada à comercialização de produtos de
                  qualidade, selecionados cuidadosamente para oferecer aos
                  nossos clientes{" "}
                  <strong className="text-[var(--tk-text)]">
                    excelência, variedade e preços competitivos
                  </strong>
                  .
                </p>
                <p>
                  O nosso compromisso é tornar produtos de qualidade
                  acessíveis a clientes em todo o território nacional, com uma
                  experiência de compra simples, segura e conveniente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * STORE INFO — cartão "Sobre a loja" no fim da storefront
 * ============================================================ */
export function KitStoreInfo({
  name,
  category,
  currency,
}: {
  name: string;
  category?: string | null;
  currency?: string | null;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <section
      className="border-t py-10"
      style={{ borderColor: "var(--tk-border)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="p-6 shadow-sm sm:p-8"
          style={{
            background: "var(--tk-surface)",
            borderRadius: "var(--tk-card-radius)",
            border: "1px solid var(--tk-border)",
          }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center text-xl font-bold"
              style={{
                background: "var(--tk-primary)",
                color: "var(--tk-primary-contrast)",
                borderRadius: "var(--tk-radius)",
              }}
            >
              {initials || "L"}
            </div>
            <div className="flex-1">
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--tk-primary)" }}
              >
                Sobre a loja
              </p>
              <h2 className="mt-1 text-xl font-bold text-[var(--tk-text)]">
                {name}
              </h2>
              <p className="mt-1 text-sm text-[var(--tk-muted)]">
                {category || "Comércio online"} · Moçambique
              </p>
            </div>
            <div
              className="px-4 py-3"
              style={{
                background: "var(--tk-bg)",
                borderRadius: "var(--tk-radius)",
              }}
            >
              <p className="text-[11px] uppercase tracking-wide text-[var(--tk-muted)]">
                Moeda
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--tk-text)]">
                {currency || "MZN"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
