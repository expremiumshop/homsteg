import { Home, MessageCircle, ShoppingCart, User } from "lucide-react";

const items = [Home, MessageCircle, ShoppingCart, User];

export default function NavButton7() {
  return (
    <nav className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-2">
      {items.map((Icon, index) => <span key={index} className={`flex h-10 flex-1 items-center justify-center rounded-full ${index === 0 ? "bg-white text-indigo-700 shadow-sm" : "text-slate-400"}`}><Icon size={17} /></span>)}
    </nav>
  );
}
