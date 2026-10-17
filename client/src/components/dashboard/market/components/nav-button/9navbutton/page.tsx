
import {
  House,
  LayoutGrid,
  ShoppingCart,
  UserRound,
  Store,
} from "lucide-react";

type NavPage = "inicio" | "categorias" | "carrinho" | "conta";

type NavButton9Props = {
  active?: NavPage;
  cartCount?: number;
  logoUrl?: string;
  storeName?: string;
  onNavigate?: (page: NavPage) => void;
  className?: string;
};

const items = [
  { id: "inicio", label: "Início", Icon: House },
  { id: "categorias", label: "Categorias", Icon: LayoutGrid },
  { id: "carrinho", label: "Carrinho", Icon: ShoppingCart },
  { id: "conta", label: "Conta", Icon: UserRound },
] as const;

export default function NavButton9({
  active = "inicio",
  cartCount = 0,
  logoUrl,
  storeName = "Loja",
  onNavigate,
  className = "",
}: NavButton9Props) {
  const renderItem = (item: (typeof items)[number]) => {
    const isActive = active === item.id;
    const Icon = item.Icon;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onNavigate?.(item.id)}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
        className={`relative flex min-w-0 flex-1 flex-col
          items-center justify-center gap-1 py-2
          transition-colors ${
            isActive
              ? "text-[#E43225]"
              : "text-[#666666] hover:text-[#E43225]"
          }`}
      >
        <span className="relative">
          <Icon size={23} strokeWidth={isActive ? 2.4 : 1.8} />

          {item.id === "carrinho" && cartCount > 0 && (
            <span
              className="absolute -right-3 -top-2 flex h-4
                min-w-4 items-center justify-center rounded-full
                bg-[#F5222D] px-1 text-[10px] font-bold text-white"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </span>

        <span className="truncate text-[10px] font-medium sm:text-xs">
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <nav
      aria-label={`Navegação da loja ${storeName}`}
      className={`relative z-10 w-full border-t border-gray-200
        bg-white pb-[env(safe-area-inset-bottom)]
        shadow-[0_-3px_16px_rgba(0,0,0,0.06)] ${className}`}
    >
      <div className="relative mx-auto flex h-[62px] w-full
        max-w-lg items-center justify-around px-1">
        {renderItem(items[0])}
        {renderItem(items[1])}

        {/* Botão central da loja */}
        <button
          type="button"
          onClick={() => onNavigate?.("inicio")}
          aria-label={`Página inicial de ${storeName}`}
          className="relative -mt-6 flex h-[58px] w-[58px]
            shrink-0 items-center justify-center overflow-hidden
            rounded-full border-4 border-white
            bg-gradient-to-br from-[#FF5A00] to-[#F5222D]
            text-white shadow-[0_3px_12px_rgba(245,34,45,0.25)]
            transition-transform active:scale-95"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={storeName}
              className="h-full w-full object-contain"
            />
          ) : (
            <Store size={25} strokeWidth={2} />
          )}
        </button>

        {renderItem(items[2])}
        {renderItem(items[3])}
      </div>
    </nav>
  );
}
