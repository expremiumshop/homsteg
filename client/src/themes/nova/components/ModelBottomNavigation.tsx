import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react";

import { Link, useLocation } from "wouter";

import { useI18n } from "@/lib/i18n-context";

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

  const { t } = useI18n();

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

  /*
   * `id` é estável e `name` é o rótulo já traduzido: o badge do
   * carrinho e as keys do React usam `id`, para continuarem a
   * funcionar com a loja em qualquer idioma.
   */
  const navItems = [
    {
      id: "home",
      name: t("nav.home"),
      icon: Home,
      href: homePath,
    },
    {
      id: "messages",
      name: t("nav.messages"),
      icon: MessageCircle,
      href: messagesPath,
    },
    {
      id: "cart",
      name: t("nav.cart"),
      icon: ShoppingCart,
      href: cartPath,
    },
    {
      id: "account",
      name: t("nav.account"),
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
      : navModel === "6"
        ? "flex w-full items-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-lg"
        : navModel === "7"
          ? "flex w-full items-center gap-1 rounded-2xl bg-slate-50 p-1"
          : navModel === "8"
            ? "flex w-full items-center overflow-hidden border-t-2 border-sky-500 bg-white shadow-sm"
            : navModel === "10"
              ? "flex w-full items-center overflow-hidden rounded-xl bg-emerald-800"
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
              key={item.id}
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
                    : navModel === "6"
                      ? active
                        ? "text-lime-300"
                        : "text-slate-300"
                      : navModel === "7"
                        ? active
                          ? "rounded-full bg-white text-indigo-700 shadow-sm"
                          : "text-slate-400"
                        : navModel === "9" && active
                          ? "rounded-xl bg-violet-600 text-white shadow-md"
                          : navModel === "10"
                            ? active
                              ? "rounded-lg bg-emerald-700 text-white"
                              : "text-emerald-100"
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

                {item.id === "cart" &&
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
                        : navModel === "6"
                          ? active
                            ? "text-lime-300"
                            : "text-slate-300"
                          : navModel === "9" && active
                            ? "text-white"
                            : navModel === "10"
                              ? active
                                ? "text-white"
                                : "text-emerald-100"
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

              {navModel === "8" && active && (
                <div className="absolute top-0 h-0.5 w-7 rounded-full bg-sky-500" />
              )}

            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default ModelBottomNavigation;
