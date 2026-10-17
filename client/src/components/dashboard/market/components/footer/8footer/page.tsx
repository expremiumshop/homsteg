import { CheckCircle2, Truck } from "lucide-react";

export default function Footer8() {
  return (
    <footer className="rounded-xl bg-emerald-800 p-4 text-white">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex gap-2"><Truck size={16} className="shrink-0 text-emerald-200" /><span className="text-[9px]"><b className="block">Entrega segura</b>Em todo o país</span></div>
        <div className="flex gap-2"><CheckCircle2 size={16} className="shrink-0 text-emerald-200" /><span className="text-[9px]"><b className="block">Compra protegida</b>Suporte disponível</span></div>
      </div>
      <p className="mt-3 border-t border-white/20 pt-2 text-center text-[9px] text-emerald-100">© 2026 · Feito com cuidado</p>
    </footer>
  );
}
