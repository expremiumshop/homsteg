import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";

import { Link, useLocation } from "wouter";

interface BottomNavigationProps {
  cartCount?: number;
  whatsappNumber?: string;
  basePath?: string;
  storeSlug?: string;
}

export function BottomNavigation({
  cartCount = 0,
  whatsappNumber = "",
  basePath = "/themes/nova",
  storeSlug,
}: BottomNavigationProps) {
  const [location] = useLocation();

  const homePath = basePath;
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";
  const messagesPath = `${basePath}/mensagens${storeContext}`;
  const cartPath = `${basePath}/carrinho${storeContext}`;
  const accountPath = `${basePath}/conta${storeContext}`;

  const navItems = [
    {
      name: "Home",
      icon: Home,
      href: homePath,
    },
    {
      name: "Mensagens",
      icon: MessageCircle,
      href: messagesPath,
    },
    {
      name: "Carrinho",
      icon: ShoppingCart,
      href: cartPath,
    },
    {
      name: "Conta",
      icon: User,
      href: accountPath,
    },
  ];

  function isActive(path: string) {
    if (path === homePath) {
      return location === homePath;
    }

    return location === path;
  }

  return (
    <nav
      className="
        fixed
        bottom-3
        left-3
        right-3
        z-[90]
        md:hidden
      "
    >
      <div
        className="
          flex
          w-full
          items-center
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-[0_4px_20px_rgba(0,0,0,0.12)]
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          const active = isActive(item.href);

          const className = `
            relative
            flex
            min-h-[62px]
            flex-1
            flex-col
            items-center
            justify-center
            gap-1
            transition-all
            ${
              active
                ? "text-primary"
                : "text-muted-foreground"
            }
          `;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={className}
            >
              <div
                className={`
                  relative
                  transition-transform
                  ${
                    active
                      ? "scale-110"
                      : "scale-100"
                  }
                `}
              >
                <Icon size={23} />

                {item.name === "Carrinho" &&
                  cartCount > 0 && (
                    <span
                      className="
                        absolute
                        -right-2
                        -top-2
                        flex
                        h-5
                        min-w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-primary
                        px-1
                        text-[10px]
                        font-bold
                        text-white
                      "
                    >
                      {cartCount}
                    </span>
                  )}
              </div>

              <span
                className={`
                  text-[11px]
                  font-medium
                  ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                `}
              >
                {item.name}
              </span>

              {active && (
                <div
                  className="
                    absolute
                    bottom-1
                    left-1/2
                    h-0.5
                    w-8
                    -translate-x-1/2
                    rounded-full
                    bg-primary
                  "
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
