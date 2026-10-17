import { ArrowUpRight } from "lucide-react";

export default function Footer6() {
  return (
    <footer className="grid grid-cols-2 gap-4 rounded-xl bg-slate-900 p-5 text-white">
      <div><strong className="text-xs">A loja</strong><p className="mt-2 space-y-1 text-[10px] text-slate-300"><span className="block">Novidades</span><span className="block">Categorias</span></p></div>
      <div><strong className="text-xs">Ajuda</strong><p className="mt-2 space-y-1 text-[10px] text-slate-300"><span className="block">Entregas</span><span className="block">Devoluções</span></p></div>
      <div className="col-span-2 flex items-center justify-between border-t border-white/15 pt-3 text-[9px] text-slate-400"><span>© 2026 NOVA STORE</span><ArrowUpRight size={14} /></div>
    </footer>
  );
}
