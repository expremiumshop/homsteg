import { Link, useSearch } from "wouter";

import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/lib/i18n-context";

import StoreI18nBoundary from "./StoreI18nBoundary";

/**
 * Rota /themes/nova/carrinho — montada fora da árvore do
 * NovaStorefront, por isso o i18n da loja é injetado aqui
 * (StoreI18nBoundary) antes de qualquer texto ser renderizado.
 */
export default function NovaCartPage() {
  const { cart } = useCart();

  /*
   * O storeSlug vem dos itens do carrinho (adicionados na
   * loja) ou da URL (?storeSlug=...) — é ele que diz ao
   * boundary qual o idioma/moeda desta loja.
   */
  const search = useSearch();
  const searchStoreSlug = new URLSearchParams(search)
    .get("storeSlug")
    ?.trim();

  const storeSlug =
    cart[0]?.storeSlug ?? searchStoreSlug;

  return (
    <StoreI18nBoundary storeSlug={storeSlug}>
      <NovaCartContent />
    </StoreI18nBoundary>
  );
}

function NovaCartContent() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  } = useCart();

  const { t, formatMoney } = useI18n();

  /*
   * O cliente volta sempre para a loja real de onde veio.
   */
  const search = useSearch();
  const searchStoreSlug = new URLSearchParams(search)
    .get("storeSlug")
    ?.trim();
  const storeSlug =
    cart[0]?.storeSlug ?? searchStoreSlug;
  const backToStorePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : "/themes/nova";

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
            {t("cart.empty")}
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
            {t("cart.emptyHint")}
          </p>

          <Link
            href={backToStorePath}
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
            {t("cart.continueShopping")}
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
            href={backToStorePath}
            className="
              mb-4
              inline-block
              text-sm
              font-medium
              text-gray-500
              hover:text-orange-600
            "
          >
            {t("cart.backToStore")}
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
            {t("cart.title")}
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
                    {formatMoney(Number(item.price))}
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
                      aria-label={t("cart.decrease")}
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
                      aria-label={t("cart.increase")}
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
                    {t("cart.remove")}
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
                    {formatMoney(
                      Number(item.price) *
                        Number(item.quantity)
                    )}
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
            {t("cart.summary")}
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
              {t("cart.total")}
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
              {formatMoney(total)}
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
            {t("cart.checkout")}
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
            {t("cart.clear")}
          </button>
        </div>
      </div>
    </main>
  );
}