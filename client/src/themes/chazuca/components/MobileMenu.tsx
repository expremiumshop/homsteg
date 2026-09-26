import { Link } from "wouter";

import { ChevronRight, X } from "lucide-react";

import {
  chazucaColors,
  chazucaBodyFont,
  chazucaHeadingFont,
} from "../theme";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  storeName?: string;
  storeSlug?: string;
};

export function MobileMenu({
  open,
  onClose,
  storeName = "Chazuca Lab",
  storeSlug,
}: MobileMenuProps) {
  if (!open) {
    return null;
  }

  const ctx = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  const links = [
    {
      label: "Início",
      href: `/themes/chazuca${ctx}`,
    },
    {
      label: "Atendimento",
      href: `/themes/chazuca/mensagens${ctx}`,
    },
    {
      label: "Carrinho",
      href: `/themes/chazuca/carrinho${ctx}`,
    },
    {
      label: "Minha conta",
      href: `/themes/chazuca/conta${ctx}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[120]"
      style={{
        fontFamily: chazucaBodyFont,
      }}
    >
      {/* VEUE */}

      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-indigo-950/50"
      />

      {/* PAINEL */}

      <aside
        className="absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col"
        style={{
          background: chazucaColors.surface,
          color: chazucaColors.text,
        }}
      >
        {/* CABEÇALHO */}

        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{
            borderColor: chazucaColors.border,
          }}
        >
          <span
            className="truncate text-xl"
            style={{
              fontFamily: chazucaHeadingFont,
              fontWeight: 700,
            }}
          >
            {storeName}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:opacity-60"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* LINKS */}

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <p
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{
              color: chazucaColors.textMuted,
            }}
          >
            Navegação
          </p>

          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-purple-50"
                >
                  {link.label}

                  <ChevronRight
                    size={16}
                    style={{
                      color:
                        chazucaColors.textMuted,
                    }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* RODAPÉ DO PAINEL */}

        <div
          className="border-t px-5 py-5"
          style={{
            borderColor: chazucaColors.border,
          }}
        >
          <p className="text-xs leading-5 text-violet-500">
            Peças ousadas para quem define
            tendência.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default MobileMenu;
