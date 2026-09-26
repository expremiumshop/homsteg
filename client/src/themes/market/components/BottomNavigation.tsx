import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";

import { Link, useLocation } from "wouter";

type BottomNavigationProps = {
  cartCount?: number;
  basePath?: string;
  storeSlug?: string;
};

export function BottomNavigation({
  cartCount = 0,
  basePath = "/themes/market",
  storeSlug,
}: BottomNavigationProps) {
  const [location] = useLocation();

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  const navItems = [
    {
      name: "Home",
      icon: Home,
      href: basePath,
    },
    {
      name: "Mensagens",
      icon: MessageCircle,
      href: `${basePath}/mensagens${storeContext}`,
    },
    {
      name: "Carrinho",
      icon: ShoppingCart,
      href: `${basePath}/carrinho${storeContext}`,
    },
    {
      name: "Conta",
      icon: User,
      href: `${basePath}/conta${storeContext}`,
    },
  ];

  function isActive(path: string) {
    if (path === basePath) {
      return location === basePath;
    }

    return location === path;
  }

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-[90] md:hidden">
      <div className="flex w-full items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex min-h-[60px] flex-1 flex-col items-center justify-center gap-1 transition-all ${
                active
                  ? "text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              <div
                className={`relative transition-transform ${
                  active
                    ? "scale-110"
                    : "scale-100"
                }`}
              >
                <Icon size={22} />

                {item.name === "Carrinho" &&
                  cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black text-white">
                      {cartCount}
                    </span>
                  )}
              </div>

              <span className="text-[11px] font-semibold">
                {item.name}
              </span>

              {active && (
                <div className="absolute bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-emerald-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;
