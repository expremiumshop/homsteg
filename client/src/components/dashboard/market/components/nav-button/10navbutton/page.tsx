
import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";

const items = ["Home", "Mensagens", "Carrinho", "Conta"];
const icons = [Home, MessageCircle, ShoppingCart, User];

export default function NavButton10() {
  return (
    <nav
      className="flex items-stretch justify-around overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#F8FAF7] px-2 py-2 text-emerald-950 shadow-sm"
      aria-label="Navegação da loja"
    >
      {items.map((label, index) => {
        const Icon = icons[index];
        const active = index === 0;

        return (
          <span
            key={label}
            className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl px-1.5 py-2 transition-colors duration-200 ${
              active
                ? "bg-white text-emerald-900 shadow-[0_2px_10px_rgba(6,78,59,0.08)]"
                : "text-slate-500 hover:bg-white/70 hover:text-emerald-900"
            }`}
          >
            <span
              className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 ${
                active
                  ? "border-emerald-800 bg-emerald-800 text-white"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.7} />
            </span>

            <small
              className={`whitespace-nowrap text-[9px] leading-none tracking-wide ${
                active
                  ? "font-bold text-emerald-950"
                  : "font-medium text-slate-500"
              }`}
            >
              {label}
            </small>

            {active && (
              <span className="absolute bottom-0 h-[3px] w-6 rounded-t-full bg-emerald-700" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
