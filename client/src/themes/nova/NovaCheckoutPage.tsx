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
import { trpc } from "@/lib/trpc";

export default function NovaCheckoutPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
  } = useCart();
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
      alert("Digite o seu nome completo.");
      return;
    }

    if (!phone.trim()) {
      alert("Digite o seu telefone.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      alert("Digite um telefone válido.");
      return;
    }

    if (!city.trim()) {
      alert("Digite a sua cidade.");
      return;
    }

    if (!address.trim()) {
      alert(
        "Digite o endereço completo e o distrito."
      );
      return;
    }

    if (!payment) {
      alert(
        "Selecione o método de pagamento."
      );
      return;
    }

    if (cart.length === 0) {
      alert("O carrinho está vazio.");
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
      alert("Existe um produto inválido no carrinho. Atualize a página e tente novamente.");
      return;
    }

    const whatsappNumber = store?.whatsapp
      ?.replace(/\D/g, "");

    if (!store?.name || !whatsappNumber) {
      alert(
        "O WhatsApp desta loja ainda não está configurado. Tente novamente mais tarde.",
      );
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
            `PRODUTO ${index + 1}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `Nome: ${item.name}\n` +
            `Preço unitário: ${price.toLocaleString(
              "pt-MZ"
            )} MT\n` +
            `Quantidade: ${quantity}\n` +
            `Subtotal: ${subtotal.toLocaleString(
              "pt-MZ"
            )} MT\n`;

          if (variantsText) {
            productText +=
              `\nVARIAÇÕES ESCOLHIDAS\n` +
              `${variantsText}\n`;
          } else {
            productText +=
              `\nVariações: Nenhuma\n`;
          }

          return productText;
        })
        .join(
          "\n\n━━━━━━━━━━━━━━━━━━━━\n\n"
        );

      const message = `
*NOVO PEDIDO - ${store.name}*

━━━━━━━━━━━━━━━━━━━━

*DADOS DO CLIENTE*

━━━━━━━━━━━━━━━━━━━━

Nome: ${customerName.trim()}

Telefone: ${phone.trim()}

Email: ${
        email.trim() || "Não informado"
      }

━━━━━━━━━━━━━━━━━━━━

*DADOS DE ENTREGA*

━━━━━━━━━━━━━━━━━━━━

Cidade: ${city.trim()}

Endereço 1:
${address.trim()}

Endereço 2:
${
        avenueOrNeighborhood.trim() ||
        "Não informado"
      }

Endereço 3:
${
        zoneOrReference.trim() ||
        "Não informado"
      }

━━━━━━━━━━━━━━━━━━━━

*PRODUTOS*

━━━━━━━━━━━━━━━━━━━━

${productsText}

━━━━━━━━━━━━━━━━━━━━

*RESUMO DO PEDIDO*

━━━━━━━━━━━━━━━━━━━━

Produtos: ${total.toLocaleString(
        "pt-MZ"
      )} MT

Entrega: Grátis

*TOTAL: ${total.toLocaleString(
        "pt-MZ"
      )} MT*

━━━━━━━━━━━━━━━━━━━━

*MÉTODO DE PAGAMENTO*

━━━━━━━━━━━━━━━━━━━━

${payment}

━━━━━━━━━━━━━━━━━━━━

*CONFIRMAÇÃO*

━━━━━━━━━━━━━━━━━━━━

Olá!

Gostaria de confirmar este pedido.

Por favor, confirme a disponibilidade dos produtos e envie as instruções para o pagamento.

Obrigado pela atenção!

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

      alert(
        "Não foi possível preparar o pedido. Tente novamente."
      );
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
            Carrinho vazio
          </h1>

          <p className="mt-3 break-words text-gray-500">
            Adicione produtos ao carrinho
            antes de finalizar a compra.
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
            Voltar para loja
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
            Finalizar compra
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
            Preencha os seus dados e envie
            o pedido pelo WhatsApp.
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
                  Dados de entrega
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
                  placeholder="Nome completo *"
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
                  placeholder="Telefone *"
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
                  placeholder="Email (opcional)"
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
                  placeholder="Cidade *"
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
                    Endereço 1
                  </label>

                  <textarea
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value
                      )
                    }
                    placeholder="Endereço completo / Distrito *"
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
                    Informe o endereço completo
                    e o distrito.
                  </p>
                </div>

                {/* ENDEREÇO 2 */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Endereço 2
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
                    placeholder="Avenida ou Bairro"
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
                    Endereço 3
                  </label>

                  <input
                    value={zoneOrReference}
                    onChange={(e) =>
                      setZoneOrReference(
                        e.target.value
                      )
                    }
                    placeholder="Zona, Quarteirão, perto de X, Empresa X, Banca X..."
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
                  Método de pagamento
                </span>
              </h2>

              <div className="min-w-0 space-y-3">

                {[
                  "M-Pesa",
                  "e-Mola",
                  "Cartão bancário",
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
              Resumo do pedido
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
                          {Number(
                            item.price
                          ).toLocaleString(
                            "pt-MZ"
                          )}{" "}
                          MT
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
                          {subtotal.toLocaleString(
                            "pt-MZ"
                          )}{" "}
                          MT
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
                          title="Eliminar produto"
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
                  Produtos
                </span>

                <strong
                  className="
                    min-w-0
                    break-words
                    text-right
                  "
                >
                  {total.toLocaleString(
                    "pt-MZ"
                  )}{" "}
                  MT
                </strong>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-4">
                <span className="shrink-0">
                  Entrega
                </span>

                <strong className="shrink-0 text-green-600">
                  Grátis
                </strong>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-4 text-xl font-bold">
                <span className="shrink-0">
                  Total
                </span>

                <span
                  className="
                    min-w-0
                    break-words
                    text-right
                  "
                >
                  {total.toLocaleString(
                    "pt-MZ"
                  )}{" "}
                  MT
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
                  ? "A preparar pedido..."
                  : "Enviar o pedido/WhatsApp"}
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
              O WhatsApp será aberto com
              todos os dados do pedido
              preenchidos automaticamente.
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
                  Pagamento seguro
                </span>
              </p>

              <p className="flex min-w-0 items-start gap-2">
                <Truck
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span className="min-w-0 break-words">
                  Entrega rastreada
                </span>
              </p>

              <p className="flex min-w-0 items-start gap-2">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span className="min-w-0 break-words">
                  Garantia 100%
                </span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
