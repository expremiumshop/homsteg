"use client";

import {
  Mail,
  Send,
  Camera,
  Share2,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

import { useI18n } from "@/lib/i18n-context";

import {
  normalizeFooterModel,
  type FooterModel,
} from "../footerModels";

interface FooterProps {
  storeName?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  email?: string;
  basePath?: string;
  storeSlug?: string;
  year?: number;
  /**
   * Modelo do rodapé escolhido na Personalização da
   * loja (Market → store_market_features). "1" = estilo
   * atual da loja, inalterado.
   */
  footerModel?: string | null;
}

interface FooterSection {
  title: string;
  items: {
    label: string;
    href: string;
  }[];
}

export function Footer({
  storeName = "NOVA STORE",
  whatsappNumber = "",
  instagramUrl = "#",
  email = "",
  basePath = "/themes/nova",
  storeSlug,
  year = 2026,
  footerModel,
}: FooterProps) {
  /*
   * Moeda da loja (Configurações → Idioma e moeda). Os textos
   * fixos "Meticais (MZN)" e "Valores em MZN" passam a seguir
   * a moeda escolhida, em vez de assumirem sempre MZN.
   */
  const { t, currency } = useI18n();

  const [expandedSection, setExpandedSection] =
    useState<string | null>(null);

  const model: FooterModel =
    normalizeFooterModel(footerModel);
  const withStoreContext = (href: string) => {
    if (!storeSlug) return href;
    const [path, query = ""] = href.split("?");
    const params = new URLSearchParams(query);
    params.set("storeSlug", storeSlug);
    return `${path}?${params.toString()}`;
  };

  /*
   * URLs derivadas do WhatsApp/email da loja.
   *
   * Declaradas AQUI (antes de qualquer return): os modelos
   * 4–10 usam-nas no return abaixo — antes eram declaradas
   * depois desse return, o que causava ReferenceError
   * (TDZ) no storefront para esses modelos.
   */
  const cleanWhatsappNumber =
    whatsappNumber.replace(/\D/g, "");

  const whatsappUrl = cleanWhatsappNumber
    ? `https://wa.me/${cleanWhatsappNumber}`
    : "#";

  const emailUrl = email
    ? `mailto:${email}`
    : "#";

  if (
    model === "4" ||
    model === "5" ||
    model === "6" ||
    model === "7" ||
    model === "8" ||
    model === "9" ||
    model === "10"
  ) {
    return (
      <AddedFooter
        model={model}
        storeName={storeName}
        basePath={basePath}
        storeSlug={storeSlug}
        whatsappUrl={whatsappUrl}
        instagramUrl={instagramUrl}
        emailUrl={emailUrl}
        year={year}
      />
    );
  }

  /*
   * MODELO 3 — MINIMAL: uma linha com marca, links
   * e copyright. Substitui o footer completo.
   */
  if (model === "3") {
    return (
      <footer className="@container border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-gray-500 @min-[640px]:flex-row @min-[640px]:px-6">
          <span className="font-black text-slate-950">
            {storeName}
          </span>

          <div className="flex items-center gap-4">
            <Link
              href={withStoreContext(basePath)}
              className="transition hover:text-slate-950"
            >
              {t("footer.products")}
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-slate-950"
            >
              {t("footer.contacts")}
            </a>

            <Link
              href={withStoreContext(`${basePath}/ajuda`)}
              className="transition hover:text-slate-950"
            >
              {t("footer.help")}
            </Link>
          </div>

          <span>
            © {year} {storeName}
          </span>
        </div>
      </footer>
    );
  }

  /*
   * MODELO 2 — ESCURO: fundo escuro com newsletter
   * e links em duas colunas.
   */
  if (model === "2") {
    return (
      <footer className="@container bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 @min-[640px]:px-6">
          <div className="grid grid-cols-1 gap-8 @min-[640px]:grid-cols-2">
            <div>
              <p className="text-sm font-black">
                {t("footer.newsletterTitle")}
              </p>

              <p className="mt-1 text-xs leading-5 text-white/60">
                {t("footer.newsletterText")}
              </p>

              <div className="mt-3 flex max-w-sm items-center gap-2 rounded-full bg-white/10 p-1 pl-4">
                <span className="flex-1 text-xs text-white/50">
                  {t("footer.yourEmail")}
                </span>

                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-slate-950"
                >
                  <Send className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-start justify-start gap-8 @min-[640px]:justify-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide">
                  {t("footer.store")}
                </p>

                <ul className="mt-2 space-y-1 text-xs text-white/60">
                  <li>
                    <Link
                      href={withStoreContext(basePath)}
                      className="transition hover:text-white"
                    >
                      {t("footer.products")}
                    </Link>
                  </li>

                  <li>
                    <Link
                      href={withStoreContext(`${basePath}/pesquisa?tipo=ofertas`)}
                      className="transition hover:text-white"
                    >
                      {t("footer.promotions")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide">
                  {t("footer.help")}
                </p>

                <ul className="mt-2 space-y-1 text-xs text-white/60">
                  <li>
                    <Link
                      href={withStoreContext(`${basePath}/contacto`)}
                      className="transition hover:text-white"
                    >
                      {t("footer.contacts")}
                    </Link>
                  </li>

                  <li>
                    <Link
                      href={withStoreContext(`${basePath}/ajuda`)}
                      className="transition hover:text-white"
                    >
                      {t("footer.deliveries")}
                    </Link>
                  </li>

                  <li>
                    <Link
                      href={withStoreContext(`${basePath}/termos`)}
                      className="transition hover:text-white"
                    >
                      {t("footer.returns")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 px-0 pt-3 text-center text-[11px] text-white/40">
            © {year} {storeName}. {t("footer.allRights")}
          </div>
        </div>
      </footer>
    );
  }

  /*
   * MODELO 1 — CLÁSSICO: footer atual da loja,
   * intacto (abaixo).
   */

  const sections: FooterSection[] = [
    {
      title: t("footer.shop"),
      items: [
        {
          label: t("footer.allCategories"),
          href: withStoreContext(basePath),
        },
        {
          label: t("footer.electronics"),
          href: withStoreContext(`${basePath}/pesquisa?categoria=eletronica`),
        },
        {
          label: t("footer.fashion"),
          href: withStoreContext(`${basePath}/pesquisa?categoria=moda`),
        },
        {
          label: t("footer.beauty"),
          href: withStoreContext(`${basePath}/pesquisa?categoria=beleza`),
        },
        {
          label: t("footer.toys"),
          href: withStoreContext(`${basePath}/pesquisa?categoria=brinquedos`),
        },
        {
          label: t("footer.newArrivals"),
          href: withStoreContext(`${basePath}/pesquisa?tipo=novidades`),
        },
        {
          label: t("footer.deals"),
          href: withStoreContext(`${basePath}/pesquisa?tipo=ofertas`),
        },
      ],
    },
    {
      title: t("footer.service"),
      items: [
        {
          label: t("footer.helpCenter"),
          href: withStoreContext(`${basePath}/ajuda`),
        },
        {
          label: t("footer.contactUs"),
          href: withStoreContext(`${basePath}/contacto`),
        },
        {
          label: t("footer.howToBuy"),
          href: withStoreContext(`${basePath}/ajuda`),
        },
        {
          label: t("footer.deliveries"),
          href: withStoreContext(`${basePath}/ajuda`),
        },
        {
          label: t("footer.returnsRefunds"),
          href: withStoreContext(`${basePath}/termos`),
        },
        {
          label: t("footer.faq"),
          href: withStoreContext(`${basePath}/ajuda`),
        },
      ],
    },
    {
      title: t("footer.aboutUsTitle"),
      items: [
        {
          label: t("footer.aboutUs"),
          href: withStoreContext(`${basePath}/sobre`),
        },
        {
          label: t("footer.howItWorks"),
          href: withStoreContext(`${basePath}/sobre`),
        },
        {
          label: t("footer.workWithUs"),
          href: withStoreContext(`${basePath}/sobre`),
        },
        {
          label: t("footer.privacy"),
          href: withStoreContext(`${basePath}/termos`),
        },
        {
          label: t("footer.terms"),
          href: withStoreContext(`${basePath}/termos`),
        },
      ],
    },
  ];

  function toggleSection(section: string) {
    setExpandedSection((current) =>
      current === section ? null : section,
    );
  }

  return (
    <footer className="@container bg-blue-950 text-white">
      {/* =====================================================
          DESKTOP FOOTER
          ===================================================== */}

      <div className="hidden border-t border-white/15 @min-[768px]:block">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12 grid gap-8 @min-[768px]:grid-cols-5">
            {/* MARCA */}

            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">
                  {storeName}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-white/85">
                {t("footer.tagline")}
              </p>

              <div className="mt-5 space-y-2 text-sm text-white/80">
                <p>🇲🇿 {t("footer.onlineStore")}</p>
                <p>🚚 {t("footer.regions")}</p>
                <p>🔒 {t("footer.securePurchases")}</p>
              </div>
            </div>

            {/* COMPRAR */}

            <div>                <h4 className="mb-4 text-lg font-bold text-white">
                  {t("footer.shop")}
                </h4>

              <ul className="space-y-2">
                {sections[0].items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="
                        text-sm
                        text-white/80
                        transition-colors
                        hover:text-white
                      "
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ATENDIMENTO */}

            <div>
              <h4 className="mb-4 text-lg font-bold text-white">
                {t("footer.service")}
              </h4>

              <ul className="space-y-2">
                {sections[1].items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="
                        text-sm
                        text-white/80
                        transition-colors
                        hover:text-white
                      "
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SOBRE NÓS */}

            <div>
              <h4 className="mb-4 text-lg font-bold text-white">
                {t("footer.aboutUsTitle")}
              </h4>

              <ul className="space-y-2">
                {sections[2].items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="
                        text-sm
                        text-white/80
                        transition-colors
                        hover:text-white
                      "
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SIGA-NOS */}

            <div>
              <h4 className="mb-4 text-lg font-bold text-white">
                {t("footer.followUs")}
              </h4>

              <p className="mb-4 text-sm leading-relaxed text-white/80">
                {t("footer.followText")}
              </p>

              <div className="flex gap-3">
                <a
                  href={instagramUrl}
                  target={
                    instagramUrl !== "#"
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    instagramUrl !== "#"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label="Instagram"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-white
                    transition-colors
                    hover:bg-primary
                  "
                >
                  <Camera size={20} />
                </a>

                <a
                  href={emailUrl}
                  aria-label="Email"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-white
                    transition-colors
                    hover:bg-primary
                  "
                >
                  <Mail size={20} />
                </a>

                <a
                  href={whatsappUrl}
                  target={
                    whatsappUrl !== "#"
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    whatsappUrl !== "#"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label="WhatsApp"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-white
                    transition-colors
                    hover:bg-primary
                  "
                >
                  <MessageCircle size={20} />
                </a>

                <button
                  type="button"
                  aria-label={t("footer.share")}
                  onClick={() => {
                    if (
                      typeof navigator !== "undefined" &&
                      navigator.share
                    ) {
                      navigator.share({
                        title: storeName,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-white
                    transition-colors
                    hover:bg-primary
                  "
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* PAGAMENTOS */}

          <div className="border-t border-white/15 py-6">
            <div
              className="
                flex
                flex-col
                items-center
                justify-between
                gap-5
                @min-[768px]:flex-row
              "
            >
              <p className="text-sm text-white/80">
                © {year} {storeName}. {t("footer.allRights")}
              </p>

              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-3
                  @min-[768px]:flex-row
                "
              >
                <span className="text-xs text-white/75">
                  {t("footer.paymentMethods")}
                </span>

                <div className="flex gap-2">
                  <div
                    className="
                      flex
                      h-8
                      min-w-[55px]
                      items-center
                      justify-center
                      rounded
                      bg-white/10
                      px-2
                      text-xs
                      font-bold
                      text-white
                    "
                  >
                    M-Pesa
                  </div>

                  <div
                    className="
                      flex
                      h-8
                      min-w-[55px]
                      items-center
                      justify-center
                      rounded
                      bg-white/10
                      px-2
                      text-xs
                      font-bold
                      text-white
                    "
                  >
                    e-Mola
                  </div>

                  <div
                    className="
                      flex
                      h-8
                      min-w-[55px]
                      items-center
                      justify-center
                      rounded
                      bg-white/10
                      px-2
                      text-xs
                      font-bold
                      text-white
                    "
                  >
                    mKesh
                  </div>

                  <div
                    className="
                      flex
                      h-8
                      w-10
                      items-center
                      justify-center
                      rounded
                      bg-white/10
                      text-xs
                      font-bold
                      text-white
                    "
                  >
                    🏦
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-white/70">
              {t("footer.pricesIn", { currency })}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE FOOTER
          ===================================================== */}

      <div className="px-4 py-8 @min-[768px]:hidden">
        {/* MARCA */}

        <div className="mb-6">
          <div className="mb-4">
            <h3 className="font-bold text-white">
              {storeName}
            </h3>
          </div>

          <p className="text-xs leading-relaxed text-white/85">
            {t("footer.tagline")}
          </p>

          <div className="mt-3 space-y-1 text-xs text-white/80">
            <p>🇲🇿 {t("footer.onlineStore")}</p>
            <p>🚚 {t("footer.regions")}</p>
            <p>🔒 {t("footer.securePurchases")}</p>
          </div>
        </div>

        {/* ACCORDION */}

        {sections.map((section) => {
          const isExpanded =
            expandedSection === section.title;

          return (
            <div
              key={section.title}
              className="border-t border-white/15"
            >
              <button
                type="button"
                onClick={() =>
                  toggleSection(section.title)
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  py-4
                  text-white
                  transition-colors
                  hover:bg-white/5
                "
              >
                <span className="text-sm font-semibold">
                  {section.title}
                </span>

                <span
                  className={`
                    text-white
                    transition-transform
                    ${
                      isExpanded
                        ? "rotate-180"
                        : ""
                    }
                  `}
                >
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div className="space-y-2 pb-4">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="
                        block
                        pl-4
                        text-sm
                        text-white/80
                        transition-colors
                        hover:text-white
                      "
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* PAGAMENTOS MOBILE */}

        <div className="border-t border-white/15 pt-6">
          <h4 className="mb-4 text-center text-sm font-semibold text-white">
            {t("footer.paymentMethodsTitle")}
          </h4>

          <div className="flex flex-wrap justify-center gap-2">
            <div className="rounded bg-white/10 px-3 py-2 text-xs font-bold text-white">
              M-Pesa
            </div>

            <div className="rounded bg-white/10 px-3 py-2 text-xs font-bold text-white">
              e-Mola
            </div>

            <div className="rounded bg-white/10 px-3 py-2 text-xs font-bold text-white">
              mKesh
            </div>

            <div className="rounded bg-white/10 px-3 py-2 text-xs font-bold text-white">
              🏦 {t("footer.bank")}
            </div>
          </div>
        </div>

        {/* REDES SOCIAIS */}

        <div className="mt-6 border-t border-white/15 pt-6">
          <p className="mb-4 text-center text-xs text-white/75">
            {t("footer.followStore")}
          </p>

          <div className="mb-5 flex justify-center gap-3">
            <a
              href={instagramUrl}
              target={
                instagramUrl !== "#"
                  ? "_blank"
                  : undefined
              }
              rel={
                instagramUrl !== "#"
                  ? "noopener noreferrer"
                  : undefined
              }
              aria-label="Instagram"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                transition-colors
                hover:bg-primary
              "
            >
              <Camera size={18} />
            </a>

            <a
              href={emailUrl}
              aria-label="Email"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                transition-colors
                hover:bg-primary
              "
            >
              <Mail size={18} />
            </a>

            <a
              href={whatsappUrl}
              target={
                whatsappUrl !== "#"
                  ? "_blank"
                  : undefined
              }
              rel={
                whatsappUrl !== "#"
                  ? "noopener noreferrer"
                  : undefined
              }
              aria-label="WhatsApp"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                transition-colors
                hover:bg-primary
              "
            >
              <MessageCircle size={18} />
            </a>

            <button
              type="button"
              aria-label={t("footer.share")}
              onClick={() => {
                if (
                  typeof navigator !== "undefined" &&
                  navigator.share
                ) {
                  navigator.share({
                    title: storeName,
                    url: window.location.href,
                  });
                }
              }}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                transition-colors
                hover:bg-primary
              "
            >
              <Share2 size={18} />
            </button>
          </div>

          <p className="text-center text-xs text-white/70">
            © {year} {storeName}. {t("footer.allRights")}
          </p>

          <p className="mt-2 text-center text-xs text-white/65">
            {t("footer.onlinePrices", { currency })}
          </p>
        </div>
      </div>
    </footer>
  );
}

function AddedFooter({
  model,
  storeName,
  basePath,
  storeSlug,
  whatsappUrl,
  instagramUrl,
  emailUrl,
  year,
}: {
  model: Exclude<FooterModel, "1" | "2" | "3">;
  storeName: string;
  basePath: string;
  storeSlug?: string;
  whatsappUrl: string;
  instagramUrl: string;
  emailUrl: string;
  year: number;
}) {
  const withStoreContext = (href: string) => {
    if (!storeSlug) return href;
    const [path, query = ""] = href.split("?");
    const params = new URLSearchParams(query);
    params.set("storeSlug", storeSlug);
    return `${path}?${params.toString()}`;
  };
  const links = (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
      <Link href={withStoreContext(basePath)}>Produtos</Link>
      <Link href={withStoreContext(`${basePath}/ajuda`)}>Ajuda</Link>
      <Link href={withStoreContext(`${basePath}/contacto`)}>Contacto</Link>
    </div>
  );
  const contact = (
    <div className="flex items-center gap-3">
      <a href={instagramUrl} aria-label="Instagram"><Camera size={16} /></a>
      <a href={emailUrl} aria-label="Email"><Mail size={16} /></a>
      <a href={whatsappUrl} aria-label="WhatsApp"><MessageCircle size={16} /></a>
    </div>
  );

  if (model === "4") {
    return (
      <footer className="bg-amber-50 px-5 py-5 text-amber-950">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Mail size={20} className="text-amber-700" />
          <div className="flex-1"><strong className="block text-sm">Fala connosco</strong><span className="text-xs text-amber-800">Estamos aqui para ajudar.</span></div>
          {contact}
        </div>
        <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between border-t border-amber-200 pt-3 text-[10px] text-amber-700">{links}<span>© {year} {storeName}</span></div>
      </footer>
    );
  }

  if (model === "5") {
    return (
      <footer className="@container border-y border-stone-200 bg-[#faf8f4] px-6 py-8 text-stone-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 @min-[640px]:flex-row @min-[640px]:items-center @min-[640px]:justify-between">
          <div><strong className="font-serif text-xl">{storeName}</strong><p className="mt-1 text-xs text-stone-500">Objetos escolhidos com intenção.</p></div>
          {links}{contact}
        </div>
        <p className="mx-auto mt-6 max-w-7xl border-t border-stone-200 pt-3 text-[10px] text-stone-500">© {year} {storeName}. Todos os direitos reservados.</p>
      </footer>
    );
  }

  if (model === "6") {
    return (
      <footer className="@container bg-slate-900 px-6 py-8 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 @min-[640px]:grid-cols-2">
          <div><strong className="text-sm">A loja</strong><div className="mt-3">{links}</div></div>
          <div><strong className="text-sm">Apoio ao cliente</strong><p className="mt-3 text-xs text-slate-300">Entregas, pagamentos e devoluções.</p><div className="mt-3">{contact}</div></div>
        </div>
        <p className="mx-auto mt-6 max-w-7xl border-t border-white/15 pt-3 text-[10px] text-slate-400">© {year} {storeName}</p>
      </footer>
    );
  }

  if (model === "7") {
    return (
      <footer className="border-t border-rose-100 bg-white px-5 py-8 text-center text-slate-800">
        <div className="mx-auto max-w-3xl"><strong className="font-serif text-lg">Obrigado pela visita</strong><p className="mt-1 text-xs text-slate-500">Compra local, escolha com carinho.</p><div className="mt-4 flex justify-center">{links}</div><div className="mt-4 flex justify-center text-rose-600">{contact}</div><p className="mt-4 text-[10px] text-slate-400">© {year} {storeName}</p></div>
      </footer>
    );
  }

  if (model === "8") {
    return (
      <footer className="@container bg-emerald-800 px-6 py-7 text-white">
        <div className="mx-auto max-w-7xl"><div className="grid gap-5 @min-[640px]:grid-cols-2"><div><strong className="text-sm">Entrega segura</strong><p className="mt-1 text-xs text-emerald-100">Enviamos para todo o país.</p></div><div><strong className="text-sm">Compra protegida</strong><p className="mt-1 text-xs text-emerald-100">A nossa equipa está disponível para ajudar.</p></div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4 text-emerald-100">{links}{contact}<span className="text-[10px]">© {year} {storeName}</span></div></div>
      </footer>
    );
  }

  if (model === "9") {
    return (
      <footer className="@container border-t border-slate-200 bg-white px-5 py-4 text-slate-600">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 @min-[640px]:flex-row"><div><strong className="text-xs text-slate-900">{storeName}</strong><p className="mt-1 text-[10px]">© {year} · Todos os direitos reservados</p></div>{links}{contact}</div>
      </footer>
    );
  }

  return (
    <footer className="px-5 py-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-indigo-950">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><strong className="text-lg font-black">{storeName}</strong><p className="mt-1 text-xs text-indigo-800">Bem-estar começa em casa.</p></div>{contact}</div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-200 pt-3">{links}<span className="text-[10px] text-indigo-700">© {year} {storeName}</span></div>
      </div>
    </footer>
  );
}

export default Footer;