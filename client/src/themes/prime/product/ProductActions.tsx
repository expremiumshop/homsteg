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

type PrimeProductOption = {
  id: string;
  name: string;
  values: string[];
};

type ProductActionsProps = {
  product: {
    id: string | number;
    name?: string | null;
    price?: number | null;
    stock?: number | null;
    image?: string | null;
    image_url?: string | null;
  };
  productOptions?: PrimeProductOption[];
  selectedVariants?: Record<string, string>;
  storeSlug?: string;
};

export function ProductActions({
  product,
  productOptions = [],
  selectedVariants = {},
  storeSlug,
}: ProductActionsProps) {
  const [, navigate] =
    useLocation();

  const { addToCart } = useCart();

  const [quantity, setQuantity] =
    useState(1);
  const [added, setAdded] =
    useState(false);

  const stock = Number(
    product?.stock ?? 10,
  );

  function validateVariants() {
    if (
      productOptions.length === 0
    ) {
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

    if (
      missingVariants.length > 0
    ) {
      const names =
        missingVariants
          .map(
            (option) => option.name,
          )
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
      price: Number(
        product?.price ?? 0,
      ),
      image_url:
        product?.image_url ||
        product?.image ||
        undefined,
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

    addToCart(getCartProduct());

    navigate(
      "/themes/prime/checkout",
    );
  }

  return (
    <div className="space-y-5">
      {/* QUANTIDADE */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
        <span className="text-sm font-bold text-slate-900">
          Quantidade
        </span>

        <div className="flex items-center rounded-xl bg-white shadow-sm">
          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= 1}
            aria-label="Diminuir quantidade"
            className="flex h-10 w-10 items-center justify-center disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="w-10 text-center text-sm font-bold">
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
            className="flex h-10 w-10 items-center justify-center disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
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
          className={`flex h-13 items-center justify-center gap-2 rounded-2xl border-2 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
            added
              ? "border-emerald-500 bg-emerald-50 text-emerald-600"
              : "border-slate-950 text-slate-950 hover:bg-slate-50"
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              Adicionado
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Adicionar ao carrinho
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={stock <= 0}
          aria-label="Comprar agora"
          className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-orange-500 text-sm font-black text-white transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          Comprar agora
        </button>
      </div>

      <p className="text-[11px] text-slate-400">
        Compra segura • Produto verificado •
        Entrega rápida
      </p>
    </div>
  );
}

export default ProductActions;
