import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";

import { Link, useLocation } from "wouter";

import {
  normalizeNavButtonModel,
  type NavButtonModel,
} from "../navButtonModels";

import { BottomNavigation as ClassicNavigation } from "./BottomNavigation";

interface ModelNavProps {
  cartCount?: number;
  whatsappNumber?: string;
  basePath?: string;
  storeSlug?: string;
  model?: string | null;
}

/**
 * Botão de navegação do tema Nova com suporte aos
 * 5 modelos escolhíveis na Personalização da loja
 * (secção Botões de Navegação):
 *
 * 1 — Clássico (estilo atual, inalterado);
 * 2 — Pílula: barra em pílula compacta;
 * 3 — Ícones: apenas ícones, sem rótulos;
 * 4 — Preenchido: separador ativo com fundo preenchido;
 * 5 — Elevado: item ativo elevado com disco e sombra.
 *
 * O modelo 1 delega no BottomNavigation original,
 * garantindo que o estilo atual da loja permanece
 * intacto.
 */
export function ModelBottomNavigation({
  cartCount = 0,
  whatsappNumber = "",
  basePath = "/themes/nova",
  storeSlug,
  model,
}: ModelNavProps) {
  const navModel: NavButtonModel =
    normalizeNavButtonModel(model);

  /* =========================================================
     MODELO 1 — CLÁSSICO (estilo atual, intacto)
     ========================================================= */

  if (navModel === "1") {
    return (
      <ClassicNavigation
        cartCount={cartCount}
        whatsappNumber={whatsappNumber}
        basePath={basePath}
        storeSlug={storeSlug}
      />
    );
  }

  return (
    <ModelNavVariants
      cartCount={cartCount}
      basePath={basePath}
      storeSlug={storeSlug}
      navModel={navModel}
    />
  );
}

/**
 * Variantes 2–5: partilham os mesmos itens e a mesma
 * navegação do modelo clássico; apenas a apresentação
 * visual muda.
 */
function ModelNavVariants({
  cartCount,
  basePath,
  storeSlug,
  navModel,
}: {
  cartCount: number;
  basePath: string;
  storeSlug?: string;
  navModel: Exclude<NavButtonModel, "1">;
}) {
  const [location] = useLocation();

  /*
   * "Home" deve levar sempre à homepage da loja atual:
   * em loja real usa /store/:slug (rota interna); basePath
   * (/themes/nova) fica apenas para os previews de tema.
   * (Mesma lógica do BottomNavigation clássico.)
   */
  const homePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : basePath;
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

  /* Estilo da barra por modelo (o resto é igual ao clássico). */
  const barClassName =
    navModel === "2"
      ? `
        flex
        w-full
        items-center
        overflow-hidden
        rounded-full
        border
        border-gray-200
        bg-white
        shadow-[0_4px_20px_rgba(0,0,0,0.12)]
      `
      : `
        flex
        w-full
        items-center
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-[0_4px_20px_rgba(0,0,0,0.12)]
      `;

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
      <div className={barClassName}>
        {navItems.map((item) => {
          const Icon = item.icon;

          const active = isActive(item.href);

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
                ${
                  navModel === "3"
                    ? ""
                    : "gap-1"
                }
                transition-all
                ${
                  navModel === "4" && active
                    ? "bg-primary text-white"
                    : active
                      ? "text-primary"
                      : "text-muted-foreground"
                }
              `}
            >
              {/* ÍCONE (com badge do carrinho) */}

              <div
                className={`
                  relative
                  transition-transform
                  ${
                    navModel === "5" && active
                      ? "-translate-y-1 scale-110"
                      : active
                        ? "scale-110"
                        : "scale-100"
                  }
                `}
              >
                {navModel === "5" ? (
                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      transition-all
                      ${
                        active
                          ? "bg-primary shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                          : "bg-transparent"
                      }
                    `}
                  >
                    <Icon
                      size={23}
                      className={
                        active
                          ? "text-white"
                          : undefined
                      }
                    />
                  </div>
                ) : (
                  <Icon size={23} />
                )}

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

              {/* RÓTULO (modelos 2 e 4; modelo 5 em destaque) */}

              {navModel !== "3" && (
                <span
                  className={`
                    text-[11px]
                    ${
                      navModel === "5" && active
                        ? "font-bold text-primary"
                        : "font-medium"
                    }
                    ${
                      navModel === "4" && active
                        ? "text-white"
                        : active
                          ? "text-primary"
                          : "text-muted-foreground"
                    }
                  `}
                >
                  {item.name}
                </span>
              )}

              {/* INDICADORES POR MODELO */}

              {navModel === "3" && active && (
                <div
                  className="
                    mt-1
                    h-1
                    w-1
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

export default ModelBottomNavigation;
