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

export default function NavButton2({
  navItems = demoNavItems,
  cartCount = 0,
}: {
  navItems?: NavItem[];
  cartCount?: number;
}) {
  const activeName = "Home";

  return (
    <nav className="relative z-[90] w-full px-4 py-5">
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-2xl
          overflow-hidden
          rounded-[26px]
          border
          border-foreground/[0.08]
          bg-background
          px-4
          py-3
          shadow-[0_12px_45px_rgba(0,0,0,0.08)]
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[10%]
            right-[10%]
            top-[37px]
            h-px
            bg-foreground/[0.10]
          "
        />

        <div className="relative flex items-start justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.name === activeName;
            const isCart = item.name === "Carrinho";

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="
                  group
                  relative
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  items-center
                  outline-none
                "
              >
                <span
                  className={`
                    relative
                    z-10
                    flex
                    h-[50px]
                    w-[50px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    transition-all
                    duration-500
                    ease-out
                    group-active:scale-90
                    ${
                      active
                        ? "border-foreground bg-foreground text-background shadow-[0_8px_25px_rgba(0,0,0,0.18)]"
                        : "border-foreground/[0.10] bg-background text-muted-foreground group-hover:-translate-y-1 group-hover:border-foreground/25 group-hover:text-foreground group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
                    }
                  `}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        -inset-1.5
                        rounded-full
                        border
                        border-foreground/10
                      "
                    />
                  )}

                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.9}
                    className="
                      relative
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                  />

                  {isCart && cartCount > 0 && (
                    <span
                      className="
                        absolute
                        -right-1
                        -top-1
                        flex
                        h-[19px]
                        min-w-[19px]
                        items-center
                        justify-center
                        rounded-full
                        border-2
                        border-background
                        bg-primary
                        px-1
                        text-[9px]
                        font-bold
                        leading-none
                        text-primary-foreground
                      "
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </span>

                <span
                  className={`
                    mt-2.5
                    max-w-full
                    truncate
                    px-1
                    text-[10px]
                    font-semibold
                    tracking-[0.01em]
                    transition-colors
                    duration-300
                    ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }
                  `}
                >
                  {item.name}
                </span>

                <span
                  className={`
                    mt-2
                    h-1
                    rounded-full
                    transition-all
                    duration-500
                    ${
                      active
                        ? "w-7 bg-foreground"
                        : "w-1 bg-foreground/10 group-hover:w-3"
                    }
                  `}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}