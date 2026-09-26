import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { storeQuery } from "../lib";

interface KitBottomNavigationProps {
  cartCount?: number;
  basePath?: string;
  storeSlug?: string;
}

/**
 * Navegação inferior fixa (mobile) — mesma funcionalidade da Nova.
 */
export function KitBottomNavigation({
  cartCount = 0,
  basePath = "/store",
  storeSlug,
}: KitBottomNavigationProps) {
  const [location] = useLocation();

  const ctx = storeQuery(storeSlug);
  const homePath = basePath;

  const items = [
    { name: "Home", icon: Home, href: homePath },
    {
      name: "Mensagens",
      icon: MessageCircle,
      href: `${basePath}/mensagens${ctx}`,
    },
    {
      name: "Carrinho",
      icon: ShoppingCart,
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
    <nav className="fixed bottom-3 left-3 right-3 z-[90] md:hidden">
      <div
        className="flex w-full items-center overflow-hidden border shadow-lg"
        style={{
          background: "var(--tk-surface)",
          borderColor: "var(--tk-border)",
          borderRadius: "var(--tk-card-radius)",
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex min-h-[60px] flex-1 flex-col items-center justify-center gap-1"
              style={{ color: active ? "var(--tk-primary)" : "var(--tk-muted)" }}
            >
              <div className="relative">
                <Icon size={22} />
                {item.name === "Carrinho" && cartCount > 0 && (
                  <span
                    className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                    style={{
                      background: "var(--tk-primary)",
                      color: "var(--tk-primary-contrast)",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium">{item.name}</span>
              {active && (
                <div
                  className="absolute bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2"
                  style={{ background: "var(--tk-primary)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default KitBottomNavigation;
