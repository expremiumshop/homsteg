import { Heart, Instagram } from "lucide-react";

export default function Footer7() {
  return (
    <footer className="rounded-xl border border-rose-100 bg-white px-5 py-5 text-center">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Heart size={16} /></div>
      <strong className="mt-2 block font-serif text-sm text-slate-900">Obrigado pela visita</strong>
      <p className="mt-1 text-[10px] text-slate-500">Compra local, escolha com carinho.</p>
      <div className="mt-3 flex justify-center gap-3 text-rose-600"><Instagram size={14} /><span className="text-[9px]">@novastore</span></div>
    </footer>
  );
}
