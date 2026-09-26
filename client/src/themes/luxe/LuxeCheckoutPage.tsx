import { useState } from "react";

import {
  CreditCard,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react";

import { Link, useSearch } from "wouter";

import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";

import { formatPrice } from "./demoData";

export default function LuxeCheckoutPage() {
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
      {
        slug: storeSlug ?? "",
      },
      {
        enabled:
          Boolean(storeSlug),
      },
    );

  const store =
    storeQuery.data?.store;

  /* DADOS DO CLIENTE */
  const [customerName, setCustomerName] =
    useState("");
  const [phone, setPhone] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [city, setCity] =
    useState("");

  /* ENDEREÇOS */
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

  /* PAGAMENTO */
  const [payment, setPayment] =
    useState("M-Pesa");
  const [loading, setLoading] =
    useState(false);

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

    updateQuantity(
      id,
      quantity - 1,
    );
  }

  function increaseQuantity(
    id: string,
    quantity: number,
  ) {
    updateQuantity(
      id,
      quantity + 1,
    );
  }

  function getVariantsText(
    variants?: Record<
      string,
      string
    >,
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

  /* ENVIAR PEDIDO PARA WHATSAPP */
  async function sendOrderToWhatsApp() {
    if (!customerName.trim()) {
      alert(
        "Digite o seu nome completo.",
      );

      return;
    }

    if (!phone.trim()) {
      alert("Digite o seu telefone.");

      return;
    }

    const phoneDigits =
      phone.replace(/\D/g, "");

    if (
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      alert(
        "Digite um telefone válido.",
      );

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
      alert(
        "O carrinho está vazio.",
      );

      return;
    }

    const hasInvalidCartItem =
      cart.some((item) => {
        const quantity = Number(
          item.quantity,
        );
        const price = Number(
          item.price,
        );

        return (
          !item.name.trim() ||
          !Number.isInteger(
            quantity,
          ) ||
          quantity < 1 ||
          !Number.isFinite(price) ||
          price < 0
        );
      });

    if (hasInvalidCartItem) {
      alert(
        "Existe um produto inválido no carrinho. Atualize a página e tente novamente.",
      );

      return;
    }

    const whatsappNumber =
      store?.whatsapp?.replace(
        /\D/g,
        "",
      );

    if (
      !store?.name ||
      !whatsappNumber
    ) {
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
          const quantity =
            Number(item.quantity);
          const subtotalItem =
            price * quantity;

          const variantsText =
            getVariantsText(
              item.variants,
            );

          let productText =
            `PRODUTO ${index + 1}\n` +
            `———————————————\n\n` +
            `Nome: ${item.name}\n` +
            `Preço unitário: ${price.toLocaleString("pt-MZ")} MT\n` +
            `Quantidade: ${quantity}\n` +
            `Subtotal: ${subtotalItem.toLocaleString("pt-MZ")} MT\n`;

          if (variantsText) {
            productText +=
              `\nVARIAÇÕES ESCOLHIDAS\n${variantsText}\n`;
          } else {
            productText +=
              `\nVariações: Nenhuma\n`;
          }

          return productText;
        })
        .join(
          "\n\n———————————————\n\n",
        );

      const message =
        `*NOVO PEDIDO - ${store.name}*\n\n` +
        `DADOS DO CLIENTE\n\n` +
        `Nome: ${customerName.trim()}\n` +
        `Telefone: ${phone.trim()}\n` +
        `Email: ${email.trim() || "Não informado"}\n\n` +
        `DADOS DE ENTREGA\n\n` +
        `Cidade: ${city.trim()}\n` +
        `Endereço 1: ${address.trim()}\n` +
        `Endereço 2: ${avenueOrNeighborhood.trim() || "Não informado"}\n` +
        `Endereço 3: ${zoneOrReference.trim() || "Não informado"}\n\n` +
        `PRODUTOS\n\n${productsText}\n\n` +
        `RESUMO DO PEDIDO\n\n` +
        `Produtos: ${total.toLocaleString("pt-MZ")} MT\n` +
        `Entrega: Grátis\n\n` +
        `*TOTAL: ${total.toLocaleString("pt-MZ")} MT*\n\n` +
        `MÉTODO DE PAGAMENTO\n\n${payment}\n\n` +
        `Olá! Gostaria de confirmar este pedido. Por favor, confirme a disponibilidade dos produtos e envie as instruções para o pagamento.\n\n` +
        `*${store.name}*`;

      const encodedMessage =
        encodeURIComponent(
          message,
        );

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

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

  /* CARRINHO VAZIO */
  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen min-w-0 items-center justify-center overflow-x-hidden bg-[#f7f7f5] p-6">
        <div className="w-full min-w-0 max-w-md text-center">
          <h1 className="break-words text-3xl font-black tracking-tight text-slate-950">
            Carrinho vazio
          </h1>

          <p className="mt-3 break-words text-sm text-slate-400">
            Adicione produtos ao carrinho
            antes de finalizar a compra.
          </p>

          <Link
            href={
              storeSlug
                ? `/store/${encodeURIComponent(storeSlug)}`
                : "/themes/luxe"
            }
            className="mt-6 inline-block rounded-xl bg-red-500 px-7 py-3.5 text-sm font-black text-white transition hover:bg-red-600"
          >
            Voltar para loja
          </Link>
        </div>
      </main>
    );
  }

  /* PÁGINA */
  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#f7f7f5] px-4 py-8 pb-24 md:px-6 md:py-12">
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        {/* TÍTULO */}
        <div className="mb-8 min-w-0">
          <Link
            href={
              storeSlug
                ? `/themes/luxe/carrinho?storeSlug=${encodeURIComponent(storeSlug)}`
                : "/themes/luxe/carrinho"
            }
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-red-500"
          >
            ← Voltar ao carrinho
          </Link>

          <h1 className="min-w-0 max-w-full break-words text-3xl font-black tracking-tight text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
            Finalizar compra
          </h1>

          <p className="mt-2 min-w-0 max-w-full break-words text-sm text-slate-400 [overflow-wrap:anywhere]">
            Preencha os seus dados e envie o
            pedido pelo WhatsApp.
          </p>
        </div>

        <div className="grid min-w-0 gap-8 lg:grid-cols-3">
          {/* FORMULÁRIO */}
          <section className="min-w-0 space-y-6 lg:col-span-2">
            {/* DADOS DE ENTREGA */}
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <h2 className="mb-6 flex min-w-0 items-center gap-2.5 break-words text-lg font-black tracking-tight text-slate-950">
                <MapPin className="h-5 w-5 shrink-0 text-red-500" />
                Dados de entrega
              </h2>

              <div className="grid min-w-0 gap-3 md:grid-cols-2">
                <input
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value,
                    )
                  }
                  placeholder="Nome completo *"
                  className="h-12 min-w-0 max-w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-red-500"
                />

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Telefone *"
                  type="tel"
                  className="h-12 min-w-0 max-w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-red-500"
                />

                <input
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Email (opcional)"
                  type="email"
                  className="h-12 min-w-0 max-w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-red-500"
                />

                <input
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="Cidade *"
                  className="h-12 min-w-0 max-w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-red-500"
                />
              </div>

              {/* ENDEREÇOS */}
              <div className="mt-4 min-w-0 space-y-4">
                <div className="min-w-0">
                  <label className="mb-2 block text-xs font-bold text-slate-700">
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
                    className="block h-24 w-full min-w-0 max-w-full resize-y rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-red-500"
                  />

                  <p className="mt-1.5 break-words text-xs text-slate-400">
                    Informe o endereço completo
                    e o distrito.
                  </p>
                </div>

                <div className="min-w-0">
                  <label className="mb-2 block text-xs font-bold text-slate-700">
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
                    className="h-12 w-full min-w-0 max-w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-red-500"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Endereço 3
                  </label>

                  <input
                    value={zoneOrReference}
                    onChange={(e) =>
                      setZoneOrReference(
                        e.target.value,
                      )
                    }
                    placeholder="Zona, Quarteirão, perto de X..."
                    className="h-12 w-full min-w-0 max-w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* PAGAMENTO */}
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <h2 className="mb-6 flex min-w-0 items-center gap-2.5 break-words text-lg font-black tracking-tight text-slate-950">
                <CreditCard className="h-5 w-5 shrink-0 text-red-500" />
                Método de pagamento
              </h2>

              <div className="min-w-0 space-y-2.5">
                {[
                  "M-Pesa",
                  "e-Mola",
                  "Cartão bancário",
                  "PayPal",
                ].map((method) => (
                  <label
                    key={method}
                    className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      payment ===
                      method
                        ? "border-red-500 bg-red-50"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="luxe-payment"
                      value={method}
                      checked={
                        payment ===
                        method
                      }
                      onChange={(e) =>
                        setPayment(
                          e.target
                            .value,
                        )
                      }
                      className="accent-red-500"
                    />

                    <span className="min-w-0 break-words text-sm font-bold [overflow-wrap:anywhere]">
                      {method}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* BENEFÍCIOS */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <div>
                  <h3 className="text-sm font-black text-slate-950">
                    Entrega rápida
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Para todo Moçambique.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <div>
                  <h3 className="text-sm font-black text-slate-950">
                    Compra protegida
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    O pagamento é combinado
                    com a nossa equipa.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RESUMO */}
          <aside className="h-fit min-w-0 rounded-2xl border border-slate-200 bg-white p-5 md:p-7 lg:sticky lg:top-24">
            <h2 className="mb-6 min-w-0 break-words text-lg font-black tracking-tight text-slate-950">
              Resumo do pedido
            </h2>

            <div className="min-w-0 space-y-5">
              {cart.map((item) => {
                const itemSubtotal =
                  Number(item.price) *
                  Number(item.quantity);

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
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* PRODUTO */}
                      <div className="min-w-0 flex-1">
                        <h3 className="min-w-0 max-w-full break-words text-sm font-bold text-slate-950 [overflow-wrap:anywhere]">
                          {item.name}
                        </h3>

                        <p className="mt-0.5 text-xs font-black text-red-600">
                          {formatPrice(
                            Number(
                              item.price,
                            ),
                          )}
                        </p>

                        {/* QUANTIDADE */}
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.id,
                                item.quantity,
                              )
                            }
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="min-w-[22px] text-center text-xs font-black">
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
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* PREÇO / ELIMINAR */}
                      <div className="flex min-w-0 shrink-0 flex-col items-end justify-between">
                        <strong className="max-w-[100px] break-words text-right text-sm font-black text-slate-950">
                          {formatPrice(
                            itemSubtotal,
                          )}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id,
                            )
                          }
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          title="Eliminar produto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TOTAIS */}
            <div className="mt-5 space-y-2.5 text-sm">
              <div className="flex min-w-0 items-center justify-between gap-4 text-slate-500">
                <span className="shrink-0">
                  Subtotal
                </span>

                <strong className="min-w-0 break-words text-right font-black text-slate-950">
                  {formatPrice(
                    total,
                  )}
                </strong>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-4 text-slate-500">
                <span className="shrink-0">
                  Entrega
                </span>

                <span className="min-w-0 text-right font-semibold">
                  Grátis
                </span>
              </div>
            </div>

            <div className="mt-4 flex min-w-0 items-center justify-between gap-4 border-t border-slate-200 pt-4">
              <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Total
              </span>

              <strong className="min-w-0 break-words text-right text-xl font-black text-slate-950">
                {formatPrice(
                  total,
                )}
              </strong>
            </div>

            {/* ENVIAR */}
            <button
              type="button"
              onClick={
                sendOrderToWhatsApp
              }
              disabled={loading}
              className="mt-6 flex w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-red-500 p-4 text-sm font-black text-white transition hover:bg-red-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle className="h-4.5 w-4.5" />
              {loading
                ? "A preparar..."
                : "Enviar pedido pelo WhatsApp"}
            </button>

            <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
              Ao enviar, o pedido será aberto
              no WhatsApp da loja para
              confirmação.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
