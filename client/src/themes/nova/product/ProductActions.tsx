import { useState } from "react";
import { ShoppingCart, Zap, Minus, Plus, Check } from "lucide-react";
import { useLocation } from "wouter";

import { useCart } from "@/contexts/CartContext";

interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

interface ProductActionsProps {
  product: any;
  productOptions?: ProductOption[];
  selectedVariants?: Record<string, string>;
  storeSlug?: string;
}

export default function ProductActions({
  product,
  productOptions = [],
  selectedVariants = {},
  storeSlug,
}: ProductActionsProps) {
  const [, navigate] = useLocation();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  const stock = Number(product?.stock ?? 0);

  // =====================================================
  // VERIFICAR VARIANTES OBRIGATÓRIAS
  // =====================================================

  function validateVariants() {
    if (productOptions.length === 0) {
      return true;
    }

    const missingVariants = productOptions
      .filter(
        (option) =>
          option.name &&
          option.values?.length > 0
      )
      .filter(
        (option) =>
          !selectedVariants[option.name]?.trim()
      );

    if (missingVariants.length > 0) {
      const names = missingVariants
        .map((option) => option.name)
        .join(", ");

      alert(`Selecione as variantes: ${names}`);

      return false;
    }

    return true;
  }

  // =====================================================
  // AUMENTAR QUANTIDADE
  // =====================================================

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

  // =====================================================
  // DIMINUIR QUANTIDADE
  // =====================================================

  function decrease() {
    setQuantity((current) => {
      if (current <= 1) {
        return 1;
      }

      return current - 1;
    });
  }

  // =====================================================
  // PRODUTO PARA O CARRINHO
  // =====================================================

  function getCartProduct() {
    return {
      id: String(product?.id ?? ""),
      name: product?.name ?? "",
      price: Number(product?.price ?? 0),
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

  // =====================================================
  // ADICIONAR AO CARRINHO
  // =====================================================

  function handleAddCart() {
    if (stock <= 0) {
      alert("Este produto está sem stock.");
      return;
    }

    if (!validateVariants()) {
      return;
    }

    const cartProduct = getCartProduct();

    addToCart(cartProduct);

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  // =====================================================
  // COMPRAR AGORA
  // =====================================================

  function handleBuyNow() {
    if (stock <= 0) {
      alert("Este produto está sem stock.");
      return;
    }

    if (!validateVariants()) {
      return;
    }

    const cartProduct = getCartProduct();

    setBuying(true);

    addToCart(cartProduct);

    navigate("/themes/nova/checkout");
  }

  return (
    <div className="space-y-5">
      {/* =====================================================
          QUANTIDADE
          ===================================================== */}

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-700">
          Quantidade
        </p>

        <div className="flex w-fit items-center overflow-hidden rounded-lg border bg-white">
          {/* DIMINUIR */}

          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= 1}
            aria-label="Diminuir quantidade"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              transition
              hover:bg-gray-100
              active:scale-90
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Minus size={18} />
          </button>

          {/* QUANTIDADE */}

          <span
            className="
              flex
              h-11
              min-w-[55px]
              items-center
              justify-center
              border-x
              px-4
              font-semibold
            "
          >
            {quantity}
          </span>

          {/* AUMENTAR */}

          <button
            type="button"
            onClick={increase}
            disabled={
              stock <= 0 ||
              quantity >= stock
            }
            aria-label="Aumentar quantidade"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              transition
              hover:bg-gray-100
              active:scale-90
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* =====================================================
          BOTÕES
          ===================================================== */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* ADICIONAR AO CARRINHO */}

        <button
          type="button"
          onClick={handleAddCart}
          disabled={stock <= 0}
          aria-label="Adicionar produto ao carrinho"
          className={`
            flex
            h-14
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border-2
            font-bold
            transition-all
            duration-200
            active:scale-[0.97]
            disabled:cursor-not-allowed
            disabled:opacity-60
            ${
              added
                ? "border-green-500 bg-green-50 text-green-600"
                : "border-orange-500 text-orange-600 hover:bg-orange-50"
            }
          `}
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

        {/* COMPRAR AGORA */}

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={stock <= 0 || buying}
          aria-label="Comprar agora"
          className="
            flex
            h-14
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-orange-500
            font-bold
            text-white
            transition-all
            duration-200
            hover:bg-orange-600
            active:scale-[0.97]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
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

      {/* =====================================================
          GARANTIAS
          ===================================================== */}

      <p className="text-xs text-gray-500">
        Pagamento seguro • Produto protegido • Compra garantida
      </p>
    </div>
  );
}
