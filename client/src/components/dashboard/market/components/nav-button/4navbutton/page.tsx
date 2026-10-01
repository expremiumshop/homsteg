import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";

import { Link } from "wouter";

/* =========================================================
   MARKET — NAV BUTTON 4 (Preenchido)
   Variação do botão de navegação atual do tema Nova
   (BottomNavigation): mesma estrutura, tamanho e
   espaçamento — separadores com fundo preenchido
   (bg-primary) e ícone branco no item ativo. Sem
   dependências do tema.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Preenchido" na Personalização
   (stores.navButtonModel = "4").
   ========================================================= */

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

export default function NavButton4({
  navItems = demoNavItems,
  cartCount = 0,
}: {
  navItems?: NavItem[];
  cartCount?: number;
}) {
  const activeName = "Home";

  return (
    <nav
      className="
        relative
        z-[90]
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

          const active = item.name === activeName;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
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
                    ? "bg-primary text-white"
                    : "text-muted-foreground"
                }
              `}
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
                className="
                  text-[11px]
                  font-medium
                "
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
