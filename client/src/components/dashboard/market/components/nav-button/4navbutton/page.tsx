
import {
  Home,
  MessageCircle,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "wouter";

type NavItem = {
  name: string;
  icon: typeof Home;
  href: string;
};

const defaultNavItems: NavItem[] = [
  { name: "Início", icon: Home, href: "/themes/nova" },
  {
    name: "Mensagens",
    icon: MessageCircle,
    href: "/themes/nova/mensagens",
  },
  {
    name: "Carrinho",
    icon: ShoppingCart,
    href: "/themes/nova/carrinho",
  },
  { name: "Conta", icon: UserRound, href: "/themes/nova/conta" },
];

type NavButton4Props = {
  navItems?: NavItem[];
  cartCount?: number;
};

export default function NavButton4({
  navItems = defaultNavItems,
  cartCount = 0,
}: NavButton4Props) {
  const [location] = useLocation();

  const isActive = (href: string) =>
    location === href ||
    (href !== "/themes/nova" && location.startsWith(`${href}/`));

  const getCount = (name: string) =>
    name === "Carrinho" && cartCount > 0
      ? cartCount > 99
        ? "99+"
        : cartCount
      : null;

  return (
    <nav
      aria-label="Navegação da loja"
      className="relative z-10 w-full bg-[#111111] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex min-h-[76px] w-full max-w-lg items-center justify-around gap-1 px-3 py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const count = getCount(item.name);
          const isMessages = item.name === "Mensagens";

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name}
              aria-current={active ? "page" : undefined}
              className={`group relative flex min-w-0 flex-1 flex-col items-center justify-center transition-all duration-300 ease-out ${
                active ? "-translate-y-1" : "translate-y-0"
              }`}
            >
              {index === 0 ? (
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 ${
                    active
                      ? "rotate-0 bg-[#E9FF70] text-[#111111] shadow-[0_0_20px_rgba(233,255,112,0.18)]"
                      : "-rotate-6 bg-white/[0.08] text-white/70 group-hover:rotate-0 group-hover:bg-white/[0.14]"
                  }`}
                >
                  <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                </span>
              ) : index === 1 ? (
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                    active
                      ? "scale-110 border-[#E9FF70] bg-[#E9FF70]/10 text-[#E9FF70]"
                      : "border-white/15 text-white/65 group-hover:border-white/40 group-hover:text-white"
                  }`}
                >
                  <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
                  {isMessages && (
                    <span
                      className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#FF6B57] ring-2 ring-[#111111]"
                      aria-hidden="true"
                    />
                  )}
                </span>
              ) : index === 2 ? (
                <span
                  className={`relative flex h-11 w-12 items-center justify-center rounded-[14px] transition-all duration-300 ${
                    active
                      ? "bg-[#FF765F] text-[#111111] shadow-[0_5px_16px_rgba(255,118,95,0.2)]"
                      : "bg-white/[0.08] text-white/70 group-hover:bg-white/[0.15]"
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 1.8}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  {count !== null && (
                    <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-[#111111] bg-[#E9FF70] px-1 text-[9px] font-bold text-[#111111]">
                      {count}
                    </span>
                  )}
                </span>
              ) : (
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-[17px] transition-all duration-300 ${
                    active
                      ? "rounded-full bg-white text-[#111111]"
                      : "border border-white/15 text-white/65 group-hover:rounded-full group-hover:border-white/40 group-hover:text-white"
                  }`}
                >
                  <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
                </span>
              )}

              <span
                className={`mt-1.5 max-w-full truncate px-1 text-[10px] transition-colors duration-200 ${
                  active
                    ? "font-semibold text-[#E9FF70]"
                    : "font-medium text-white/55 group-hover:text-white/90"
                }`}
              >
                {item.name}
              </span>

              {active && (
                <span className="mt-1 h-[3px] w-4 animate-pulse rounded-full bg-[#E9FF70]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
