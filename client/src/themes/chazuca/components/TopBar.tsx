import { Link } from "wouter";

import { Headphones, MapPin } from "lucide-react";

import {
  chazucaColors,
  chazucaBodyFont,
} from "../theme";

type TopBarProps = {
  storeName?: string;
  storeSlug?: string;
};

export function TopBar({
  storeName = "Chazuca Lab",
  storeSlug,
}: TopBarProps) {
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <div
      className="text-[11px] tracking-wide"
      style={{
        background: chazucaColors.headerBg,
        color: chazucaColors.headerText,
        fontFamily: chazucaBodyFont,
      }}
    >
      <div className="mx-auto flex h-9 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-5">
          <span className="shrink-0 font-medium opacity-90">
            Bem-vindo à {storeName}
          </span>

          <span className="hidden shrink-0 items-center gap-1.5 opacity-80 sm:flex">
            <MapPin size={12} />
            Moçambique
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <Link
            href={`/themes/chazuca/mensagens${storeContext}`}
            className="flex items-center gap-1.5 opacity-90 transition hover:opacity-100"
          >
            <Headphones size={12} />
            Atendimento
          </Link>

          <Link
            href={`/themes/chazuca/conta${storeContext}`}
            className="hidden items-center gap-1.5 opacity-90 transition hover:opacity-100 sm:flex"
          >
            Minha conta
          </Link>

          <span className="opacity-80">MZN</span>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
