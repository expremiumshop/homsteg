import { Truck } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-slate-950 px-4 py-2 text-center text-[11px] font-semibold text-white">
      <span className="inline-flex items-center gap-2">
        <Truck className="h-3.5 w-3.5 text-orange-400" />
        Frete grátis em compras selecionadas
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">
          Ofertas especiais todos os dias
        </span>
      </span>
    </div>
  );
}

export default TopBar;
