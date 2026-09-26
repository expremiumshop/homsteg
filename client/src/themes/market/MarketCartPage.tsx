import { Link, useSearch } from "wouter";

import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCart } from "@/contexts/CartContext";

import { formatPrice } from "./demoData";

export default function MarketCartPage() {
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
    : "/themes/market";

  /* ============================================================
     CARRINHO VAZIO
     ============================================================ */

  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen min-w-0 items-center justify-center overflow-x-hidden bg-slate-50 p-6">
        <div className="w-full min-w-0 max-w-md text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50">
            <ShoppingBag className="h-9 w-9 text-emerald-600" />
          </div>

          <h1 className="min-w-0 max-w-full break-words text-3xl font-black tracking-tight text-slate-950 [overflow-wrap:anywhere]">
            Seu carrinho está vazio
          </h1>

          <p className="mt-2 min-w-0 max-w-full break-words text-sm text-slate-400 [overflow-wrap:anywhere]">
            Adicione produtos para
            continuar.
          </p>

          <Link
            href={backToStorePath}
            className="mt-6 inline-block rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            Continuar comprando
          </Link>
        </div>
      </main>
    );
  }

  /* ============================================================
     PÁGINA DO CARRINHO
     ============================================================ */

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 px-4 py-8 pb-24 md:px-6 md:py-12">
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        {/* TÍTULO */}

        <div className="mb-8 min-w-0">
          <Link
            href={backToStorePath}
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-emerald-600"
          >
            ← Voltar à loja
          </Link>

          <h1 className="min-w-0 max-w-full break-words text-3xl font-black tracking-tight text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
            Seu carrinho
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {cart.length}{" "}
            {cart.length === 1
              ? "produto"
              : "produtos"}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* LISTA DE PRODUTOS */}

          <div className="min-w-0 space-y-4">
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
                  className="flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-5"
                >
                  {/* IMAGEM */}

                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  {/* INFORMAÇÕES */}

                  <div className="min-w-0 flex-1">
                    <h2 className="min-w-0 max-w-full break-words text-base font-black text-slate-950 [overflow-wrap:anywhere]">
                      {item.name}
                    </h2>

                    <p className="mt-1 min-w-0 break-words text-sm font-black text-emerald-600">
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
                        <p className="mt-2 min-w-0 max-w-full break-words text-xs text-slate-400 [overflow-wrap:anywhere]">
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

                    <div className="mt-4 flex w-fit items-center rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity -
                              1,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-slate-50"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-10 text-center text-sm font-black text-slate-950">
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
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-slate-50"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-4 w-4" />
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
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remover
                    </button>
                  </div>

                  {/* SUBTOTAL */}

                  <div className="min-w-0 shrink-0 sm:self-start">
                    <strong className="block max-w-full break-words text-left text-base font-black text-slate-950 sm:text-right">
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

            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-bold text-slate-400 transition hover:text-red-500"
            >
              Limpar carrinho
            </button>
          </div>

          {/* RESUMO */}

          <aside className="h-fit min-w-0 rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="min-w-0 break-words text-xl font-black tracking-tight text-slate-950">
              Resumo
            </h2>

            <div className="mt-5 flex min-w-0 items-center justify-between gap-4 text-sm">
              <span className="shrink-0 text-slate-500">
                Subtotal
              </span>

              <strong className="min-w-0 break-words text-right font-black text-slate-950">
                {formatPrice(
                  total,
                )}
              </strong>
            </div>

            <div className="mt-2 flex min-w-0 items-center justify-between gap-4 text-sm">
              <span className="shrink-0 text-slate-500">
                Entrega
              </span>

              <span className="min-w-0 text-right font-semibold text-slate-500">
                Calculada no checkout
              </span>
            </div>

            <div className="mt-4 flex min-w-0 items-center justify-between gap-4 border-t border-slate-200 pt-4">
              <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Total
              </span>

              <strong className="min-w-0 break-words text-right text-xl font-black text-slate-950">
                {formatPrice(
                  total,
                )}
              </strong>
            </div>

            {/* FINALIZAR */}

            <Link
              href={
                storeSlug
                  ? `/themes/market/checkout?storeSlug=${encodeURIComponent(storeSlug)}`
                  : "/themes/market/checkout"
              }
              className="mt-6 flex min-w-0 items-center justify-center rounded-xl bg-emerald-600 p-4 text-sm font-black text-white transition hover:bg-emerald-700"
            >
              Finalizar compra
            </Link>

            {/* LIMPAR */}

            <button
              type="button"
              onClick={clearCart}
              className="mt-4 w-full min-w-0 break-words text-xs font-bold text-slate-400 transition hover:text-red-500"
            >
              Limpar carrinho
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
