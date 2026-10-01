import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";

import { Link } from "wouter";

/* =========================================================
   MARKET — NAV BUTTON 2 (Pílula)
   Variação do botão de navegação atual do tema Nova
   (BottomNavigation): mesma estrutura, tamanho e
   espaçamento — barra em pílula com raios maiores
   (rounded-full), borda mais suave e itens com rótulos
   por baixo dos ícones. Sem dependências do tema.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Pílula" na Personalização
   (stores.navButtonModel = "2").
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

export default function NavButton2({
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
          rounded-full
          border
          border-gray-200
          bg-white
          shadow-[0_4px_20px_rgba(0,0,0,0.12)]
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          const active = item.name === activeName;

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
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
