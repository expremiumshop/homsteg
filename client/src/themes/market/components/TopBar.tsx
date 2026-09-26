import { Link } from "wouter";

import {
  Headphones,
  MapPin,
  Package,
  Zap,
} from "lucide-react";

type TopBarProps = {
  storeName?: string;
  storeSlug?: string;
};

export function TopBar({
  storeName = "Market",
  storeSlug,
}: TopBarProps) {
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <div className="bg-emerald-700 text-white">
      <div className="mx-auto flex h-9 w-full max-w-[1400px] items-center justify-between px-4 text-xs sm:px-6">
        <div className="flex min-w-0 items-center gap-5">
          <span className="shrink-0 font-semibold">
            Bem-vindo à {storeName}
          </span>

          <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <Zap size={13} />
            Super ofertas da semana
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <span className="hidden items-center gap-1.5 sm:flex">
            <Package size={13} />
            Entrega em 24h
          </span>

          <Link
            href={`/themes/market/mensagens${storeContext}`}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
          >
            <Headphones size={13} />
            Atendimento
          </Link>

          <span className="hidden items-center gap-1.5 md:flex">
            <MapPin size={13} />
            Moçambique
          </span>

          <span>MZN</span>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
