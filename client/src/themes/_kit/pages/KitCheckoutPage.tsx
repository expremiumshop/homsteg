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

import { ThemeStyleScope } from "../ThemeStyleScope";
import type { ThemeConfig } from "../themeConfig";
import { formatMzn } from "../lib";
import { TkInput, TkTextarea } from "../ui";

export interface KitCheckoutPageProps {
  theme: ThemeConfig;
}

/**
 * ============================================================
 * CHECKOUT DA _kit
 * ============================================================
 *
 * Espelho funcional da NovaCheckoutPage: dados do cliente,
 * endereços, método de pagamento e envio do pedido por
 * WhatsApp com a mensagem completa.
 */
export function KitCheckoutPage({ theme }: KitCheckoutPageProps) {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const search = useSearch();
  const searchStoreSlug = new URLSearchParams(search).get("storeSlug")?.trim();
  const storeSlug = cart[0]?.storeSlug ?? searchStoreSlug;

  const storeQuery = trpc.stores.bySlug.useQuery(
    { slug: storeSlug ?? "" },
    { enabled: Boolean(storeSlug) },
  );
  const store = storeQuery.data?.store as
    | { id: string; name: string; slug: string; whatsapp?: string | null }
    | undefined;

  /* dados do cliente */
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  /* endereços */
  const [address, setAddress] = useState("");
  const [avenueOrNeighborhood, setAvenueOrNeighborhood] = useState("");
  const [zoneOrReference, setZoneOrReference] = useState("");

  /* pagamento */
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  function decreaseQuantity(id: string, quantity: number) {
    if (quantity <= 1) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, quantity - 1);
  }

  function increaseQuantity(id: string, quantity: number) {
    updateQuantity(id, quantity + 1);
  }

  function getVariantsText(variants?: Record<string, string>) {
    if (!variants) return "";
    const entries = Object.entries(variants);
    if (entries.length === 0) return "";
    return entries
      .filter(([, value]) => value && String(value).trim() !== "")
      .map(([name, value]) => `${name}: ${value}`)
      .join("\n");
  }

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
      alert("Digite o endereço completo e o distrito.");
      return;
    }
    if (!payment) {
      alert("Selecione o método de pagamento.");
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
      alert(
        "Existe um produto inválido no carrinho. Atualize a página e tente novamente.",
      );
      return;
    }

    const whatsappNumber = store?.whatsapp?.replace(/\D/g, "");
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
          const variantsText = getVariantsText(item.variants);

          let productText =
            `PRODUTO ${index + 1}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `Nome: ${item.name}\n` +
            `Preço unitário: ${formatMzn(price)} MT\n` +
            `Quantidade: ${quantity}\n` +
            `Subtotal: ${formatMzn(subtotal)} MT\n`;

          if (variantsText) {
            productText += `\nVARIAÇÕES ESCOLHIDAS\n${variantsText}\n`;
          } else {
            productText += `\nVariações: Nenhuma\n`;
          }

          return productText;
        })
        .join("\n\n━━━━━━━━━━━━━━━━━━━━\n\n");

      const message = `
*NOVO PEDIDO - ${store.name}*

━━━━━━━━━━━━━━━━━━━━

*DADOS DO CLIENTE*

Nome: ${customerName.trim()}
Telefone: ${phone.trim()}
Email: ${email.trim() || "Não informado"}

━━━━━━━━━━━━━━━━━━━━

*DADOS DE ENTREGA*

Cidade: ${city.trim()}
Endereço 1: ${address.trim()}
Endereço 2: ${avenueOrNeighborhood.trim() || "Não informado"}
Endereço 3: ${zoneOrReference.trim() || "Não informado"}

━━━━━━━━━━━━━━━━━━━━

*PRODUTOS*

${productsText}

━━━━━━━━━━━━━━━━━━━━

*RESUMO DO PEDIDO*

Produtos: ${formatMzn(total)} MT
Entrega: Grátis
*TOTAL: ${formatMzn(total)} MT*

━━━━━━━━━━━━━━━━━━━━

*MÉTODO DE PAGAMENTO*

${payment}

