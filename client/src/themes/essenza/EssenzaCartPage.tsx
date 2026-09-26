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

export default function EssenzaCartPage() {
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
    : "/themes/essenza";

  /* ============================================================
     CARRINHO VAZIO
     ============================================================ */

  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen min-w-0 items-center justify-center overflow-x-hidden bg-white p-6">
        <div className="w-full min-w-0 max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-neutral-200">
            <ShoppingBag
              size={26}
              strokeWidth={1.5}
              className="text-neutral-950"
            />
          </div>

          <h1
            className="min-w-0 max-w-full break-words text-3xl text-neutral-950 [overflow-wrap:anywhere]"
            style={{
              fontFamily:
                "'Playfair Display', Georgia, serif",
              fontWeight: 500,
            }}
          >
            O seu carrinho está vazio
          </h1>

          <p className="mt-2.5 text-sm text-neutral-400">
            Adicione peças para continuar.
          </p>

          <Link
            href={backToStorePath}
            className="mt-7 inline-block border border-neutral-950 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
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
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-white px-5 py-10 pb-24 md:px-8 md:py-14">
      <div
        className="mx-auto w-full min-w-0 max-w-6xl"
        style={{
          fontFamily:
            "'Inter', system-ui, sans-serif",
        }}
      >
        {/* TÍTULO */}

        <div className="mb-10 min-w-0">
          <Link
            href={backToStorePath}
            className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-neutral-400 transition hover:text-neutral-950"
          >
            ← Voltar à loja
          </Link>

          <h1
            className="min-w-0 max-w-full break-words text-3xl text-neutral-950 [overflow-wrap:anywhere] sm:text-4xl"
            style={{
              fontFamily:
                "'Playfair Display', Georgia, serif",
              fontWeight: 500,
            }}
          >
            Carrinho
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            {cart.length}{" "}
            {cart.length === 1
              ? "peça"
              : "peças"}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* LISTA DE PRODUTOS */}

          <div className="min-w-0 divide-y divide-neutral-100">
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
                >
                  {/* IMAGEM */}

                  <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-neutral-100">
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  {/* INFORMAÇÕES */}

                  <div className="min-w-0 flex-1">
                    <h2
                      className="min-w-0 max-w-full break-words text-lg text-neutral-950 [overflow-wrap:anywhere]"
                      style={{
                        fontFamily:
                          "'Playfair Display', Georgia, serif",
                        fontWeight: 500,
                      }}
                    >
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-neutral-950">
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
                        <p className="mt-1.5 min-w-0 max-w-full break-words text-xs text-neutral-400 [overflow-wrap:anywhere]">
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

                    <div className="mt-4 flex w-fit items-center border border-neutral-200">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity -
                              1,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-neutral-50"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-10 text-center text-sm font-medium">
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
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-neutral-50"
                        aria-label="Aumentar quantidade"
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
                      className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-neutral-400 transition hover:text-neutral-950"
                    >
                      <Trash2 size={13} />
                      Remover
                    </button>
                  </div>

                  {/* SUBTOTAL */}

                  <div className="min-w-0 shrink-0 sm:self-start sm:text-right">
                    <strong className="block max-w-full break-words text-base font-medium text-neutral-950">
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

          <aside className="h-fit min-w-0 border border-neutral-200 p-7 lg:sticky lg:top-28">
            <h2
              className="min-w-0 break-words text-xl text-neutral-950"
              style={{
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                fontWeight: 500,
              }}
            >
              Resumo
            </h2>

            <div className="mt-6 flex min-w-0 items-center justify-between gap-4 text-sm">
              <span className="text-neutral-500">
                Subtotal
              </span>

              <strong className="min-w-0 break-words text-right font-medium text-neutral-950">
                {formatPrice(
                  total,
                )}
              </strong>
            </div>

            <div className="mt-2.5 flex min-w-0 items-center justify-between gap-4 text-sm">
              <span className="text-neutral-500">
                Entrega
              </span>

              <span className="min-w-0 text-right text-neutral-500">
                Calculada no checkout
              </span>
            </div>

            <div className="mt-5 flex min-w-0 items-center justify-between gap-4 border-t border-neutral-200 pt-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-950">
                Total
              </span>

              <strong className="min-w-0 break-words text-right text-lg font-medium text-neutral-950">
                {formatPrice(
                  total,
                )}
              </strong>
            </div>

            {/* FINALIZAR */}

            <Link
              href={
                storeSlug
                  ? `/themes/essenza/checkout?storeSlug=${encodeURIComponent(storeSlug)}`
                  : "/themes/essenza/checkout"
              }
              className="mt-7 flex min-w-0 items-center justify-center bg-neutral-950 p-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-800"
            >
              Finalizar compra
            </Link>

            {/* LIMPAR */}

            <button
              type="button"
              onClick={clearCart}
              className="mt-4 w-full min-w-0 break-words text-[11px] uppercase tracking-[0.12em] text-neutral-400 transition hover:text-neutral-950"
            >
              Limpar carrinho
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
