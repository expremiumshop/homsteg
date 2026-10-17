import { Home, MessageCircle, ShoppingCart, User } from "lucide-react";

const items = ["Início", "Mensagens", "Carrinho", "Conta"];
const icons = [Home, MessageCircle, ShoppingCart, User];

export default function NavButton8() {
  return (
    <nav className="flex items-center justify-around border-t-2 border-sky-500 bg-white py-3">
      {items.map((label, index) => { const Icon = icons[index]; return <span key={label} className={`flex flex-col items-center gap-1 ${index === 0 ? "text-sky-700" : "text-slate-400"}`}><Icon size={16} /><small className="text-[9px]">{label}</small></span>; })}
    </nav>
  );
}
