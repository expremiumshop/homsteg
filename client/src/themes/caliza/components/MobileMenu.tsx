import { Link } from "wouter";

import { ChevronRight, X } from "lucide-react";

import {
  calizaColors,
  calizaBodyFont,
  calizaHeadingFont,
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
  storeName = "Caliza Studio",
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
      href: `/themes/caliza${ctx}`,
    },
    {
      label: "Atendimento",
      href: `/themes/caliza/mensagens${ctx}`,
    },
    {
      label: "Carrinho",
      href: `/themes/caliza/carrinho${ctx}`,
    },
    {
      label: "Minha conta",
      href: `/themes/caliza/conta${ctx}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[120]"
      style={{
        fontFamily: calizaBodyFont,
      }}
    >
      {/* VEUE */}

      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-stone-900/40"
      />

      {/* PAINEL */}

      <aside
        className="absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col"
        style={{
          background: calizaColors.surface,
          color: calizaColors.text,
        }}
      >
        {/* CABEÇALHO */}

        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{
            borderColor: calizaColors.border,
          }}
        >
          <span
            className="truncate text-xl"
            style={{
              fontFamily: calizaHeadingFont,
              fontWeight: 600,
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
              color: calizaColors.textMuted,
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
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-stone-100"
                >
                  {link.label}

                  <ChevronRight
                    size={16}
                    style={{
                      color:
                        calizaColors.textMuted,
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
            borderColor: calizaColors.border,
          }}
        >
          <p className="text-xs leading-5 text-stone-400">
            Peças com alma de atelier,
            inspiradas na paisagem
            mediterrânica.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default MobileMenu;
