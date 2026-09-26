import { useState } from "react";

import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) return;

    setSent(true);
    setEmail("");
  };

  return (
    <section className="bg-slate-950 px-4 py-14 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            Prime Club
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Ofertas especiais direto no seu e-mail.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Receba novidades, lançamentos e oportunidades
            selecionadas antes de todo mundo.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              type="email"
              placeholder="Seu melhor e-mail"
              className="h-12 w-full rounded-xl bg-white pl-11 pr-4 text-sm text-slate-900 outline-none"
            />
          </div>

          <button
            type="submit"
            className="h-12 rounded-xl bg-orange-500 px-6 text-sm font-black transition hover:bg-orange-600"
          >
            {sent ? "Inscrito!" : "Quero receber"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
