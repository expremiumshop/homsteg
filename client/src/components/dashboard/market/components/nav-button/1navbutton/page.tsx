import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";

import { Link } from "wouter";

type NavItem = {
  name: string;
  icon: typeof Home;
  href: string;
};

const demoNavItems: NavItem[] = [
  {
    name: "Home",
    icon: Home,
    href: "/themes/nova",
  },
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
  {
    name: "Conta",
    icon: User,
    href: "/themes/nova/conta",
  },
];

export default function NavButton1({
  navItems = demoNavItems,
  cartCount = 0,
}: {
  navItems?: NavItem[];
  cartCount?: number;
}) {
  const activeName = "Home";

  return (
    <nav className="relative z-[90] w-full px-2 py-3">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-xl
          items-center
          gap-1.5
          rounded-[22px]
          border
          border-black/[0.07]
          bg-white/95
          p-1.5
          shadow-[0_10px_35px_rgba(0,0,0,0.10)]
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-white/80
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.name === activeName;
          const isCart = item.name === "Carrinho";

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`
                group
                relative
                flex
                min-h-[54px]
                flex-1
                items-center
                justify-center
                rounded-[17px]
                px-2
                transition-all
                duration-300
                ease-out
                active:scale-[0.96]
                ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_5px_18px_rgba(0,0,0,0.14)]"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }
              `}
            >
              <span
                className={`
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    active
                      ? "bg-white/15"
                      : "bg-transparent group-hover:bg-background"
                  }
                `}
              >
                <Icon
                  size={21}
                  strokeWidth={active ? 2.4 : 2}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

                {isCart && cartCount > 0 && (
                  <span
                    className={`
                      absolute
                      -right-1.5
                      -top-1.5
                      flex
                      min-h-[18px]
                      min-w-[18px]
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      px-1
                      text-[9px]
                      font-bold
                      leading-none
                      shadow-sm
                      ${
                        active
                          ? "border-primary bg-white text-primary"
                          : "border-white bg-primary text-primary-foreground"
                      }
                    `}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>

              <span
                className={`
                  ml-1.5
                  hidden
                  text-xs
                  font-semibold
                  tracking-[-0.01em]
                  sm:inline
                  ${
                    active
                      ? "opacity-100"
                      : "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  }
                `}
              >
                {item.name}
              </span>

              {active && (
                <span
                  className="
                    absolute
                    bottom-1
                    left-1/2
                    h-1
                    w-1
                    -translate-x-1/2
                    rounded-full
                    bg-white/90
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