━━━━━━━━━━━━━━━━━━━━

*CONFIRMAÇÃO*

Olá!
Gostaria de confirmar este pedido.
Por favor, confirme a disponibilidade dos produtos e envie as instruções para o pagamento.

*${store.name}*
━━━━━━━━━━━━━━━━━━━━`.trim();

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Erro ao preparar pedido:", error);
      alert("Não foi possível preparar o pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  /* carrinho vazio */
  if (cart.length === 0) {
    return (
      <ThemeStyleScope theme={theme}>
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <h1 className="text-3xl font-bold text-[var(--tk-text)]">
              Carrinho vazio
            </h1>
            <p className="mt-3 text-[var(--tk-muted)]">
              Adicione produtos ao carrinho antes de finalizar a compra.
            </p>
            <Link
              href={`/themes/${theme.key}`}
              className="mt-6 inline-block px-6 py-3 font-bold"
              style={{
                background: "var(--tk-primary)",
                color: "var(--tk-primary-contrast)",
                borderRadius: "var(--tk-radius)",
              }}
            >
              Voltar para loja
            </Link>
          </div>
        </main>
      </ThemeStyleScope>
    );
  }

  /* página */
  return (
    <ThemeStyleScope theme={theme}>
      <main className="min-h-screen px-4 py-6 pb-24 md:p-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--tk-text)] md:text-4xl">
              Finalizar compra
            </h1>
            <p className="mt-2 text-[var(--tk-muted)]">
              Preencha os seus dados e envie o pedido pelo WhatsApp.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* formulário */}
            <section className="space-y-6 lg:col-span-2">
              <div
                className="border p-5 shadow-sm md:p-6"
                style={{
                  background: "var(--tk-surface)",
                  borderColor: "var(--tk-border)",
                  borderRadius: "var(--tk-card-radius)",
                }}
              >
                <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-[var(--tk-text)]">
                  <MapPin size={21} className="shrink-0" />
                  Dados de entrega
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <TkInput
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nome completo *"
                  />
                  <TkInput
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Telefone *"
                    type="tel"
                  />
                  <TkInput
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (opcional)"
                    type="email"
                  />
                  <TkInput
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cidade *"
                  />
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--tk-text)]">
                      Endereço 1
                    </label>
                    <TkTextarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Endereço completo / Distrito *"
                      className="h-24 resize-y"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--tk-text)]">
                      Endereço 2
                    </label>
                    <TkInput
                      value={avenueOrNeighborhood}
                      onChange={(e) => setAvenueOrNeighborhood(e.target.value)}
                      placeholder="Avenida ou Bairro"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--tk-text)]">
                      Endereço 3
                    </label>
                    <TkInput
                      value={zoneOrReference}
                      onChange={(e) => setZoneOrReference(e.target.value)}
                      placeholder="Zona, Quarteirão, perto de X..."
                    />
                  </div>
                </div>
              </div>

              <div
                className="border p-5 shadow-sm md:p-6"
                style={{
                  background: "var(--tk-surface)",
                  borderColor: "var(--tk-border)",
                  borderRadius: "var(--tk-card-radius)",
                }}
              >
                <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-[var(--tk-text)]">
                  <CreditCard size={21} className="shrink-0" />
                  Método de pagamento
                </h2>

                <div className="space-y-3">
                  {["M-Pesa", "e-Mola", "Cartão bancário", "PayPal"].map(
                    (method) => (
                      <label
                        key={method}
                        className="flex cursor-pointer items-center gap-3 border p-4"
                        style={{
                          borderRadius: "var(--tk-radius)",
                          borderColor:
                            payment === method
                              ? "var(--tk-primary)"
                              : "var(--tk-border)",
                          background:
                            payment === method
                              ? "color-mix(in srgb, var(--tk-primary) 8%, transparent)"
                              : "transparent",
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={payment === method}
                          onChange={(e) => setPayment(e.target.value)}
                        />
                        <span className="text-[var(--tk-text)]">{method}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </section>

            {/* resumo */}
            <aside
              className="h-fit border p-5 shadow-sm md:p-6"
              style={{
                background: "var(--tk-surface)",
                borderColor: "var(--tk-border)",
                borderRadius: "var(--tk-card-radius)",
              }}
            >
              <h2 className="mb-5 text-xl font-bold text-[var(--tk-text)]">
                Resumo do pedido
              </h2>

              <div className="space-y-5">
                {cart.map((item) => {
                  const subtotal =
                    Number(item.price) * Number(item.quantity);
                  const imageSrc =
                    item.image_url && item.image_url.trim() !== ""
                      ? item.image_url
                      : "/placeholder-logo.png";

                  return (
                    <div
                      key={item.id}
                      className="border-b pb-5"
                      style={{ borderColor: "var(--tk-border)" }}
                    >
                      <div className="flex gap-3">
                        <div
                          className="relative h-[70px] w-[70px] shrink-0 overflow-hidden"
                          style={{
                            borderRadius: "var(--tk-radius)",
                            background: "var(--tk-bg)",
                          }}
                        >
                          <img
                            src={imageSrc}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-sm font-semibold text-[var(--tk-text)]">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-[var(--tk-muted)]">
                            {formatMzn(item.price)} MT
                          </p>

                          {item.variants &&
                            Object.entries(item.variants).filter(
                              ([, v]) => v && String(v).trim() !== "",
                            ).length > 0 && (
                              <div className="mt-1 text-xs text-[var(--tk-muted)]">
                                {Object.entries(item.variants)
                                  .filter(
                                    ([, v]) => v && String(v).trim() !== "",
                                  )
                                  .map(([name, value]) => (
                                    <div key={name}>
                                      <strong>{name}:</strong> {value}
                                    </div>
                                  ))}
                              </div>
                            )}

                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item.id, item.quantity)
                              }
                              className="flex h-7 w-7 items-center justify-center border"
                              style={{
                                borderRadius: "var(--tk-radius)",
                                borderColor: "var(--tk-border)",
                              }}
                              aria-label="Diminuir"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="min-w-[24px] text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item.id, item.quantity)
                              }
                              className="flex h-7 w-7 items-center justify-center border"
                              style={{
                                borderRadius: "var(--tk-radius)",
                                borderColor: "var(--tk-border)",
                              }}
                              aria-label="Aumentar"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end justify-between">
                          <strong className="text-sm text-[var(--tk-text)]">
                            {formatMzn(subtotal)} MT
                          </strong>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
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

              <div className="mt-6 space-y-3 border-t pt-5" style={{ borderColor: "var(--tk-border)" }}>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--tk-muted)]">Produtos</span>
                  <strong className="text-[var(--tk-text)]">
                    {formatMzn(total)} MT
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--tk-muted)]">Entrega</span>
                  <strong className="text-green-600">Grátis</strong>
                </div>
                <div className="flex items-center justify-between gap-4 text-xl font-bold">
                  <span className="text-[var(--tk-text)]">Total</span>
                  <span className="text-[var(--tk-text)]">
                    {formatMzn(total)} MT
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={sendOrderToWhatsApp}
                disabled={loading}
                className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 px-4 py-4 text-center font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "#16a34a",
                  color: "#ffffff",
                  borderRadius: "var(--tk-radius)",
                }}
              >
                <MessageCircle size={21} className="shrink-0" />
                {loading ? "A preparar pedido..." : "Enviar o pedido/WhatsApp"}
              </button>

              <p className="mt-3 text-center text-xs text-[var(--tk-muted)]">
                O WhatsApp será aberto com todos os dados do pedido
                preenchidos automaticamente.
              </p>

              <div
                className="mt-6 space-y-3 border-t pt-5 text-sm text-[var(--tk-muted)]"
                style={{ borderColor: "var(--tk-border)" }}
              >
                <p className="flex items-center gap-2">
                  <ShieldCheck size={17} className="shrink-0" />
                  Pagamento seguro
                </p>
                <p className="flex items-center gap-2">
                  <Truck size={17} className="shrink-0" />
                  Entrega rastreada
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck size={17} className="shrink-0" />
                  Garantia 100%
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </ThemeStyleScope>
  );
}

export default KitCheckoutPage;
