import {
  ChevronDown,
  MapPin,
} from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-slate-950 text-white">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-2 text-[11px] font-semibold sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          Entrega para Moçambique
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <span>Compra protegida</span>
          <span>Pagamento seguro</span>
          <span>Suporte 24/7</span>
        </div>

        <div className="flex items-center gap-1">
          MZN
          <ChevronDown className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}

export default TopBar;
