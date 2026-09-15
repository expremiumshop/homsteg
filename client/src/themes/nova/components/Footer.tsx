"use client";

import {
  Mail,
  Camera,
  Share2,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface FooterProps {
  storeName?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  email?: string;
  basePath?: string;
  year?: number;
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
  year = 2026,
}: FooterProps) {
  const [expandedSection, setExpandedSection] =
    useState<string | null>(null);

  const cleanWhatsappNumber =
    whatsappNumber.replace(/\D/g, "");

  const whatsappUrl = cleanWhatsappNumber
    ? `https://wa.me/${cleanWhatsappNumber}`
    : "#";

  const emailUrl = email
    ? `mailto:${email}`
    : "#";

  const sections: FooterSection[] = [
    {
      title: "COMPRAR",
      items: [
        {
          label: "Todas as categorias",
          href: basePath,
        },
        {
          label: "Eletrónica",
          href: `${basePath}/categoria/eletronica`,
        },
        {
          label: "Moda",
          href: `${basePath}/categoria/moda`,
        },
        {
          label: "Beleza",
          href: `${basePath}/categoria/beleza`,
        },
        {
          label: "Brinquedos",
          href: `${basePath}/categoria/brinquedos`,
        },
        {
          label: "Novidades",
          href: `${basePath}/pesquisa?tipo=novidades`,
        },
        {
          label: "Ofertas",
          href: `${basePath}/pesquisa?tipo=ofertas`,
        },
      ],
    },
    {
      title: "ATENDIMENTO",
      items: [
        {
          label: "Central de ajuda",
          href: `${basePath}/ajuda`,
        },
        {
          label: "Contacte-nos",
          href: `${basePath}/contacto`,
        },
        {
          label: "Como comprar",
          href: `${basePath}/como-comprar`,
        },
        {
          label: "Entregas",
          href: `${basePath}/entregas`,
        },
        {
          label: "Devoluções e reembolsos",
          href: `${basePath}/devolucoes`,
        },
        {
          label: "Perguntas frequentes",
          href: `${basePath}/faq`,
        },
      ],
    },
    {
      title: "SOBRE NÓS",
      items: [
        {
          label: "Sobre nós",
          href: `${basePath}/sobre`,
        },
        {
          label: "Como funciona",
          href: `${basePath}/como-funciona`,
        },
        {
          label: "Trabalhe connosco",
          href: `${basePath}/carreiras`,
        },
        {
          label: "Política de privacidade",
          href: `${basePath}/privacidade`,
        },
        {
          label: "Termos e condições",
          href: `${basePath}/termos`,
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
    <footer className="bg-blue-950 text-white">
      {/* =====================================================
          DESKTOP FOOTER
          ===================================================== */}

      <div className="hidden border-t border-white/15 md:block">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12 grid gap-8 md:grid-cols-5">
            {/* MARCA */}

            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">
                  {storeName}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-white/85">
                Encontre produtos de qualidade, boas
                ofertas e uma experiência de compra
                simples e segura.
              </p>

              <div className="mt-5 space-y-2 text-sm text-white/80">
                <p>🇲🇿 Loja online em Moçambique</p>
                <p>🚚 Entregas em várias regiões</p>
                <p>🔒 Compras seguras</p>
              </div>
            </div>

            {/* COMPRAR */}

            <div>
              <h4 className="mb-4 text-lg font-bold text-white">
                COMPRAR
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
                ATENDIMENTO
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
                SOBRE NÓS
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
                SIGA-NOS
              </h4>

              <p className="mb-4 text-sm leading-relaxed text-white/80">
                Acompanhe a nossa loja nas redes sociais
                e fique por dentro das novidades e ofertas.
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
                  aria-label="Partilhar"
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
                md:flex-row
              "
            >
              <p className="text-sm text-white/80">
                © {year} {storeName}. Todos os direitos
                reservados.
              </p>

              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-3
                  md:flex-row
                "
              >
                <span className="text-xs text-white/75">
                  Métodos de pagamento:
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
              Preços apresentados em Meticais (MZN)
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE FOOTER
          ===================================================== */}

      <div className="px-4 py-8 md:hidden">
        {/* MARCA */}

        <div className="mb-6">
          <div className="mb-4">
            <h3 className="font-bold text-white">
              {storeName}
            </h3>
          </div>

          <p className="text-xs leading-relaxed text-white/85">
            Encontre produtos de qualidade, boas ofertas e
            uma experiência de compra simples e segura.
          </p>

          <div className="mt-3 space-y-1 text-xs text-white/80">
            <p>🇲🇿 Loja online em Moçambique</p>
            <p>🚚 Entregas em várias regiões</p>
            <p>🔒 Compras seguras</p>
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
            MÉTODOS DE PAGAMENTO
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
              🏦 Banco
            </div>
          </div>
        </div>

        {/* REDES SOCIAIS */}

        <div className="mt-6 border-t border-white/15 pt-6">
          <p className="mb-4 text-center text-xs text-white/75">
            SIGA A NOSSA LOJA
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
              aria-label="Partilhar"
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
            © {year} {storeName}. Todos os direitos
            reservados.
          </p>

          <p className="mt-2 text-center text-xs text-white/65">
            Compras online em Moçambique • Valores em MZN
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;