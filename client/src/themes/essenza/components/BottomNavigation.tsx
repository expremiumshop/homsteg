import {
  Home,
  MessageCircle,
  ShoppingBag,
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
  basePath = "/themes/essenza",
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
      icon: ShoppingBag,
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
    <nav className="fixed bottom-3 left-3 right-3 z-[90] border border-neutral-200 bg-white/95 backdrop-blur-md md:hidden">
      <div className="flex w-full items-center">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex min-h-[58px] flex-1 flex-col items-center justify-center gap-1 transition ${
                active
                  ? "text-neutral-950"
                  : "text-neutral-400"
              }`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={active ? 2 : 1.6}
                />

                {item.name === "Carrinho" &&
                  cartCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-950 px-1 text-[9px] font-semibold text-white">
                      {cartCount}
                    </span>
                  )}
              </div>

              <span className="text-[10px] font-medium">
                {item.name}
              </span>

              {active && (
                <span className="absolute bottom-1 left-1/2 h-px w-6 -translate-x-1/2 bg-neutral-950" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;
