import { Instagram, Mail, MessageCircle } from "lucide-react";

export default function Footer9() {
  return (
    <footer className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div><strong className="text-[10px] text-slate-900">NOVA STORE</strong><p className="mt-1 text-[8px] text-slate-400">© 2026 · Todos os direitos reservados</p></div>
      <div className="flex gap-2 text-slate-500"><Instagram size={14} /><Mail size={14} /><MessageCircle size={14} /></div>
    </footer>
  );
}
