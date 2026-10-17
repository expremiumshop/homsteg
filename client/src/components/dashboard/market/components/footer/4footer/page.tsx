import { ArrowRight, Mail } from "lucide-react";

export default function Footer4() {
  return (
    <footer className="rounded-xl bg-amber-50 p-4">
      <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-200 text-amber-900"><Mail size={16} /></span><div className="flex-1"><strong className="block text-xs text-amber-950">Fala connosco</strong><small className="text-[10px] text-amber-800">Estamos aqui para ajudar.</small></div><ArrowRight size={16} className="text-amber-800" /></div>
      <div className="mt-3 border-t border-amber-200 pt-2 text-[9px] text-amber-700">© 2026 Nova Store · Apoio ao cliente</div>
    </footer>
  );
}
