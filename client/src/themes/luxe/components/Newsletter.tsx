import { useState } from "react";

import { Sparkles } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] =
    useState("");
  const [sent, setSent] =
    useState(false);

  return (
    <section className="bg-[#f7f7f5] py-14">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white sm:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">
                <Sparkles className="h-4 w-4" />
                Luxe Insider
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Receba as melhores
                ofertas.
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
                Novidades, campanhas e
                descontos especiais diretamente
                para si.
              </p>
            </div>

            <div>
              <div className="flex overflow-hidden rounded-xl bg-white p-1">
                <div className="flex flex-1 items-center px-4 text-sm text-slate-400">
                  <input
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value,
                      )
                    }
                    type="email"
                    placeholder="O seu email"
                    className="w-full outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!email.trim()) {
                      return;
                    }

                    setSent(true);
                    setEmail("");
                  }}
                  className="rounded-lg bg-slate-950 px-5 py-3 text-xs font-black text-white"
                >
                  {sent
                    ? "SUBSCRITO!"
                    : "SUBSCREVER"}
                </button>
              </div>

              <p className="mt-3 text-[9px] text-white/35">
                Ao subscrever, concorda com os
                nossos termos de comunicação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
