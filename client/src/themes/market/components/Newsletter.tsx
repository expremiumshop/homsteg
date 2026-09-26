import { FormEvent, useState } from "react";

import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] =
    useState(false);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubscribed(true);

    setEmail("");
  }

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid gap-6 p-6 sm:p-10 md:grid-cols-2 md:items-center">
          <div className="min-w-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Mail size={22} />
            </div>

            <h2 className="mt-4 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              Receba as melhores ofertas
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Subscreva e seja o primeiro a saber
              sobre descontos, novidades e
              promoções exclusivas do Market.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div className="rounded-xl bg-emerald-50 p-5 text-center">
                <p className="text-sm font-black text-emerald-700">
                  Subscrição confirmada!
                </p>

                <p className="mt-1 text-xs text-emerald-600/80">
                  Vai receber as nossas ofertas no
                  seu email.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2.5 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="O seu melhor email"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                />

                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-black text-white transition hover:bg-emerald-700"
                >
                  Subscrever
                </button>
              </form>
            )}

            <p className="mt-2.5 text-[11px] leading-4 text-slate-300">
              Ao subscrever, concorda em receber
              comunicações de marketing. Pode
              cancelar quando quiser.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
