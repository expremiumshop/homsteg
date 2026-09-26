import { useState } from "react";

import {
  CreditCard,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import { Link, useSearch } from "wouter";

import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";

import { formatPrice } from "./demoData";

export default function MarketCheckoutPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const search = useSearch();

  const searchStoreSlug =
    new URLSearchParams(search)
      .get("storeSlug")
      ?.trim();

  const storeSlug =
    cart[0]?.storeSlug ??
    searchStoreSlug;

  const storeQuery =
    trpc.stores.bySlug.useQuery(
      { slug: storeSlug ?? "" },
      { enabled: Boolean(storeSlug) },
    );

  const store =
    storeQuery.data?.store;

  const backToStorePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : "/themes/market";

  /* ============================================================
     DADOS DO CLIENTE
     ============================================================ */

  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [city, setCity] = useState("");

  /* ============================================================
     ENDEREÇOS
     ============================================================ */

  const [address, setAddress] =
    useState("");

  const [
    avenueOrNeighborhood,
    setAvenueOrNeighborhood,
  ] = useState("");

  const [
    zoneOrReference,
    setZoneOrReference,
  ] = useState("");

  /* ============================================================
     PAGAMENTO
     ============================================================ */

  const [payment, setPayment] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* ============================================================
     TOTAL
     ============================================================ */

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0,
  );

  function decreaseQuantity(
    id: string,
    quantity: number,
  ) {
    if (quantity <= 1) {
      removeFromCart(id);

      return;
    }

    updateQuantity(id, quantity - 1);
  }

  function increaseQuantity(
    id: string,
    quantity: number,
  ) {
    updateQuantity(id, quantity + 1);
  }

  function getVariantsText(
    variants?: Record<string, string>,
  ) {
    if (!variants) {
      return "";
    }

    const entries =
      Object.entries(variants);

    if (entries.length === 0) {
      return "";
    }

    return entries
      .filter(
        ([, value]) =>
          value &&
          String(value).trim() !== "",
      )
      .map(
        ([name, value]) =>
          `${name}: ${value}`,
      )
      .join("\n");
  }

  /* ============================================================
     ENVIAR PEDIDO PARA WHATSAPP
     ============================================================ */

  async function sendOrderToWhatsApp() {
    if (!customerName.trim()) {
      alert("Digite o seu nome completo.");

      return;
    }

    if (!phone.trim()) {
      alert("Digite o seu telefone.");

      return;
    }

    const phoneDigits = phone.replace(
      /\D/g,
      "",
    );

    if (
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      alert("Digite um telefone válido.");

      return;
    }

    if (!city.trim()) {
      alert("Digite a sua cidade.");

      return;
    }

    if (!address.trim()) {
      alert(
        "Digite o endereço completo e o distrito.",
      );

      return;
    }

    if (!payment) {
      alert(
        "Selecione o método de pagamento.",
      );

      return;
    }

    if (cart.length === 0) {
      alert("O carrinho está vazio.");

      return;
    }

    const hasInvalidCartItem = cart.some(
      (item) => {
        const quantity = Number(
          item.quantity,
        );

        const price = Number(item.price);

        return (
          !item.name.trim() ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          !Number.isFinite(price) ||
          price < 0
        );
      },
    );

    if (hasInvalidCartItem) {
      alert(
        "Existe um produto inválido no carrinho. Atualize a página e tente novamente.",
      );

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
          const price = Number(
            item.price,
          );

          const quantity = Number(
            item.quantity,
          );

          const subtotal =
            price * quantity;

          const variantsText =
            getVariantsText(
              item.variants,
            );

          let productText =
            `PRODUTO ${index + 1}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `Nome: ${item.name}\n` +
            `Preço unitário: ${price.toLocaleString("pt-MZ")} MT\n` +
            `Quantidade: ${quantity}\n` +
            `Subtotal: ${subtotal.toLocaleString("pt-MZ")} MT\n`;

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
          "\n\n━━━━━━━━━━━━━━━━━━━━\n\n",
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
${zoneOrReference.trim() || "Não informado"}

━━━━━━━━━━━━━━━━━━━━

*PRODUTOS*

━━━━━━━━━━━━━━━━━━━━

${productsText}

━━━━━━━━━━━━━━━━━━━━

*RESUMO DO PEDIDO*

━━━━━━━━━━━━━━━━━━━━

Produtos: ${total.toLocaleString("pt-MZ")} MT

Entrega: Grátis

*TOTAL: ${total.toLocaleString("pt-MZ")} MT*

━━━━━━━━━━━━━━━━━━━━

*MÉTODO DE PAGAMENTO*

━━━━━━━━━━━━━━━━━━━━

${payment}

━━━━━━━━━━━━  ━━━━━━━━━━━━

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
        encodeURIComponent(
          message,
        );

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      console.error(
        "Erro ao preparar pedido:",
        error,
      );

      alert(
        "Não foi possível preparar o pedido. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ============================================================
     CARRINHO VAZIO
     ============================================================ */

  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen min-w-0 items-center justify-center bg-slate-50 p-6">
        <div className="w-full min-w-0 max-w-md text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50">
            <ShoppingBag className="h-9 w-9 text-emerald-600" />
          </div>

          <h1 className="break-words text-3xl font-black tracking-tight text-slate-950">
            Carrinho vazio
          </h1>

          <p className="mt-3 break-words text-slate-500">
            Adicione produtos ao carrinho
            antes de finalizar a compra.
          </p>

          <Link
            href={backToStorePath}
            className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-black text-white transition hover:bg-emerald-700"
          >
            Voltar para loja
          </Link>
        </div>
      </main>
    );
  }

  /* ============================================================
     PÁGINA
     ============================================================ */

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 px-4 py-6 pb-24 md:p-10">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        {/* CABEÇALHO */}

        <div className="mb-8 min-w-0">
          <Link
            href={backToStorePath}
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-emerald-600"
          >
            ← Voltar à loja
          </Link>

          <h1 className="min-w-0 max-w-full break-words text-3xl font-black tracking-tight text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
            Finalizar compra
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Preencha os seus dados e envie
            o pedido pelo WhatsApp.
          </p>
        </div>

        <div className="grid min-w-0 gap-8 lg:grid-cols-3">
          {/* FORMULÁRIO */}

          <section className="min-w-0 space-y-6 lg:col-span-2">
            {/* DADOS DE ENTREGA */}

            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-5 flex min-w-0 items-center gap-2 break-words text-xl font-black tracking-tight text-slate-950">
                <MapPin
                  size={22}
                  className="shrink-0 text-emerald-600"
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
                      e.target.value,
                    )
                  }
                  placeholder="Nome completo *"
                  className="min-w-0 max-w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-emerald-600"
                />

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Telefone *"
                  type="tel"
                  className="min-w-0 max-w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-emerald-600"
                />

                <input
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Email (opcional)"
                  type="email"
                  className="min-w-0 max-w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-emerald-600"
                />

                <input
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="Cidade *"
                  className="min-w-0 max-w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-emerald-600"
                />
              </div>

              {/* ENDEREÇOS */}

              <div className="mt-4 min-w-0 space-y-4">
                {/* ENDEREÇO 1 */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Endereço 1
                  </label>

                  <textarea
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value,
                      )
                    }
                    placeholder="Endereço completo / Distrito *"
                    className="block h-24 w-full min-w-0 max-w-full resize-y rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-emerald-600"
                  />

                  <p className="mt-1 break-words text-xs text-slate-400">
                    Informe o endereço completo
                    e o distrito.
                  </p>
                </div>

                {/* ENDEREÇO 2 */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Endereço 2
                  </label>

                  <input
                    value={
                      avenueOrNeighborhood
                    }
                    onChange={(e) =>
                      setAvenueOrNeighborhood(
                        e.target.value,
                      )
                    }
                    placeholder="Avenida ou Bairro"
                    className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-emerald-600"
                  />
                </div>

                {/* ENDEREÇO 3 */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Endereço 3
                  </label>

                  <input
                    value={zoneOrReference}
                    onChange={(e) =>
                      setZoneOrReference(
                        e.target.value,
                      )
                    }
                    placeholder="Zona, Quarteirão, perto de X, Empresa X, Banca X..."
                    className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* PAGAMENTO */}

            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-5 flex min-w-0 items-center gap-2 break-words text-xl font-black tracking-tight text-slate-950">
                <CreditCard
                  size={22}
                  className="shrink-0 text-emerald-600"
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
                    className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      payment === method
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="market-payment"
                      value={method}
                      checked={
                        payment === method
                      }
                      onChange={(e) =>
                        setPayment(
                          e.target.value,
                        )
                      }
                    />

                    <span className="min-w-0 break-words text-sm font-semibold text-slate-800">
                      {method}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* SEGURANÇA */}

            <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-600" />
                Pagamento seguro
              </span>

              <span className="flex items-center gap-1.5">
                <Truck size={15} className="text-emerald-600" />
                Entrega rastreada
              </span>
            </div>
          </section>

          {/* RESUMO */}

          <aside className="h-fit min-w-0 rounded-2xl border border-slate-200 bg-white p-5 md:p-6 lg:sticky lg:top-24">
            <h2 className="mb-5 min-w-0 break-words text-xl font-black tracking-tight text-slate-950">
              Resumo do pedido
            </h2>

            <div className="min-w-0 space-y-5">
              {cart.map((item) => {
                const subtotal =
                  Number(item.price) *
                  Number(item.quantity);

                const variantsText =
                  getVariantsText(
                    item.variants,
                  );

                const imageSrc =
                  item.image_url &&
                  item.image_url.trim() !==
                    ""
                    ? item.image_url
                    : "/placeholder.svg";

                return (
                  <div
                    key={item.id}
                    className="min-w-0 border-b border-slate-100 pb-5"
                  >
                    <div className="flex min-w-0 gap-3">
                      {/* IMAGEM */}

                      <div className="relative h-[75px] w-[75px] shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* PRODUTO */}

                      <div className="min-w-0 flex-1">
                        <h3 className="min-w-0 max-w-full break-words text-sm font-black text-slate-950 [overflow-wrap:anywhere]">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatPrice(
                            Number(
                              item.price,
                            ),
                          )}
                        </p>

                        {/* VARIANTES */}

                        {variantsText && (
                          <div className="mt-2 min-w-0 max-w-full break-words text-xs text-slate-500">
                            {Object.entries(
                              item.variants ||
                                {},
                            )
                              .filter(
                                ([, value]) =>
                                  value &&
                                  String(
                                    value,
                                  ).trim() !==
                                    "",
                              )
                              .map(
                                (
                                  [
                                    name,
                                    value,
                                  ],
                                ) => (
                                  <div
                                    key={name}
                                    className="min-w-0 max-w-full break-words [overflow-wrap:anywhere]"
                                  >
                                    <strong className="font-bold text-slate-700">
                                      {name}:
                                    </strong>{" "}
                                    {value}
                                  </div>
                                ),
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
                                item.quantity,
                              )
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-50"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="min-w-[25px] text-center text-sm font-black">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.id,
                                item.quantity,
                              )
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-50"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* PREÇO / ELIMINAR */}

                      <div className="flex min-w-0 shrink-0 flex-col items-end justify-between">
                        <strong className="max-w-[100px] break-words text-right text-sm font-black text-slate-950">
                          {formatPrice(
                            subtotal,
                          )}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id,
                            )
                          }
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                          title="Eliminar produto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TOTAIS */}

            <div className="mt-6 min-w-0 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex min-w-0 items-center justify-between gap-4 text-sm">
                <span className="shrink-0 text-slate-500">
                  Produtos
                </span>

                <strong className="min-w-0 break-words text-right font-black text-slate-950">
                  {formatPrice(total)}
                </strong>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-4 text-sm">
                <span className="shrink-0 text-slate-500">
                  Entrega
                </span>

                <strong className="shrink-0 font-black text-emerald-600">
                  Grátis
                </strong>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-4 text-xl font-black text-slate-950">
                <span className="shrink-0">
                  Total
                </span>

                <span className="min-w-0 break-words text-right">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* WHATSAPP */}

            <button
              type="button"
              onClick={
                sendOrderToWhatsApp
              }
              disabled={loading}
              className="mt-6 flex min-h-14 w-full min-w-0 items-center justify-center gap-3 rounded-xl bg-[#25D366] px-4 py-4 text-center font-black text-white transition hover:bg-[#1fb857] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle
                size={22}
                className="shrink-0"
              />

              <span className="min-w-0 break-words">
                {loading
                  ? "A preparar pedido..."
                  : "Enviar o pedido pelo WhatsApp"}
              </span>
            </button>

            <p className="mt-3 min-w-0 max-w-full break-words text-center text-xs text-slate-400">
              O WhatsApp será aberto com
              todos os dados do pedido
              preenchidos automaticamente.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
