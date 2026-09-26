import { useState } from "react";

import {
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
} from "lucide-react";

import { useLocation } from "wouter";

import { useCart } from "@/contexts/CartContext";

type ProductActionsProps = {
  product: {
    id: number | string;
    name: string;
    price: number;
    image?: string | null;
    stock: number;
  };
  productOptions?: {
    name: string;
    values: string[];
  }[];
  selectedVariants?: Record<string, string>;
  storeSlug?: string;
};

export function ProductActions({
  product,
  productOptions = [],
  selectedVariants = {},
  storeSlug,
}: ProductActionsProps) {
  const [, navigate] = useLocation();

  const { addToCart } = useCart();

  const [quantity, setQuantity] =
    useState(1);

  const [added, setAdded] = useState(false);

  const [buying, setBuying] = useState(false);

  const stock = Number(
    product?.stock ?? 0,
  );

  function validateVariants() {
    if (productOptions.length === 0) {
      return true;
    }

    const missingVariants =
      productOptions
        .filter(
          (option) =>
            option.name &&
            option.values?.length > 0,
        )
        .filter(
          (option) =>
            !selectedVariants[
              option.name
            ]?.trim(),
        );

    if (missingVariants.length > 0) {
      const names = missingVariants
        .map((option) => option.name)
        .join(", ");

      alert(
        `Selecione as variantes: ${names}`,
      );

      return false;
    }

    return true;
  }

  function increase() {
    if (stock <= 0) {
      return;
    }

    setQuantity((current) => {
      if (current >= stock) {
        return current;
      }

      return current + 1;
    });
  }

  function decrease() {
    setQuantity((current) => {
      if (current <= 1) {
        return 1;
      }

      return current - 1;
    });
  }

  function getCartProduct() {
    return {
      id: String(product?.id ?? ""),
      name: product?.name ?? "",
      price: Number(product?.price ?? 0),
      image_url:
        product?.image || undefined,
      variants:
        productOptions.length > 0
          ? selectedVariants
          : undefined,
      quantity,
      storeSlug,
    };
  }

  function handleAddCart() {
    if (stock <= 0) {
      alert(
        "Este produto está sem stock.",
      );

      return;
    }

    if (!validateVariants()) {
      return;
    }

    addToCart(getCartProduct());

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  function handleBuyNow() {
    if (stock <= 0) {
      alert(
        "Este produto está sem stock.",
      );

      return;
    }

    if (!validateVariants()) {
      return;
    }

    setBuying(true);

    addToCart(getCartProduct());

    const checkoutPath = storeSlug
      ? `/themes/market/checkout?storeSlug=${encodeURIComponent(storeSlug)}`
      : "/themes/market/checkout";

    navigate(checkoutPath);
  }

  return (
    <div className="space-y-5">
      {/* QUANTIDADE */}

      <div>
        <p className="mb-3 text-sm font-bold text-slate-700">
          Quantidade
        </p>

        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= 1}
            aria-label="Diminuir quantidade"
            className="flex h-11 w-11 items-center justify-center transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus size={18} />
          </button>

          <span className="flex h-11 min-w-[55px] items-center justify-center border-x border-slate-200 px-4 text-sm font-black text-slate-900">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            disabled={
              stock <= 0 ||
              quantity >= stock
            }
            aria-label="Aumentar quantidade"
            className="flex h-11 w-11 items-center justify-center transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* BOTÕES */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddCart}
          disabled={stock <= 0}
          aria-label="Adicionar produto ao carrinho"
          className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 font-black transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${
            added
              ? "border-emerald-600 bg-emerald-50 text-emerald-700"
              : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {added ? (
            <>
              <Check
                size={20}
                className="animate-in zoom-in duration-200"
              />
              Adicionado
            </>
          ) : (
            <>
              <ShoppingCart size={20} />
              Adicionar ao carrinho
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={stock <= 0 || buying}
          aria-label="Comprar agora"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 font-black text-white transition-all duration-200 hover:bg-emerald-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Zap
            size={20}
            className={
              buying
                ? "animate-pulse"
                : ""
            }
          />
          {buying
            ? "A abrir..."
            : "Comprar agora"}
        </button>
      </div>

      {/* GARANTIAS */}

      <p className="text-xs text-slate-400">
        Pagamento seguro • Produto
        protegido • Compra garantida
      </p>
    </div>
  );
}

export default ProductActions;
