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

export default function NavButton3({
  navItems = demoNavItems,
  cartCount = 0,
}: {
  navItems?: NavItem[];
  cartCount?: number;
}) {
  const activeName = "Home";

  return (
    <nav className="relative z-[90] w-full px-4 py-4">
      <div
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-md
          items-center
          justify-center
          gap-2
          rounded-[32px]
          border
          border-foreground/[0.07]
          bg-background/95
          px-3
          py-3
          shadow-[0_16px_45px_rgba(0,0,0,0.10)]
          backdrop-blur-xl
        "
      >
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-3
            left-1/2
            h-px
            w-[72%]
            -translate-x-1/2
            bg-foreground/[0.08]
          "
        />

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.name === activeName;
          const isCart = item.name === "Carrinho";

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name}
              aria-current={active ? "page" : undefined}
              className="
                group
                relative
                flex
                h-[58px]
                flex-1
                items-center
                justify-center
                outline-none
              "
            >
              {/* Halo do item ativo */}
              {active && (
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-12
                    w-12
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-foreground/[0.06]
                    blur-[1px]
                  "
                />
              )}

              {/* Ícone */}
              <span
                className={`
                  relative
                  z-10
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  duration-300
                  ease-out
                  group-active:scale-90
                  ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:-translate-y-1 group-hover:text-foreground"
                  }
                `}
              >
                <Icon
                  size={active ? 23 : 21}
                  strokeWidth={active ? 2.5 : 1.8}
                  className="transition-all duration-300"
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
                      shadow-sm
                    "
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>

              {/* Ponto de apoio */}
              <span
                aria-hidden="true"
                className={`
                  absolute
                  bottom-0
                  left-1/2
                  -translate-x-1/2
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    active
                      ? "h-1.5 w-7 bg-foreground"
                      : "h-1 w-1 bg-foreground/15 group-hover:h-1.5 group-hover:w-3 group-hover:bg-foreground/30"
                  }
                `}
              />

              {/* Pequeno reflexo no hover */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-1
                  rounded-[22px]
                  bg-foreground/[0.03]
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}