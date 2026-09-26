import { useState } from "react";

import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import { useLocation } from "wouter";

import { useCart } from "@/contexts/CartContext";

import {
  chazucaColors,
  chazucaBodyFont,
} from "../theme";

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

  const [quantity, setQuantity] = useState(1);

  const [added, setAdded] = useState(false);

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

      alert(`Selecione: ${names}`);

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
        "Este produto está esgotado.",
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
        "Este produto está esgotado.",
      );

      return;
    }

    if (!validateVariants()) {
      return;
    }

    addToCart(getCartProduct());

    const checkoutPath = storeSlug
      ? `/themes/chazuca/checkout?storeSlug=${encodeURIComponent(storeSlug)}`
      : "/themes/chazuca/checkout";

    navigate(checkoutPath);
  }

  return (
    <div
      className="space-y-7"
      style={{
        fontFamily: chazucaBodyFont,
      }}
    >
      {/* QUANTIDADE */}

      <div>
        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{
            color: chazucaColors.text,
          }}
        >
          Quantidade
        </p>

        <div
          className="flex w-fit items-center rounded-full border"
          style={{
            borderColor:
              chazucaColors.border,
          }}
        >
          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= 1}
            aria-label="Diminuir quantidade"
            className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              color: chazucaColors.text,
            }}
          >
            <Minus size={15} />
          </button>

          <span
            className="flex h-11 min-w-[52px] items-center justify-center px-4 text-sm font-semibold"
            style={{
              color: chazucaColors.text,
            }}
          >
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
            className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              color: chazucaColors.text,
            }}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* BOTÕES */}

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={handleAddCart}
          disabled={stock <= 0}
          aria-label="Adicionar produto ao carrinho"
          className="flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full border py-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor:
              added
                ? "#15803d"
                : chazucaColors.primary,
            background: added
              ? "#f0fdf4"
              : "transparent",
            color: added
              ? "#15803d"
              : chazucaColors.primary,
          }}
        >
          {added ? (
            <>
              <Check size={16} />
              Adicionado
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              Adicionar ao carrinho
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={stock <= 0}
          aria-label="Comprar agora"
          className="w-full rounded-full py-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background:
              chazucaColors.accent,
            color:
              chazucaColors.accentContrast,
          }}
        >
          Comprar agora
        </button>
      </div>

      {/* GARANTIAS */}

      <p
        className="text-[11px] leading-5"
        style={{
          color: chazucaColors.textMuted,
        }}
      >
        Pagamento seguro · Troca em 7
        dias · Compra garantida
      </p>
    </div>
  );
}

export default ProductActions;
