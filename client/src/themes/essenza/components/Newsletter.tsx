import { FormEvent, useState } from "react";

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
    <section className="border-y border-neutral-100 bg-white">
      <div className="mx-auto w-full max-w-xl px-5 py-16 text-center sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
          Newsletter
        </p>

        <h2
          className="mt-3 text-2xl text-neutral-950 sm:text-3xl"
          style={{
            fontFamily:
              "'Playfair Display', Georgia, serif",
            fontWeight: 500,
          }}
        >
          Fique perto do essencial
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-500">
          Receba com moderação: novidades,
          lançamentos e acesso antecipado às
          nossas coleções.
        </p>

        {subscribed ? (
          <p className="mt-8 border border-neutral-200 px-6 py-4 text-sm text-neutral-950">
            Obrigado. A sua subscrição foi
            confirmada.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md items-end gap-3"
          >
            <div className="min-w-0 flex-1 text-left">
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="O seu email"
                className="w-full border-b border-neutral-300 bg-transparent px-1 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
              />
            </div>

            <button
              type="submit"
              className="shrink-0 border border-neutral-950 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
            >
              Subscrever
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Newsletter;
