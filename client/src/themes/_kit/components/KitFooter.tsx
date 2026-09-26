import { useState } from "react";
import { Camera, Mail, MessageCircle, Share2 } from "lucide-react";
import { Link } from "wouter";

interface KitFooterProps {
  storeName?: string;
  whatsappNumber?: string;
  basePath?: string;
  year?: number;
}

interface FooterSection {
  title: string;
  items: { label: string; href: string }[];
}

/**
 * Footer da _kit — mesma estrutura funcional da Nova
 * (desktop em colunas + mobile em acordeão), visual tokenizado.
 */
export function KitFooter({
  storeName = "LOJA",
  whatsappNumber = "",
  basePath = "/store",
  year = 2026,
}: KitFooterProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const cleanWhats = whatsappNumber.replace(/\D/g, "");
  const whatsappUrl = cleanWhats ? `https://wa.me/${cleanWhats}` : "#";

  const sections: FooterSection[] = [
    {
      title: "COMPRAR",
      items: [
        { label: "Todas as categorias", href: basePath },
        { label: "Novidades", href: `${basePath}/pesquisa?tipo=novidades` },
        { label: "Ofertas", href: `${basePath}/pesquisa?tipo=ofertas` },
      ],
    },
    {
      title: "ATENDIMENTO",
      items: [
        { label: "Como comprar", href: `${basePath}/conta` },
        { label: "Contacte-nos", href: `${basePath}/mensagens` },
        { label: "Entregas", href: `${basePath}/conta` },
      ],
    },
    {
      title: "SOBRE NÓS",
      items: [
        { label: "Sobre nós", href: basePath },
        { label: "Política de privacidade", href: `${basePath}/conta` },
        { label: "Termos e condições", href: `${basePath}/conta` },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "var(--tk-footer-bg)",
        color: "var(--tk-footer-text)",
      }}
    >
      {/* ============ DESKTOP ============ */}
      <div className="hidden border-t border-white/15 md:block">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 grid gap-8 md:grid-cols-5">
            <div>
              <h3 className="mb-4 text-xl font-bold">{storeName}</h3>
              <p className="text-sm leading-relaxed opacity-85">
                Encontre produtos de qualidade, boas ofertas e uma
                experiência de compra simples e segura.
              </p>
              <div className="mt-5 space-y-2 text-sm opacity-80">
                <p>🇲🇿 Loja online em Moçambique</p>
                <p>🚚 Entregas em várias regiões</p>
                <p>🔒 Compras seguras</p>
              </div>
            </div>

            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-4 text-base font-bold">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm opacity-80 transition-opacity hover:opacity-100"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="mb-4 text-base font-bold">SIGA-NOS</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
                >
                  <Camera size={19} />
                </a>
                <a
                  href={whatsappUrl}
                  target={whatsappUrl !== "#" ? "_blank" : undefined}
                  rel={whatsappUrl !== "#" ? "noopener noreferrer" : undefined}
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
                >
                  <MessageCircle size={19} />
                </a>
                <a
                  href="#"
                  aria-label="Email"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
                >
                  <Mail size={19} />
                </a>
                <button
                  type="button"
                  aria-label="Partilhar"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.share) {
                      navigator.share({
                        title: storeName,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
                >
                  <Share2 size={19} />
                </button>
              </div>
            </div>
          </div>

          {/* pagamentos */}
          <div className="border-t border-white/15 py-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm opacity-80">
                © {year} {storeName}. Todos os direitos reservados.
              </p>
              <div className="flex flex-wrap gap-2">
                {["M-Pesa", "e-Mola", "mKesh", "🏦"].map((method) => (
                  <div
                    key={method}
                    className="flex h-8 min-w-[55px] items-center justify-center rounded bg-white/10 px-2 text-xs font-bold"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-center text-xs opacity-70">
              Preços apresentados em Meticais (MZN)
            </p>
          </div>
        </div>
      </div>

      {/* ============ MOBILE ============ */}
      <div className="px-4 py-8 md:hidden">
        <div className="mb-5">
          <h3 className="mb-3 font-bold">{storeName}</h3>
          <p className="text-xs leading-relaxed opacity-85">
            Encontre produtos de qualidade, boas ofertas e uma experiência
            de compra simples e segura.
          </p>
        </div>

        {sections.map((section) => {
          const isOpen = expanded === section.title;
          return (
            <div key={section.title} className="border-t border-white/15">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : section.title)}
                className="flex w-full items-center justify-between py-4"
              >
                <span className="text-sm font-semibold">{section.title}</span>
                <span
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              {isOpen && (
                <div className="space-y-2 pb-4">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block pl-3 text-sm opacity-80 hover:opacity-100"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-6 border-t border-white/15 pt-6">
          <div className="flex flex-wrap justify-center gap-2">
            {["M-Pesa", "e-Mola", "mKesh", "🏦 Banco"].map((method) => (
              <div
                key={method}
                className="rounded bg-white/10 px-3 py-2 text-xs font-bold"
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs opacity-75">
          © {year} {storeName}
        </p>
      </div>
    </footer>
  );
}

export default KitFooter;
