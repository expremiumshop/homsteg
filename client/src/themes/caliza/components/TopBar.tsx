import { Link } from "wouter";

import { Headphones, MapPin } from "lucide-react";

import {
  calizaColors,
  calizaBodyFont,
} from "../theme";

type TopBarProps = {
  storeName?: string;
  storeSlug?: string;
};

export function TopBar({
  storeName = "Caliza Studio",
  storeSlug,
}: TopBarProps) {
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <div
      className="border-b text-[11px] tracking-wide"
      style={{
        background: calizaColors.bg,
        borderColor: calizaColors.border,
        color: calizaColors.textMuted,
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="mx-auto flex h-9 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-5">
          <span className="shrink-0 font-medium">
            Bem-vindo à {storeName}
          </span>

          <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <MapPin size={12} />
            Moçambique
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <Link
            href={`/themes/caliza/mensagens${storeContext}`}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-60"
          >
            <Headphones size={12} />
            Atendimento
          </Link>

          <Link
            href={`/themes/caliza/conta${storeContext}`}
            className="hidden items-center gap-1.5 transition-opacity hover:opacity-60 sm:flex"
          >
            Minha conta
          </Link>

          <span>MZN</span>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
