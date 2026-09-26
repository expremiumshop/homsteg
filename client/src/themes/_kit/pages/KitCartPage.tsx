import { Link, useSearch } from "wouter";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/contexts/CartContext";

import { ThemeStyleScope } from "../ThemeStyleScope";
import type { ThemeConfig } from "../themeConfig";
import { formatMzn } from "../lib";

export interface KitCartPageProps {
  theme: ThemeConfig;
}

/**
 * ============================================================
 * CARRINHO DA _kit
 * ============================================================
 *
 * Espelho funcional da NovaCartPage: aumento/diminuição de
 * quantidade, remoção, limpar carrinho, total e retorno à loja
 * de origem via storeSlug.
 */
export function KitCartPage({ theme }: KitCartPageProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();

  const search = useSearch();
  const searchStoreSlug = new URLSearchParams(search)
    .get("storeSlug")
    ?.trim();
  const storeSlug = cart[0]?.storeSlug ?? searchStoreSlug;
  const backToStorePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : `/themes/${theme.key}`;

  if (cart.length === 0) {
    return (
      <ThemeStyleScope theme={theme}>
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background:
                  "color-mix(in srgb, var(--tk-primary) 12%, transparent)",
                color: "var(--tk-primary)",
              }}
            >
              <ShoppingBag size={34} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--tk-text)]">
              Seu carrinho está vazio
            </h1>
            <p className="mt-2 text-[var(--tk-muted)]">
              Adicione produtos para continuar.
            </p>
            <Link
              href={backToStorePath}
              className="mt-6 inline-block px-6 py-3 font-bold"
              style={{
                background: "var(--tk-primary)",
                color: "var(--tk-primary-contrast)",
                borderRadius: "var(--tk-radius)",
              }}
            >
              Continuar comprando
            </Link>
          </div>
        </main>
      </ThemeStyleScope>
    );
  }

  return (
    <ThemeStyleScope theme={theme}>
      <main className="min-h-screen px-4 py-6 pb-24 md:p-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8">
            <Link
              href={backToStorePath}
              className="mb-3 inline-block text-sm font-medium text-[var(--tk-muted)] hover:text-[var(--tk-primary)]"
            >
              ← Voltar à loja
            </Link>
            <h1 className="text-3xl font-bold text-[var(--tk-text)] md:text-4xl">
              Carrinho de compras
            </h1>
          </div>

          <div className="space-y-5">
            {cart.map((item) => {
              const imageSrc =
                item.image_url && item.image_url.trim() !== ""
                  ? item.image_url
                  : "/placeholder.svg";

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 border p-4 shadow-sm sm:flex-row sm:items-center sm:gap-5"
                  style={{
                    background: "var(--tk-surface)",
                    borderColor: "var(--tk-border)",
                    borderRadius: "var(--tk-card-radius)",
                  }}
                >
                  <div
                    className="relative h-[100px] w-[100px] shrink-0 overflow-hidden"
                    style={{
                      borderRadius: "var(--tk-radius)",
                      background: "var(--tk-bg)",
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-[var(--tk-text)]">
                      {item.name}
                    </h2>
                    <p className="mt-1 font-bold" style={{ color: "var(--tk-primary)" }}>
                      {formatMzn(item.price)} MZN
                    </p>

                    {item.variants &&
                      Object.keys(item.variants).length > 0 && (
                        <div className="mt-2 space-y-1 text-sm text-[var(--tk-muted)]">
                          {Object.entries(item.variants).map(([name, value]) => (
                            <div key={name}>
                              <strong>{name}:</strong> {value}
                            </div>
                          ))}
                        </div>
                      )}

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-black/5"
                        style={{
                          borderRadius: "var(--tk-radius)",
                          background: "var(--tk-bg)",
                        }}
                        aria-label="Diminuir quantidade"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="min-w-[30px] text-center font-bold text-[var(--tk-text)]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-black/5"
                        style={{
                          borderRadius: "var(--tk-radius)",
                          background: "var(--tk-bg)",
                        }}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm text-red-500 transition hover:text-red-600"
                    >
                      <Trash2 size={14} />
                      Remover
                    </button>
                  </div>

                  <div className="shrink-0 sm:self-start">
                    <strong className="text-[var(--tk-text)] sm:text-right">
                      {formatMzn(Number(item.price) * Number(item.quantity))} MZN
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-8 border p-5 shadow-sm"
            style={{
              background: "var(--tk-surface)",
              borderColor: "var(--tk-border)",
              borderRadius: "var(--tk-card-radius)",
            }}
          >
            <h2 className="text-xl font-bold text-[var(--tk-text)]">Resumo</h2>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-[var(--tk-muted)]">Total:</span>
              <strong className="text-xl text-[var(--tk-text)]">
                {formatMzn(total)} MZN
              </strong>
            </div>

            <Link
              href={`/themes/${theme.key}/checkout`}
              className="mt-6 block p-4 text-center font-bold"
              style={{
                background: "var(--tk-primary)",
                color: "var(--tk-primary-contrast)",
                borderRadius: "var(--tk-radius)",
              }}
            >
              Finalizar compra
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className="mt-4 w-full text-red-500 transition hover:text-red-600"
            >
              Limpar carrinho
            </button>
          </div>
        </div>
      </main>
    </ThemeStyleScope>
  );
}

export default KitCartPage;
