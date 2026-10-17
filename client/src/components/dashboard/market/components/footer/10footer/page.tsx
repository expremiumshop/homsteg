import { ArrowUpRight, MapPin, Phone } from "lucide-react";

export default function Footer10() {
  return (
    <footer className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
      <div className="flex items-center justify-between"><strong className="text-sm font-black text-indigo-950">CASA & CIA</strong><ArrowUpRight size={16} className="text-indigo-700" /></div>
      <p className="mt-1 text-[10px] text-indigo-800">Bem-estar começa em casa.</p>
      <div className="mt-3 flex gap-4 border-t border-indigo-200 pt-3 text-[9px] text-indigo-900"><span className="flex items-center gap-1"><MapPin size={11} /> Maputo</span><span className="flex items-center gap-1"><Phone size={11} /> Contactar</span></div>
    </footer>
  );
}
