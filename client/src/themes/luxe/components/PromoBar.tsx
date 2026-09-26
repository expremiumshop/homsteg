import {
  ArrowRight,
  Zap,
} from "lucide-react";

export function PromoBar() {
  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white">
      <div className="mx-auto flex max-w-[1500px] items-center justify-center gap-3 px-4 py-2.5 text-center text-xs font-bold sm:text-sm">
        <Zap className="h-4 w-4 fill-current" />
        <span>
          MEGA OFERTAS — Até 50% OFF em
          produtos selecionados
        </span>
        <ArrowRight className="hidden h-4 w-4 sm:block" />
      </div>
    </div>
  );
}

export default PromoBar;
