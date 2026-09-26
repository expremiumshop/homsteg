import {
  Home,
  MessageCircle,
  ShoppingBag,
  User,
} from "lucide-react";

import { Link, useLocation } from "wouter";

import { storeQuery } from "../demoData";

import {
  calizaColors,
  calizaBodyFont,
} from "../theme";

type BottomNavigationProps = {
  cartCount?: number;
  basePath?: string;
  storeSlug?: string;
};

export function BottomNavigation({
  cartCount = 0,
  basePath = "/themes/caliza",
  storeSlug,
}: BottomNavigationProps) {
  const [location] = useLocation();

  const ctx = storeQuery(storeSlug);

  const navItems = [
    {
      name: "Home",
      icon: Home,
      href: basePath,
    },
    {
      name: "Mensagens",
      icon: MessageCircle,
      href: `${basePath}/mensagens${ctx}`,
    },
    {
      name: "Carrinho",
      icon: ShoppingBag,
      href: `${basePath}/carrinho${ctx}`,
    },
    {
      name: "Conta",
      icon: User,
      href: `${basePath}/conta${ctx}`,
    },
  ];

  function isActive(path: string) {
    return location === path;
  }

  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-[90] md:hidden"
      style={{
        fontFamily: calizaBodyFont,
      }}
    >
      <div
        className="flex w-full items-center overflow-hidden rounded-2xl border shadow-lg backdrop-blur-md"
        style={{
          background:
            "rgba(255, 253, 249, 0.95)",
          borderColor:
            calizaColors.border,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          const active = isActive(
            item.href,
          );

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex min-h-[58px] flex-1 flex-col items-center justify-center gap-1 transition ${
                active
                  ? "text-stone-900"
                  : "text-stone-400"
              }`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={
                    active ? 2 : 1.6
                  }
                />

                {item.name ===
                  "Carrinho" &&
                  cartCount > 0 && (
                    <span
                      className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold"
                      style={{
                        background:
                          "#c2410c",
                        color:
                          "#fffdf9",
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
              </div>

              <span className="text-[10px] font-medium">
                {item.name}
              </span>

              {active && (
                <span
                  className="absolute bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full"
                  style={{
                    background:
                      "#c2410c",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;
