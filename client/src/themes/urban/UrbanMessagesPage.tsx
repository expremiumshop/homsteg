import {
  Clock,
  HelpCircle,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

import { Link, useSearch } from "wouter";

import { trpc } from "@/lib/trpc";

export default function UrbanMessagesPage() {
  const search = useSearch();

  const storeSlug = new URLSearchParams(search)
    .get("storeSlug")
    ?.trim();

  const storeQuery = trpc.stores.bySlug.useQuery(
    { slug: storeSlug ?? "" },
    { enabled: Boolean(storeSlug) },
  );

  const storeName =
    storeQuery.data?.store.name ??
    (storeSlug ? "Loja" : "Urban");

  const whatsappNumber =
    storeQuery.data?.store.whatsapp?.replace(/\D/g, "");

  const storePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : "/themes/urban";

  const whatsappMessage = encodeURIComponent(
    `Olá, ${storeName}! Gostaria de falar com o atendimento.`,
  );

  function openWhatsApp() {
    if (!whatsappNumber) {
      return;
    }

    window.open(
      `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <main className="min-h-screen bg-white px-5 py-8 md:px-8 md:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <section className="overflow-hidden rounded-[28px] bg-neutral-100">
          {/* CABEÇALHO */}
          <div className="flex items-center gap-3.5 px-6 py-7 md:px-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
              <MessageCircle className="h-5.5 w-5.5" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Atendimento
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-neutral-950 md:text-3xl">
                Fale com a {storeName}
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Atendimento rápido pelo WhatsApp.
              </p>
            </div>
          </div>

          {/* CONTEÚDO */}
          <div className="space-y-6 px-6 pb-8 md:px-8">
            <p className="text-sm leading-7 text-neutral-500">
              O nosso atendimento é realizado através
              do{" "}
              <strong className="font-bold text-neutral-950">
                WhatsApp
              </strong>
              . Através deste canal poderá falar
              diretamente com a nossa equipa e obter
              ajuda durante o processo de compra.
            </p>

            {/* INFORMAÇÕES */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 rounded-3xl bg-white p-5">
                <ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-neutral-950" />

                <div>
                  <h3 className="text-sm font-black text-neutral-950">
                    Dúvidas sobre produtos
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Pergunte sobre produtos, preços,
                    disponibilidade, tamanhos, cores ou
                    outras características.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-3xl bg-white p-5">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-neutral-950" />

                <div>
                  <h3 className="text-sm font-black text-neutral-950">
                    Ajuda durante a compra
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    A nossa equipa pode ajudar com o
                    carrinho, checkout, encomenda e
                    outras dúvidas da compra.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-3xl bg-white p-5">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-neutral-950" />

                <div>
                  <h3 className="text-sm font-black text-neutral-950">
                    Resposta da equipa
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Envie a sua mensagem e a nossa
                    equipa dará continuidade ao
                    atendimento.
                  </p>
                </div>
              </div>
            </div>

            {/* WHATSAPP */}
            <div className="rounded-3xl bg-neutral-950 p-6 text-white">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-neutral-950">
                  <MessageCircle className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-black">
                    Continuar para o WhatsApp
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-white/60">
                    Clique no botão abaixo para
                    iniciar uma conversa com a nossa
                    equipa.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openWhatsApp}
                disabled={!whatsappNumber}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageCircle className="h-4.5 w-4.5" />
                Continuar para WhatsApp
              </button>
            </div>

            {/* VOLTAR */}
            <div className="pt-1 text-center">
              <Link
                href={storePath}
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200"
              >
                Voltar à loja
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
