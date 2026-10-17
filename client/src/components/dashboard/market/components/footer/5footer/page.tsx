import { Instagram } from "lucide-react";

export default function Footer5() {
  return (
    <footer className="rounded-xl border border-stone-200 bg-[#faf8f4] p-5 text-stone-800">
      <div className="flex items-start justify-between"><div><p className="font-serif text-base font-bold">NOVA ATELIER</p><p className="mt-1 text-[10px] text-stone-500">Objetos escolhidos com intenção.</p></div><Instagram size={17} /></div>
      <div className="mt-4 flex gap-4 border-t border-stone-200 pt-3 text-[9px] uppercase tracking-wider text-stone-500"><span>Sobre</span><span>Contacto</span><span>Privacidade</span></div>
    </footer>
  );
}
