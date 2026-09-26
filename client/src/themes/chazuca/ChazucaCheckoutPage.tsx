import { useState } from "react";

import {
  CreditCard,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { Link, useSearch } from "wouter";

import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";

import { formatPrice } from "./demoData";

import { useThemeFonts } from "./useThemeFonts";

import {
  chazucaColors,
  chazucaHeadingFont,
  chazucaBodyFont,
} from "./theme";

export default function ChazucaCheckoutPage() {
  useThemeFonts();

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
    : "/themes/chazuca";

  /* ============================================================
     DADOS DO CLIENTE
     ============================================================ */

  const [customerName, setCustomerName] = useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [city, setCity] = useState("");

  /* ============================================================
     ENDEREÇOS
     ============================================================ */

  const [address, setAddress] = useState("");

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

  const [payment, setPayment] = useState("");

  const [loading, setLoading] = useState(false);

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
${avenueOrNeighborhood.trim() || "Não informado"}

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
      <main
        className="flex min-h-screen min-w-0 items-center justify-center p-6"
        style={{
          background: chazucaColors.bg,
        }}
      >
        <div className="w-full min-w-0 max-w-md text-center">
          <h1
            className="break-words text-3xl"
            style={{
              fontFamily:
                chazucaHeadingFont,
              fontWeight: 700,
              color: chazucaColors.text,
            }}
          >
            Carrinho vazio
          </h1>

          <p
            className="mt-3 text-sm"
            style={{
              color:
                chazucaColors.textMuted,
            }}
          >
            Adicione peças ao carrinho
            antes de finalizar a compra.
          </p>

          <Link
            href={backToStorePath}
            className="mt-7 inline-block rounded-full px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90"
            style={{
              background:
                chazucaColors.accent,
              color:
                chazucaColors.accentContrast,
            }}
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
    <main
      className="min-h-screen min-w-0 overflow-x-hidden px-5 py-10 pb-24 md:px-8 md:py-14"
      style={{
        background: chazucaColors.bg,
        fontFamily: chazucaBodyFont,
      }}
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        {/* CABEÇALHO */}

        <div className="mb-10 min-w-0">
          <Link
            href={backToStorePath}
            className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] transition hover:opacity-60"
            style={{
              color:
                chazucaColors.textMuted,
            }}
          >
            ← Voltar à loja
          </Link>

          <h1
            className="min-w-0 max-w-full break-words text-3xl [overflow-wrap:anywhere] sm:text-4xl"
            style={{
              fontFamily:
                chazucaHeadingFont,
              fontWeight: 700,
              color: chazucaColors.text,
            }}
          >
            Finalizar compra
          </h1>

          <p
            className="mt-2 text-sm"
            style={{
              color:
                chazucaColors.textMuted,
            }}
          >
            Preencha os seus dados e envie
            o pedido pelo WhatsApp.
          </p>
        </div>

        <div className="grid min-w-0 gap-12 lg:grid-cols-3">
          {/* FORMULÁRIO */}

          <section className="min-w-0 space-y-10 lg:col-span-2">
            {/* DADOS DE ENTREGA */}

            <div className="min-w-0">
              <h2 className="mb-6 flex min-w-0 items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.16em]">
                <MapPin
                  size={17}
                  strokeWidth={1.5}
                  className="shrink-0"
                  style={{
                    color:
                      chazucaColors.text,
                  }}
                />

                <span className="min-w-0 break-words">
                  Dados de entrega
                </span>
              </h2>

              <div className="grid min-w-0 gap-5 md:grid-cols-2">
                <input
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value,
                    )
                  }
                  placeholder="Nome completo *"
                  className="min-w-0 max-w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition"
                  style={{
                    background:
                      chazucaColors.surface,
                    borderColor:
                      chazucaColors.border,
                    color:
                      chazucaColors.text,
                  }}
                />

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Telefone *"
                  type="tel"
                  className="min-w-0 max-w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition"
                  style={{
                    background:
                      chazucaColors.surface,
                    borderColor:
                      chazucaColors.border,
                    color:
                      chazucaColors.text,
                  }}
                />

                <input
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Email (opcional)"
                  type="email"
                  className="min-w-0 max-w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition"
                  style={{
                    background:
                      chazucaColors.surface,
                    borderColor:
                      chazucaColors.border,
                    color:
                      chazucaColors.text,
                  }}
                />

                <input
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="Cidade *"
                  className="min-w-0 max-w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition"
                  style={{
                    background:
                      chazucaColors.surface,
                    borderColor:
                      chazucaColors.border,
                    color:
                      chazucaColors.text,
                  }}
                />
              </div>

              {/* ENDEREÇOS */}

              <div className="mt-5 min-w-0 space-y-5">
                {/* ENDEREÇO 1 */}

                <div className="min-w-0">
                  <label
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em]"
                    style={{
                      color:
                        chazucaColors.text,
                    }}
                  >
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
                    className="block h-24 w-full min-w-0 max-w-full resize-y rounded-2xl border px-4 py-3.5 text-sm outline-none transition"
                    style={{
                      background:
                        chazucaColors.surface,
                      borderColor:
                        chazucaColors.border,
                      color:
                        chazucaColors.text,
                    }}
                  />

                  <p
                    className="mt-1.5 text-xs"
                    style={{
                      color:
                        chazucaColors.textMuted,
                    }}
                  >
                    Informe o endereço completo
                    e o distrito.
                  </p>
                </div>

                {/* ENDEREÇO 2 */}

                <div className="min-w-0">
                  <label
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em]"
                    style={{
                      color:
                        chazucaColors.text,
                    }}
                  >
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
                    className="w-full min-w-0 max-w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition"
                    style={{
                      background:
                        chazucaColors.surface,
                      borderColor:
                        chazucaColors.border,
                      color:
                        chazucaColors.text,
                    }}
                  />
                </div>

                {/* ENDEREÇO 3 */}

                <div className="min-w-0">
                  <label
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em]"
                    style={{
                      color:
                        chazucaColors.text,
                    }}
                  >
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
                    className="w-full min-w-0 max-w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition"
                    style={{
                      background:
                        chazucaColors.surface,
                      borderColor:
                        chazucaColors.border,
                      color:
                        chazucaColors.text,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* PAGAMENTO */}

            <div className="min-w-0">
              <h2 className="mb-6 flex min-w-0 items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.16em]">
                <CreditCard
                  size={17}
                  strokeWidth={1.5}
                  className="shrink-0"
                  style={{
                    color:
                      chazucaColors.text,
                  }}
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
                    className="flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 transition"
                    style={{
                      background:
                        payment ===
                        method
                          ? "color-mix(in srgb, #7c3aed 6%, transparent)"
                          : chazucaColors.surface,
                      borderColor:
                        payment ===
                        method
                          ? chazucaColors.primary
                          : chazucaColors.border,
                    }}
                  >
                    <input
                      type="radio"
                      name="chazuca-payment"
                      value={method}
                      checked={
                        payment ===
                        method
                      }
                      onChange={(e) =>
                        setPayment(
                          e.target.value,
                        )
                      }
                    />

                    <span
                      className="min-w-0 break-words text-sm"
                      style={{
                        color:
                          chazucaColors.text,
                      }}
                    >
                      {method}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* RESUMO */}

          <aside
            className="h-fit min-w-0 rounded-3xl border p-7 lg:sticky lg:top-28"
            style={{
              background:
                chazucaColors.surface,
              borderColor:
                chazucaColors.border,
            }}
          >
            <h2
              className="mb-6 min-w-0 break-words text-xl"
              style={{
                fontFamily:
                  chazucaHeadingFont,
                fontWeight: 700,
                color: chazucaColors.text,
              }}
            >
              Resumo do pedido
            </h2>

            <div
              className="min-w-0 divide-y"
              style={{
                borderColor:
                  chazucaColors.border,
              }}
            >
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
                    className="flex min-w-0 gap-4 py-5"
                    style={{
                      borderColor:
                        chazucaColors.border,
                    }}
                  >
                    {/* IMAGEM */}

                    <div
                      className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl"
                      style={{
                        background:
                          chazucaColors.bg,
                      }}
                    >
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* PRODUTO */}

                    <div className="min-w-0 flex-1">
                      <h3
                        className="min-w-0 max-w-full break-words text-sm font-medium [overflow-wrap:anywhere]"
                        style={{
                          color:
                            chazucaColors.text,
                        }}
                      >
                        {item.name}
                      </h3>

                      <p
                        className="mt-0.5 text-xs"
                        style={{
                          color:
                            chazucaColors.textMuted,
                        }}
                      >
                        {formatPrice(
                          Number(
                            item.price,
                          ),
                        )}
                      </p>

                      {/* VARIANTES */}

                      {variantsText && (
                        <p
                          className="mt-1 min-w-0 max-w-full break-words text-xs [overflow-wrap:anywhere]"
                          style={{
                            color:
                              chazucaColors.textMuted,
                          }}
                        >
                          {variantsText.split("\n").join(" · ")}
                        </p>
                      )}

                      {/* QUANTIDADE */}

                      <div
                        className="mt-2.5 flex items-center rounded-full border"
                        style={{
                          borderColor:
                            chazucaColors.border,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.quantity,
                            )
                          }
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-purple-50"
                          aria-label="Diminuir quantidade"
                          style={{
                            color:
                              chazucaColors.text,
                          }}
                        >
                          <Minus size={13} />
                        </button>

                        <span
                          className="min-w-[28px] text-center text-xs font-semibold"
                          style={{
                            color:
                              chazucaColors.text,
                          }}
                        >
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
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-purple-50"
                          aria-label="Aumentar quantidade"
                          style={{
                            color:
                              chazucaColors.text,
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* PREÇO / ELIMINAR */}

                    <div className="flex min-w-0 shrink-0 flex-col items-end justify-between">
                      <strong
                        className="max-w-[90px] break-words text-right text-sm font-semibold"
                        style={{
                          color:
                            chazucaColors.text,
                        }}
                      >
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
                        className="p-1.5 transition hover:opacity-60"
                        style={{
                          color: "#be185d",
                        }}
                        title="Eliminar produto"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TOTAIS */}

            <div
              className="mt-5 min-w-0 space-y-3 border-t pt-5"
              style={{
                borderColor:
                  chazucaColors.border,
              }}
            >
              <div className="flex min-w-0 items-center justify-between gap-4 text-sm">
                <span
                  style={{
                    color:
                      chazucaColors.textMuted,
                  }}
                >
                  Produtos
                </span>

                <strong
                  className="min-w-0 break-words text-right font-semibold"
                  style={{
                    color:
                      chazucaColors.text,
                  }}
                >
                  {formatPrice(total)}
                </strong>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-4 text-sm">
                <span
                  style={{
                    color:
                      chazucaColors.textMuted,
                  }}
                >
                  Entrega
                </span>

                <strong
                  className="shrink-0 font-semibold"
                  style={{
                    color: "#15803d",
                  }}
                >
                  Grátis
                </strong>
              </div>

              <div
                className="flex min-w-0 items-center justify-between gap-4 pt-1 text-base font-semibold"
                style={{
                  color:
                    chazucaColors.text,
                }}
              >
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
              className="mt-7 flex min-h-14 w-full min-w-0 items-center justify-center gap-3 rounded-full px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: "#25D366",
              }}
            >
              <MessageCircle
                size={18}
                className="shrink-0"
              />

              <span className="min-w-0 break-words">
                {loading
                  ? "A preparar pedido..."
                  : "Enviar pedido pelo WhatsApp"}
              </span>
            </button>

            <p
              className="mt-3 min-w-0 max-w-full break-words text-center text-xs"
              style={{
                color:
                  chazucaColors.textMuted,
              }}
            >
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
