import { Link, useSearch } from "wouter";

import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCart } from "@/contexts/CartContext";

import { formatPrice } from "./demoData";

import { useThemeFonts } from "./useThemeFonts";

import {
  chazucaColors,
  chazucaHeadingFont,
  chazucaBodyFont,
} from "./theme";

export default function ChazucaCartPage() {
  useThemeFonts();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  } = useCart();

  /*
   * O cliente volta sempre para a loja
   * real de onde veio. O storeSlug
   * acompanha os itens do carrinho e a
   * URL (?storeSlug=...) como fallback.
   */
  const search = useSearch();

  const searchStoreSlug =
    new URLSearchParams(search)
      .get("storeSlug")
      ?.trim();

  const storeSlug =
    cart[0]?.storeSlug ??
    searchStoreSlug;

  const backToStorePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : "/themes/chazuca";

  /* ============================================================
     CARRINHO VAZIO
     ============================================================ */

  if (cart.length === 0) {
    return (
      <main
        className="flex min-h-screen min-w-0 items-center justify-center overflow-x-hidden p-6"
        style={{
          background: chazucaColors.bg,
        }}
      >
        <div className="w-full min-w-0 max-w-md text-center">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background:
                "color-mix(in srgb, #7c3aed 12%, transparent)",
              color: "#7c3aed",
            }}
          >
            <ShoppingBag
              size={26}
              strokeWidth={1.5}
            />
          </div>

          <h1
            className="min-w-0 max-w-full break-words text-3xl [overflow-wrap:anywhere]"
            style={{
              fontFamily:
                chazucaHeadingFont,
              fontWeight: 700,
              color: chazucaColors.text,
            }}
          >
            O seu carrinho está vazio
          </h1>

          <p
            className="mt-2.5 text-sm"
            style={{
              color:
                chazucaColors.textMuted,
            }}
          >
            Adicione peças para continuar.
          </p>

          <Link
            href={backToStorePath}
            className="mt-7 inline-block rounded-full px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90"
            style={{
              background:
                chazucaColors.accent,
              color:
                chazucaColors.accentContrast,
            }}
          >
            Continuar a descobrir
          </Link>
        </div>
      </main>
    );
  }

  /* ============================================================
     PÁGINA DO CARRINHO
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
        {/* TÍTULO */}

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
            Carrinho
          </h1>

          <p
            className="mt-2 text-sm"
            style={{
              color:
                chazucaColors.textMuted,
            }}
          >
            {cart.length}{" "}
            {cart.length === 1
              ? "peça"
              : "peças"}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* LISTA DE PRODUTOS */}

          <div
            className="min-w-0 divide-y"
            style={{
              borderColor:
                chazucaColors.border,
            }}
          >
            {cart.map((item) => {
              const imageSrc =
                item.image_url &&
                item.image_url.trim() !==
                  ""
                  ? item.image_url
                  : "/placeholder.svg";

              return (
                <div
                  key={item.id}
                  className="flex min-w-0 flex-col gap-5 py-6 sm:flex-row sm:items-center"
                  style={{
                    borderColor:
                      chazucaColors.border,
                  }}
                >
                  {/* IMAGEM */}

                  <div
                    className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl"
                    style={{
                      background:
                        chazucaColors.surface,
                      borderColor:
                        chazucaColors.border,
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  {/* INFORMAÇÕES */}

                  <div className="min-w-0 flex-1">
                    <h2
                      className="min-w-0 max-w-full break-words text-lg [overflow-wrap:anywhere]"
                      style={{
                        fontFamily:
                          chazucaHeadingFont,
                        fontWeight: 700,
                        color:
                          chazucaColors.text,
                      }}
                    >
                      {item.name}
                    </h2>

                    <p
                      className="mt-1 text-sm font-semibold"
                      style={{
                        color:
                          chazucaColors.primary,
                      }}
                    >
                      {formatPrice(
                        Number(
                          item.price,
                        ),
                      )}
                    </p>

                    {/* VARIANTES */}

                    {item.variants &&
                      Object.keys(
                        item.variants,
                      ).length > 0 && (
                        <p
                          className="mt-1.5 min-w-0 max-w-full break-words text-xs [overflow-wrap:anywhere]"
                          style={{
                            color:
                              chazucaColors.textMuted,
                          }}
                        >
                          {Object.entries(
                            item.variants,
                          )
                            .map(
                              (
                                [
                                  name,
                                  value,
                                ],
                              ) =>
                                `${name}: ${value}`,
                            )
                            .join(
                              " · ",
                            )}
                        </p>
                      )}

                    {/* QUANTIDADE */}

                    <div
                      className="mt-4 flex w-fit items-center rounded-full border"
                      style={{
                        borderColor:
                          chazucaColors.border,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity -
                              1,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-purple-50"
                        aria-label="Diminuir quantidade"
                        style={{
                          color:
                            chazucaColors.text,
                        }}
                      >
                        <Minus size={14} />
                      </button>

                      <span
                        className="w-10 text-center text-sm font-semibold"
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
                          updateQuantity(
                            item.id,
                            item.quantity +
                              1,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-purple-50"
                        aria-label="Aumentar quantidade"
                        style={{
                          color:
                            chazucaColors.text,
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* REMOVER */}

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(
                          item.id,
                        )
                      }
                      className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] transition hover:opacity-60"
                      style={{
                        color:
                          chazucaColors.textMuted,
                      }}
                    >
                      <Trash2 size={13} />
                      Remover
                    </button>
                  </div>

                  {/* SUBTOTAL */}

                  <div className="min-w-0 shrink-0 sm:self-start sm:text-right">
                    <strong
                      className="block max-w-full break-words text-base font-semibold"
                      style={{
                        color:
                          chazucaColors.text,
                      }}
                    >
                      {formatPrice(
                        Number(
                          item.price,
                        ) *
                          Number(
                            item.quantity,
                          ),
                      )}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>

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
              className="min-w-0 break-words text-xl"
              style={{
                fontFamily:
                  chazucaHeadingFont,
                fontWeight: 700,
                color: chazucaColors.text,
              }}
            >
              Resumo
            </h2>

            <div className="mt-6 flex min-w-0 items-center justify-between gap-4 text-sm">
              <span
                style={{
                  color:
                    chazucaColors.textMuted,
                }}
              >
                Subtotal
              </span>

              <strong
                className="min-w-0 break-words text-right font-semibold"
                style={{
                  color:
                    chazucaColors.text,
                }}
              >
                {formatPrice(
                  total,
                )}
              </strong>
            </div>

            <div className="mt-2.5 flex min-w-0 items-center justify-between gap-4 text-sm">
              <span
                style={{
                  color:
                    chazucaColors.textMuted,
                }}
              >
                Entrega
              </span>

              <span
                className="min-w-0 text-right"
                style={{
                  color:
                    chazucaColors.textMuted,
                }}
              >
                Calculada no checkout
              </span>
            </div>

            <div
              className="mt-5 flex min-w-0 items-center justify-between gap-4 border-t pt-5"
              style={{
                borderColor:
                  chazucaColors.border,
              }}
            >
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                style={{
                  color:
                    chazucaColors.text,
                }}
              >
                Total
              </span>

              <strong
                className="min-w-0 break-words text-right text-lg font-semibold"
                style={{
                  color:
                    chazucaColors.text,
                }}
              >
                {formatPrice(
                  total,
                )}
              </strong>
            </div>

            {/* FINALIZAR */}

            <Link
              href={
                storeSlug
                  ? `/themes/chazuca/checkout?storeSlug=${encodeURIComponent(storeSlug)}`
                  : "/themes/chazuca/checkout"
              }
              className="mt-7 flex min-w-0 items-center justify-center rounded-full p-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90"
              style={{
                background:
                  chazucaColors.accent,
                color:
                  chazucaColors.accentContrast,
              }}
            >
              Finalizar compra
            </Link>

            {/* LIMPAR */}

            <button
              type="button"
              onClick={clearCart}
              className="mt-4 w-full min-w-0 break-words text-[11px] uppercase tracking-[0.12em] transition hover:opacity-60"
              style={{
                color:
                  chazucaColors.textMuted,
              }}
            >
              Limpar carrinho
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
