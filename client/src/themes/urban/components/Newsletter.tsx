import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-[760px] text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
          Fique por dentro
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-neutral-950 md:text-5xl">
          Receba novidades primeiro.
        </h2>

        <p className="mx-auto mt-5 max-w-[520px] text-sm leading-7 text-neutral-500 md:text-base">
          Novos produtos, coleções e ofertas diretamente no
          seu email.
        </p>

        <div className="mx-auto mt-8 flex max-w-[560px] flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Seu melhor email"
            className="h-13 flex-1 rounded-full bg-neutral-100 px-5 text-sm text-neutral-950 outline-none ring-0 placeholder:text-neutral-400 focus:bg-neutral-200"
          />

          <button
            type="button"
            className="h-13 rounded-full bg-neutral-950 px-7 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            Quero receber
          </button>
        </div>
      </div>
    </section>
  );
}
