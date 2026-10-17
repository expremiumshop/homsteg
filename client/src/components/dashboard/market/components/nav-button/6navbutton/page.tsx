import { Home, MessageCircle, ShoppingCart, User } from "lucide-react";

const items = [Home, MessageCircle, ShoppingCart, User];

export default function NavButton6() {
  return (
    <nav className="flex items-center justify-around rounded-xl bg-slate-950 px-2 py-3 text-white">
      {items.map((Icon, index) => <span key={index} className={`relative rounded-lg p-2 ${index === 0 ? "bg-lime-400 text-slate-950" : "text-slate-300"}`}><Icon size={18} />{index === 0 && <i className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-lime-300" />}</span>)}
    </nav>
  );
}
