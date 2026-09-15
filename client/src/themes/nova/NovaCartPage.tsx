import { Link } from "wouter";

import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import { useCart } from "@/contexts/CartContext";

export default function NovaCartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  } = useCart();

  /*
   * =====================================================
   * CARRINHO VAZIO
   * =====================================================
   */

  if (cart.length === 0) {
    return (
      <main
        className="
          flex
          min-h-screen
          min-w-0
          items-center
          justify-center
          overflow-x-hidden
          bg-gray-50
          p-6
        "
      >
        <div className="w-full min-w-0 max-w-md text-center">
          <div
            className="
              mx-auto
              mb-5
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-orange-50
            "
          >
            <ShoppingBag
              size={36}
              className="text-orange-500"
            />
          </div>

          <h1
            className="
              min-w-0
              max-w-full
              break-words
              text-2xl
              font-bold
              text-gray-900
              [overflow-wrap:anywhere]
            "
          >
            Seu carrinho está vazio
          </h1>

          <p
            className="
              mt-2
              min-w-0
              max-w-full
              break-words
              text-gray-500
              [overflow-wrap:anywhere]
            "
          >
            Adicione produtos para continuar.
          </p>

          <Link
            href="/themes/nova"
            className="
              mt-6
              inline-block
              rounded-xl
              bg-orange-500
              px-6
              py-3
              font-bold
              text-white
              transition
              hover:bg-orange-600
            "
          >
            Continuar comprando
          </Link>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * PÁGINA DO CARRINHO
   * =====================================================
   */

  return (
    <main
      className="
        min-h-screen
        min-w-0
        overflow-x-hidden
        bg-gray-50
        px-4
        py-6
        pb-24
        md:p-8
      "
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">

        {/* =================================================
            TÍTULO
        ================================================= */}

        <div className="mb-8 min-w-0">
          <Link
            href="/themes/nova"
            className="
              mb-4
              inline-block
              text-sm
              font-medium
              text-gray-500
              hover:text-orange-600
            "
          >
            ← Voltar à loja
          </Link>

          <h1
            className="
              min-w-0
              max-w-full
              break-words
              text-3xl
              font-bold
              text-gray-900
              [overflow-wrap:anywhere]
              md:text-4xl
            "
          >
            Carrinho de compras
          </h1>
        </div>

        {/* =================================================
            PRODUTOS
        ================================================= */}

        <div className="min-w-0 space-y-5">
          {cart.map((item) => {
            const imageSrc =
              item.image_url &&
              item.image_url.trim() !== ""
                ? item.image_url
                : "/placeholder.svg";

            return (
              <div
                key={item.id}
                className="
                  flex
                  min-w-0
                  flex-col
                  gap-4
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  sm:flex-row
                  sm:items-center
                  sm:gap-5
                "
              >
                {/* =================================================
                    IMAGEM
                ================================================= */}

                <div
                  className="
                    relative
                    h-[100px]
                    w-[100px]
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    bg-gray-100
                  "
                >
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                    "
                  />
                </div>

                {/* =================================================
                    INFORMAÇÕES
                ================================================= */}

                <div className="min-w-0 flex-1">
                  <h2
                    className="
                      min-w-0
                      max-w-full
                      break-words
                      text-lg
                      font-bold
                      text-gray-900
                      [overflow-wrap:anywhere]
                    "
                  >
                    {item.name}
                  </h2>

                  <p
                    className="
                      mt-1
                      min-w-0
                      break-words
                      font-bold
                      text-orange-600
                    "
                  >
                    {Number(item.price).toLocaleString(
                      "pt-MZ"
                    )}{" "}
                    MZN
                  </p>

                  {/* =================================================
                      VARIANTES
                  ================================================= */}

                  {item.variants &&
                    Object.keys(item.variants).length >
                      0 && (
                      <div
                        className="
                          mt-2
                          min-w-0
                          max-w-full
                          space-y-1
                          break-words
                          text-sm
                          text-gray-600
                          [overflow-wrap:anywhere]
                        "
                      >
                        {Object.entries(item.variants).map(
                          ([name, value]) => (
                            <div
                              key={name}
                              className="
                                min-w-0
                                max-w-full
                                break-words
                                [overflow-wrap:anywhere]
                              "
                            >
                              <strong>{name}:</strong>{" "}
                              {value}
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {/* =================================================
                      QUANTIDADE
                  ================================================= */}

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-gray-100
                        text-gray-700
                        transition
                        hover:bg-gray-200
                      "
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={16} />
                    </button>

                    <span
                      className="
                        min-w-[30px]
                        text-center
                        font-bold
                        text-gray-900
                      "
                    >
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-gray-100
                        text-gray-700
                        transition
                        hover:bg-gray-200
                      "
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* =================================================
                      REMOVER
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-1.5
                      text-sm
                      text-red-500
                      transition
                      hover:text-red-600
                    "
                  >
                    <Trash2 size={15} />
                    Remover
                  </button>
                </div>

                {/* =================================================
                    SUBTOTAL
                ================================================= */}

                <div
                  className="
                    min-w-0
                    shrink-0
                    sm:self-start
                  "
                >
                  <strong
                    className="
                      block
                      max-w-full
                      break-words
                      text-left
                      text-gray-900
                      sm:text-right
                    "
                  >
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toLocaleString("pt-MZ")}{" "}
                    MZN
                  </strong>
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            RESUMO
        ================================================= */}

        <div
          className="
            mt-8
            min-w-0
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <h2
            className="
              min-w-0
              break-words
              text-xl
              font-bold
              text-gray-900
            "
          >
            Resumo
          </h2>

          <div
            className="
              mt-4
              flex
              min-w-0
              items-center
              justify-between
              gap-4
            "
          >
            <span className="shrink-0 text-gray-600">
              Total:
            </span>

            <strong
              className="
                min-w-0
                break-words
                text-right
                text-xl
                text-gray-900
              "
            >
              {total.toLocaleString("pt-MZ")} MZN
            </strong>
          </div>

          {/* =================================================
              FINALIZAR
          ================================================= */}

          <Link
            href="/themes/nova/checkout"
            className="
              mt-6
              block
              min-w-0
              rounded-xl
              bg-orange-500
              p-4
              text-center
              font-bold
              text-white
              transition
              hover:bg-orange-600
            "
          >
            Finalizar compra
          </Link>

          {/* =================================================
              LIMPAR
          ================================================= */}

          <button
            type="button"
            onClick={clearCart}
            className="
              mt-4
              w-full
              min-w-0
              break-words
              text-red-500
              transition
              hover:text-red-600
            "
          >
            Limpar carrinho
          </button>
        </div>
      </div>
    </main>
  );
}