import { Link } from "wouter";

import {
  Headphones,
  MapPin,
} from "lucide-react";

import {
  essenzaFreeShippingThreshold,
  formatPrice,
} from "../demoData";

type TopBarProps = {
  storeName?: string;
  storeSlug?: string;
};

export function TopBar({
  storeName = "Essenza",
  storeSlug,
}: TopBarProps) {
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <div className="border-b border-neutral-200 bg-white text-neutral-900">
      <div className="mx-auto flex h-9 w-full max-w-[1440px] items-center justify-between px-5 text-[11px] tracking-wide sm:px-8">
        <div className="flex min-w-0 items-center gap-5">
          <span className="shrink-0 font-medium">
            Bem-vindo à {storeName}
          </span>

          <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
            Frete grátis acima de {formatPrice(essenzaFreeShippingThreshold)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <Link
            href={`/themes/essenza/mensagens${storeContext}`}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-60"
          >
            <Headphones size={12} />
            Atendimento
          </Link>

          <span className="hidden items-center gap-1.5 md:flex">
            <MapPin size={12} />
            Moçambique
          </span>

          <span>MZN</span>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
