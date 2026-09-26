import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";

import { useCart } from "@/contexts/CartContext";

import {
  formatPrice,
  primeFreeShippingThreshold,
  primeShippingFee,
} from "../demoData";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  storeSlug?: string;
};

export function CartDrawer({
  open,
  onClose,
  storeSlug,
}: CartDrawerProps) {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    total,
  } = useCart();

  const subtotal = total;

  const shipping =
    subtotal >=
      primeFreeShippingThreshold ||
    subtotal === 0
      ? 0
      : primeShippingFee;

  const cartTotal = subtotal + shipping;

  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Seu carrinho
            </h2>

            <p className="text-xs text-slate-400">
              {cart.length}{" "}
              {cart.length === 1
                ? "produto"
                : "produtos"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <ShoppingCart className="h-8 w-8 text-slate-400" />
              </div>

              <h3 className="mt-5 text-lg font-black text-slate-900">
                O seu carrinho está vazio
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                Adicione alguns produtos e eles
                aparecerão aqui.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl bg-slate-50 p-3"
                >
                  <img
                    src={
                      item.image_url ||
                      "/placeholder.svg"
                    }
                    alt={item.name}
                    className="h-24 w-20 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
                        {item.name}
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.id,
                          )
                        }
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {item.variants &&
                      Object.keys(
                        item.variants,
                      ).length > 0 && (
                        <p className="mt-1 text-xs text-slate-400">
                          {Object.entries(
                            item.variants,
                          )
                            .map(
                              ([name, value]) =>
                                `${name}: ${value}`,
                            )
                            .join(" · ")}
                        </p>
                      )}

                    <p className="mt-2 font-black text-slate-950">
                      {formatPrice(
                        Number(item.price),
                      )}
                    </p>

                    <div className="mt-2 flex w-fit items-center rounded-lg bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="w-8 text-center text-xs font-bold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-slate-100 p-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>

                <span>
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Entrega</span>

                <span>
                  {shipping === 0
                    ? "Grátis"
                    : formatPrice(shipping)}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-black text-slate-950">
                <span>Total</span>

                <span>
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            <a
              href={`/themes/prime/checkout${storeContext}`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-sm font-black text-white transition hover:bg-orange-600"
            >
              Finalizar compra
              <ArrowRight className="h-4 w-4" />
            </a>

            {subtotal <
              primeFreeShippingThreshold && (
              <p className="mt-3 text-center text-[11px] text-slate-400">
                Adicione mais{" "}
                {formatPrice(
                  primeFreeShippingThreshold -
                    subtotal,
                )}{" "}
                para ganhar envio grátis.
              </p>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
