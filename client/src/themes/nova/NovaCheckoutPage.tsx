import { useState } from "react";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  Trash2,
  Minus,
  Plus,
  MessageCircle,
} from "lucide-react";
import { Link, useSearch } from "wouter";

import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/lib/i18n-context";
import { trpc } from "@/lib/trpc";

import StoreI18nBoundary from "./StoreI18nBoundary";

/**
 * Rota /themes/nova/checkout — fica fora da árvore do
 * NovaStorefront, por isso o idioma/moeda da loja chegam
 * através do StoreI18nBoundary (mesma stores.bySlug do
 * conteúdo, com a mesma chave de cache no React Query).
 */
export default function NovaCheckoutPage() {
  const { cart } = useCart();
  const search = useSearch();
  const searchStoreSlug = new URLSearchParams(search)
    .get("storeSlug")
    ?.trim();
  const storeSlug =
    cart[0]?.storeSlug ??
    searchStoreSlug;

  return (
    <StoreI18nBoundary storeSlug={storeSlug}>
      <NovaCheckoutContent />
    </StoreI18nBoundary>
  );
}

function NovaCheckoutContent() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const { t, formatMoney } = useI18n();

  const search = useSearch();
  const searchStoreSlug = new URLSearchParams(search)
    .get("storeSlug")
    ?.trim();
  const storeSlug =
    cart[0]?.storeSlug ??
    searchStoreSlug;
  const storeQuery = trpc.stores.bySlug.useQuery(
    { slug: storeSlug ?? "" },
    { enabled: Boolean(storeSlug) },
  );
  const store = storeQuery.data?.store;

  // =====================================================
  // DADOS DO CLIENTE
  // =====================================================

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  // =====================================================
  // ENDEREÇOS
  // =====================================================

  const [address, setAddress] = useState("");
  const [avenueOrNeighborhood, setAvenueOrNeighborhood] =
    useState("");
  const [zoneOrReference, setZoneOrReference] =
    useState("");

  // =====================================================
  // PAGAMENTO
  // =====================================================

  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // TOTAL
  // =====================================================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) * Number(item.quantity),
    0
  );

  // =====================================================
  // DIMINUIR QUANTIDADE
  // =====================================================

  function decreaseQuantity(
    id: string,
    quantity: number
  ) {
    if (quantity <= 1) {
      removeFromCart(id);
      return;
    }

    updateQuantity(id, quantity - 1);
  }

  // =====================================================
  // AUMENTAR QUANTIDADE
  // =====================================================

  function increaseQuantity(
    id: string,
    quantity: number
  ) {
    updateQuantity(id, quantity + 1);
  }

  // =====================================================
  // TEXTO DAS VARIANTES
  // =====================================================

  function getVariantsText(
    variants?: Record<string, string>
  ) {
    if (!variants) {
      return "";
    }

    const entries = Object.entries(variants);

    if (entries.length === 0) {
      return "";
    }

    return entries
      .filter(
        ([, value]) =>
          value &&
          String(value).trim() !== ""
      )
      .map(
        ([name, value]) =>
          `${name}: ${value}`
      )
      .join("\n");
  }

  // =====================================================
  // ENVIAR PEDIDO PARA WHATSAPP
  // =====================================================

  async function sendOrderToWhatsApp() {
    if (!customerName.trim()) {
      alert(t("checkout.errName"));
      return;
    }

    if (!phone.trim()) {
      alert(t("checkout.errPhone"));
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      alert(t("checkout.errPhoneInvalid"));
      return;
    }

    if (!city.trim()) {
      alert(t("checkout.errCity"));
      return;
    }

    if (!address.trim()) {
      alert(t("checkout.errAddress"));
      return;
    }

    if (!payment) {
      alert(t("checkout.errPayment"));
      return;
    }

    if (cart.length === 0) {
      alert(t("checkout.errEmptyCart"));
      return;
    }

    const hasInvalidCartItem = cart.some((item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);

      return (
        !item.name.trim() ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(price) ||
        price < 0
      );
    });

    if (hasInvalidCartItem) {
      alert(t("checkout.errInvalidItem"));
      return;
    }

    const whatsappNumber = store?.whatsapp
      ?.replace(/\D/g, "");

    if (!store?.name || !whatsappNumber) {
      alert(t("checkout.errWhatsapp"));
      return;
    }

    setLoading(true);

    try {
      const productsText = cart
        .map((item, index) => {
          const price = Number(item.price);
          const quantity = Number(item.quantity);
          const subtotal = price * quantity;

          const variantsText = getVariantsText(
            item.variants
          );

          let productText =
            `${t("wa.product")} ${index + 1}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `${t("wa.name")}: ${item.name}\n` +
            `${t("wa.unitPrice")}: ${formatMoney(price)}\n` +
            `${t("wa.quantity")}: ${quantity}\n` +
            `${t("cart.subtotal")}: ${formatMoney(subtotal)}\n`;

          if (variantsText) {
            productText +=
              `\n${t("wa.chosenVariations")}\n` +
              `${variantsText}\n`;
          } else {
            productText +=
              `\n${t("wa.noVariations")}\n`;
          }

          return productText;
        })
        .join(
          "\n\n━━━━━━━━━━━━━━━━━━━━\n\n"
        );

      const message = `
*${t("wa.newOrder")} - ${store.name}*

━━━━━━━━━━━━━━━━━━━━

*${t("wa.customerData")}*

━━━━━━━━━━━━━━━━━━━━

${t("wa.name")}: ${customerName.trim()}

${t("wa.phone")}: ${phone.trim()}

${t("wa.email")}: ${
        email.trim() || t("wa.notInformed")
      }

━━━━━━━━━━━━━━━━━━━━

*${t("wa.deliveryData")}*

━━━━━━━━━━━━━━━━━━━━

${t("wa.city")}: ${city.trim()}

${t("checkout.address1")}:
${address.trim()}

${t("checkout.address2")}:
${
        avenueOrNeighborhood.trim() ||
        t("wa.notInformed")
      }

${t("checkout.address3")}:
${
        zoneOrReference.trim() ||
        t("wa.notInformed")
      }

━━━━━━━━━━━━━━━━━━━━

*${t("wa.products")}*

━━━━━━━━━━━━━━━━━━━━

${productsText}

━━━━━━━━━━━━━━━━━━━━

*${t("wa.orderSummary")}*

━━━━━━━━━━━━━━━━━━━━

${t("checkout.products")}: ${formatMoney(total)}

${t("wa.deliveryFree")}

*${t("checkout.total")}: ${formatMoney(total)}*

━━━━━━━━━━━━━━━━━━━━

*${t("wa.paymentMethod")}*

━━━━━━━━━━━━━━━━━━━━

${payment}

━━━━━━━━━━━━━━━━━━━━

*${t("wa.confirmation")}*

━━━━━━━━━━━━━━━━━━━━

${t("header.hello")}

${t("wa.confirmText")}

${t("wa.confirmRequest")}

${t("wa.thanks")}

━━━━━━━━━━━━━━━━━━━━

*${store.name}*

━━━━━━━━━━━━━━━━━━━━
      `.trim();

      const encodedMessage =
        encodeURIComponent(message);

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error(
        "Erro ao preparar pedido:",
        error
      );

      alert(t("checkout.errPrepare"));
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // CARRINHO VAZIO
  // =====================================================

  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen min-w-0 items-center justify-center bg-gray-50 p-6">
        <div className="w-full min-w-0 max-w-md text-center">
          <h1 className="break-words text-3xl font-bold">
            {t("checkout.empty")}
          </h1>

          <p className="mt-3 break-words text-gray-500">
            {t("checkout.emptyHint")}
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
              hover:bg-orange-600
            "
          >
            {t("checkout.backToStore")}
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // PÁGINA
  // =====================================================

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
        md:p-10
      "
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 min-w-0">
          <h1
            className="
              min-w-0
              max-w-full
              break-words
              [overflow-wrap:anywhere]
              text-3xl
              font-bold
              md:text-4xl
            "
          >
            {t("checkout.title")}
          </h1>

          <p
            className="
              mt-2
              min-w-0
              max-w-full
              break-words
              [overflow-wrap:anywhere]
              text-gray-500
            "
          >
            {t("checkout.subtitle")}
          </p>
        </div>

        <div className="grid min-w-0 gap-8 lg:grid-cols-3">

          {/* =================================================
              FORMULÁRIO
          ================================================= */}

          <section className="min-w-0 space-y-6 lg:col-span-2">

            {/* =================================================
                DADOS DE ENTREGA
            ================================================= */}

            <div
              className="
                min-w-0
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                md:p-6
              "
            >
              <h2
                className="
                  mb-5
                  flex
                  min-w-0
                  items-center
                  gap-2
                  break-words
                  text-xl
                  font-bold
                "
              >
                <MapPin
                  size={22}
                  className="shrink-0"
                />

                <span className="min-w-0 break-words">
                  {t("checkout.deliveryData")}
                </span>
              </h2>

              <div className="grid min-w-0 gap-4 md:grid-cols-2">

                <input
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                  placeholder={t("checkout.fullName")}
                  className="
                    min-w-0
                    max-w-full
                    rounded-xl
                    border
                    p-4
                    outline-none
                    focus:border-orange-500
                  "
                />

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  placeholder={t("checkout.phone")}
                  type="tel"
                  className="
                    min-w-0
                    max-w-full
                    rounded-xl
                    border
                    p-4
                    outline-none
                    focus:border-orange-500
                  "
                />

                <input
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder={t("checkout.email")}
                  type="email"
                  className="
                    min-w-0
                    max-w-full
                    rounded-xl
                    border
                    p-4
                    outline-none
                    focus:border-orange-500
                  "
                />

                <input
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                  placeholder={t("checkout.city")}
                  className="
                    min-w-0
                    max-w-full
                    rounded-xl
                    border
                    p-4
                    outline-none
                    focus:border-orange-500
                  "
                />
              </div>

              {/* ENDEREÇOS */}

              <div className="mt-4 min-w-0 space-y-4">

                {/* ENDEREÇO 1 */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {t("checkout.address1")}
                  </label>

                  <textarea
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value
                      )
                    }
                    placeholder={t("checkout.address1Placeholder")}
                    className="
                      block
                      h-24
                      w-full
                      min-w-0
                      max-w-full
                      resize-y
                      break-words
                      rounded-xl
                      border
                      p-4
                      outline-none
                      focus:border-orange-500
                    "
                  />

                  <p className="mt-1 break-words text-xs text-gray-500">
                    {t("checkout.address1Hint")}
                  </p>
                </div>

                {/* ENDEREÇO 2 */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {t("checkout.address2")}
                  </label>

                  <input
                    value={
                      avenueOrNeighborhood
                    }
                    onChange={(e) =>
                      setAvenueOrNeighborhood(
                        e.target.value
                      )
                    }
                    placeholder={t("checkout.address2Placeholder")}
                    className="
                      w-full
                      min-w-0
                      max-w-full
                      rounded-xl
                      border
                      p-4
                      outline-none
                      focus:border-orange-500
                    "
                  />
                </div>

                {/* ENDEREÇO 3 */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {t("checkout.address3")}
                  </label>

                  <input
                    value={zoneOrReference}
                    onChange={(e) =>
                      setZoneOrReference(
                        e.target.value
                      )
                    }
                    placeholder={t("checkout.address3Placeholder")}
                    className="
                      w-full
                      min-w-0
                      max-w-full
                      rounded-xl
                      border
                      p-4
                      outline-none
                      focus:border-orange-500
                    "
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                PAGAMENTO
            ================================================= */}

            <div
              className="
                min-w-0
                rounded-2xl
                bg-white
                p-5
                shadow-sm
                md:p-6
              "
            >
              <h2
                className="
                  mb-5
                  flex
                  min-w-0
                  items-center
                  gap-2
                  break-words
                  text-xl
                  font-bold
                "
              >
                <CreditCard
                  size={22}
                  className="shrink-0"
                />

                <span className="min-w-0 break-words">
                  {t("checkout.paymentMethod")}
                </span>
              </h2>

              <div className="min-w-0 space-y-3">

                {[
                  "M-Pesa",
                  "e-Mola",
                  t("checkout.bankCard"),
                  "PayPal",
                ].map((method) => (
                  <label
                    key={method}
                    className={`
                      flex
                      min-w-0
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-xl
                      border
                      p-4
                      ${
                        payment === method
                          ? "border-orange-500 bg-orange-50"
                          : ""
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={
                        payment === method
                      }
                      onChange={(e) =>
                        setPayment(
                          e.target.value
                        )
                      }
                    />

                    <span
                      className="
                        min-w-0
                        break-words
                        [overflow-wrap:anywhere]
                      "
                    >
                      {method}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* =================================================
              RESUMO
          ================================================= */}

          <aside
            className="
              h-fit
              min-w-0
              rounded-2xl
              bg-white
              p-5
              shadow-sm
              md:p-6
            "
          >
            <h2
              className="
                mb-5
                min-w-0
                break-words
                text-xl
                font-bold
              "
            >
              {t("checkout.orderSummary")}
            </h2>

            <div className="min-w-0 space-y-5">

              {cart.map((item) => {
                const subtotal =
                  Number(item.price) *
                  Number(item.quantity);

                const variantsText =
                  getVariantsText(
                    item.variants
                  );

                const imageSrc =
                  item.image_url &&
                  item.image_url.trim() !== ""
                    ? item.image_url
                    : "/placeholder-logo.png";

                return (
                  <div
                    key={item.id}
                    className="
                      min-w-0
                      border-b
                      pb-5
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        gap-3
                      "
                    >

                      {/* IMAGEM */}

                      <div
                        className="
                          relative
                          h-[75px]
                          w-[75px]
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          bg-gray-100
                        "
                      >
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      </div>

                      {/* PRODUTO */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <h3
                          className="
                            min-w-0
                            max-w-full
                            break-words
                            [overflow-wrap:anywhere]
                            font-semibold
                          "
                        >
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatMoney(Number(item.price))}
                        </p>

                        {/* VARIANTES */}

                        {variantsText && (
                          <div
                            className="
                              mt-2
                              min-w-0
                              max-w-full
                              break-words
                              [overflow-wrap:anywhere]
                              text-xs
                              text-gray-600
                            "
                          >
                            {Object.entries(
                              item.variants || {}
                            )
                              .filter(
                                ([, value]) =>
                                  value &&
                                  String(value).trim() !== ""
                              )
                              .map(
                                ([
                                  name,
                                  value,
                                ]) => (
                                  <div
                                    key={name}
                                    className="
                                      min-w-0
                                      max-w-full
                                      break-words
                                      [overflow-wrap:anywhere]
                                    "
                                  >
                                    <strong>
                                      {name}:
                                    </strong>{" "}
                                    {value}
                                  </div>
                                )
                              )}
                          </div>
                        )}

                        {/* QUANTIDADE */}

                        <div className="mt-3 flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.id,
                                item.quantity
                              )
                            }
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              border
                              hover:bg-gray-100
                            "
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-[25px] text-center font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.id,
                                item.quantity
                              )
                            }
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              border
                              hover:bg-gray-100
                            "
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>

                      {/* PREÇO / ELIMINAR */}

                      <div
                        className="
                          flex
                          min-w-0
                          shrink-0
                          flex-col
                          items-end
                          justify-between
                        "
                      >
                        <strong
                          className="
                            max-w-[100px]
                            break-words
                            text-right
                            text-sm
                          "
                        >
                          {formatMoney(subtotal)}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                          className="
                            rounded-lg
                            p-2
                            text-red-500
                            hover:bg-red-50
                          "
                          title={t("checkout.removeProduct")}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =================================================
                TOTAIS
            ================================================= */}

            <div className="mt-6 min-w-0 space-y-3 border-t pt-5">

              <div className="flex min-w-0 items-center justify-between gap-4">
                <span className="shrink-0">
                  {t("checkout.products")}
                </span>

                <strong
                  className="
                    min-w-0
                    break-words
                    text-right
                  "
                >
                  {formatMoney(total)}
                </strong>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-4">
                <span className="shrink-0">
                  {t("checkout.delivery")}
                </span>

                <strong className="shrink-0 text-green-600">
                  {t("checkout.free")}
                </strong>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-4 text-xl font-bold">
                <span className="shrink-0">
                  {t("checkout.total")}
                </span>

                <span
                  className="
                    min-w-0
                    break-words
                    text-right
                  "
                >
                  {formatMoney(total)}
                </span>
              </div>
            </div>

            {/* =================================================
                WHATSAPP
            ================================================= */}

            <button
              type="button"
              onClick={
                sendOrderToWhatsApp
              }
              disabled={loading}
              className="
                mt-6
                flex
                min-h-14
                w-full
                min-w-0
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-green-600
                px-4
                py-4
                text-center
                font-bold
                text-white
                transition
                hover:bg-green-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <MessageCircle
                size={22}
                className="shrink-0"
              />

              <span
                className="
                  min-w-0
                  break-words
                "
              >
                {loading
                  ? t("checkout.preparing")
                  : t("checkout.sendOrder")}
              </span>
            </button>

            <p
              className="
                mt-3
                min-w-0
                max-w-full
                break-words
                text-center
                text-xs
                text-gray-500
              "
            >
              {t("checkout.whatsappNote")}
            </p>

            {/* =================================================
                SEGURANÇA
            ================================================= */}

            <div
              className="
                mt-6
                min-w-0
                space-y-3
                border-t
                pt-5
                text-sm
                text-gray-600
              "
            >
              <p className="flex min-w-0 items-start gap-2">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span className="min-w-0 break-words">
                  {t("checkout.securePayment")}
                </span>
              </p>

              <p className="flex min-w-0 items-start gap-2">
                <Truck
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span className="min-w-0 break-words">
                  {t("checkout.trackedDelivery")}
                </span>
              </p>

              <p className="flex min-w-0 items-start gap-2">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span className="min-w-0 break-words">
                  {t("checkout.guarantee100")}
                </span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
