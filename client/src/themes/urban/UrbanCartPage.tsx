import { Link, useSearch } from "wouter";

import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCart } from "@/contexts/CartContext";

import {
  formatPriceMzn,
} from "./demoData";

export default function UrbanCartPage() {
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
    : "/themes/urban";

  /*
   * CARRINHO VAZIO
   */
  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen min-w-0 items-center justify-center overflow-x-hidden bg-white p-6">
        <div className="w-full min-w-0 max-w-md text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
            <ShoppingBag className="h-9 w-9 text-neutral-950" />
          </div>

          <h1 className="min-w-0 max-w-full break-words text-3xl font-black tracking-[-0.035em] text-neutral-950 [overflow-wrap:anywhere]">
            Seu carrinho está vazio
          </h1>

          <p className="mt-2 min-w-0 max-w-full break-words text-sm text-neutral-500 [overflow-wrap:anywhere]">
            Adicione produtos para
            continuar.
          </p>

          <Link
            href={backToStorePath}
            className="mt-6 inline-block rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            Continuar comprando
          </Link>
        </div>
      </main>
    );
  }

  /*
   * PÁGINA DO CARRINHO
   */
  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-white px-5 py-8 md:px-8 md:py-12">
      <div className="mx-auto w-full min-w-0 max-w-5xl">
        {/* TÍTULO */}
        <div className="mb-8 min-w-0">
          <Link
            href={backToStorePath}
            className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-neutral-400 transition hover:text-neutral-950"
          >
            ← Voltar à loja
          </Link>

          <h1 className="min-w-0 max-w-full break-words text-3xl font-black tracking-[-0.035em] text-neutral-950 [overflow-wrap:anywhere] md:text-4xl">
            Carrinho de compras
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
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
                  className="flex min-w-0 flex-col gap-4 rounded-[24px] bg-neutral-100 p-4 sm:flex-row sm:items-center sm:gap-5"
                >
                  {/* IMAGEM */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white">
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  {/* INFORMAÇÕES */}
                  <div className="min-w-0 flex-1">
                    <h2 className="min-w-0 max-w-full break-words text-base font-black text-neutral-950 [overflow-wrap:anywhere]">
                      {item.name}
                    </h2>

                    <p className="mt-1 min-w-0 break-words text-sm font-bold text-neutral-950">
                      {formatPriceMzn(
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
                        <div className="mt-2 min-w-0 max-w-full space-y-1 break-words text-xs text-neutral-500 [overflow-wrap:anywhere]">
                          {Object.entries(
                            item.variants,
                          ).map(
                            ([
                              name,
                              value,
                            ]) => (
                              <div
                                key={
                                  name
                                }
                                className="min-w-0 max-w-full break-words [overflow-wrap:anywhere]"
                              >
                                <strong className="font-bold text-neutral-700">
                                  {
                                    name
                                  }
                                  :
                                </strong>{" "}
                                {value}
                              </div>
                            ),
                          )}
                        </div>
                      )}

                    {/* QUANTIDADE */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity -
                              1,
                          )
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-neutral-900 transition hover:bg-neutral-200"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="min-w-[28px] text-center text-sm font-black text-neutral-950">
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
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-neutral-900 transition hover:bg-neutral-200"
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
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-neutral-400 transition hover:text-neutral-950"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remover
                    </button>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="min-w-0 shrink-0 sm:self-start">
                    <strong className="block max-w-full break-words text-left text-base font-black text-neutral-950 sm:text-right">
                      {formatPriceMzn(
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
          <aside className="h-fit min-w-0 rounded-[24px] bg-neutral-100 p-6 lg:sticky lg:top-24">
            <h2 className="min-w-0 break-words text-xl font-black tracking-[-0.03em] text-neutral-950">
              Resumo
            </h2>

            <div className="mt-5 flex min-w-0 items-center justify-between gap-4 text-sm">
              <span className="shrink-0 text-neutral-500">
                Subtotal
              </span>

              <strong className="min-w-0 break-words text-right font-black text-neutral-950">
                {formatPriceMzn(
                  total,
                )}
              </strong>
            </div>

            <div className="mt-2 flex min-w-0 items-center justify-between gap-4 text-sm">
              <span className="shrink-0 text-neutral-500">
                Entrega
              </span>

              <span className="min-w-0 text-right font-semibold text-neutral-500">
                Calculada no checkout
              </span>
            </div>

            <div className="mt-4 border-t border-neutral-200 pt-4">
              <div className="flex min-w-0 items-center justify-between gap-4">
                <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">
                  Total
                </span>

                <strong className="min-w-0 break-words text-right text-xl font-black text-neutral-950">
                  {formatPriceMzn(
                    total,
                  )}
                </strong>
              </div>
            </div>

            {/* FINALIZAR */}
            <Link
              href={
                storeSlug
                  ? `/themes/urban/checkout?storeSlug=${encodeURIComponent(storeSlug)}`
                  : "/themes/urban/checkout"
              }
              className="mt-6 block min-w-0 rounded-full bg-neutral-950 p-4 text-center text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Finalizar compra
            </Link>

            {/* LIMPAR */}
            <button
              type="button"
              onClick={clearCart}
              className="mt-4 w-full min-w-0 break-words text-xs font-bold uppercase tracking-[0.08em] text-neutral-400 transition hover:text-neutral-950"
            >
              Limpar carrinho
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
