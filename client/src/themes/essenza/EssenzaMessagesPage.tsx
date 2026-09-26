import {
  Clock,
  HelpCircle,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

import { Link, useSearch } from "wouter";

import { trpc } from "@/lib/trpc";

import { useThemeFonts } from "./useThemeFonts";

export default function EssenzaMessagesPage() {
  useThemeFonts();

  const search = useSearch();

  const storeSlug =
    new URLSearchParams(search)
      .get("storeSlug")
      ?.trim();

  const storeQuery =
    trpc.stores.bySlug.useQuery(
      {
        slug: storeSlug ?? "",
      },
      {
        enabled:
          Boolean(storeSlug),
      },
    );

  const storeName =
    storeQuery.data?.store.name ??
    (storeSlug ? "Loja" : "Essenza");

  const whatsappNumber =
    storeQuery.data?.store.whatsapp?.replace(
      /\D/g,
      "",
    );

  const storePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : "/themes/essenza";

  const whatsappMessage =
    encodeURIComponent(
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
    <main className="min-h-screen bg-white px-5 py-10 md:px-8 md:py-14">
      <div
        className="mx-auto w-full max-w-2xl"
        style={{
          fontFamily:
            "'Inter', system-ui, sans-serif",
        }}
      >
        <section className="border border-neutral-200">
          {/* CABEÇALHO */}

          <div className="border-b border-neutral-100 px-7 py-9 text-center sm:px-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
              Atendimento
            </p>

            <h1
              className="mt-3 text-3xl text-neutral-950"
              style={{
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                fontWeight: 500,
              }}
            >
              Fale com a {storeName}
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Atendimento dedicado pelo
              WhatsApp.
            </p>
          </div>

          {/* CONTEÚDO */}

          <div className="space-y-8 px-7 py-9 sm:px-10">
            <p className="text-center text-sm leading-7 text-neutral-500">
              O nosso atendimento é realizado
              através do{" "}
              <strong className="font-medium text-neutral-950">
                WhatsApp
              </strong>
              . Através deste canal poderá
              falar diretamente com a nossa
              equipa e obter ajuda durante o
              processo de compra.
            </p>

            {/* INFORMAÇÕES */}

            <div className="divide-y divide-neutral-100 border-y border-neutral-100">
              <div className="flex items-start gap-3.5 py-5">
                <ShoppingBag
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-neutral-950"
                />

                <div className="min-w-0">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-950">
                    Dúvidas sobre produtos
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-neutral-500">
                    Pergunte sobre peças,
                    preços, disponibilidade,
                    tamanhos ou materiais.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 py-5">
                <HelpCircle
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-neutral-950"
                />

                <div className="min-w-0">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-950">
                    Ajuda durante a compra
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-neutral-500">
                    A nossa equipa pode ajudar
                    com o carrinho, checkout,
                    encomenda e outras dúvidas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 py-5">
                <Clock
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-neutral-950"
                />

                <div className="min-w-0">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-950">
                    Resposta da equipa
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-neutral-500">
                    Envie a sua mensagem e a
                    nossa equipa dará
                    continuidade ao atendimento.
                  </p>
                </div>
              </div>
            </div>

            {/* WHATSAPP */}

            <div className="bg-neutral-950 p-7 text-white">
              <h2
                className="text-xl"
                style={{
                  fontFamily:
                    "'Playfair Display', Georgia, serif",
                  fontWeight: 500,
                }}
              >
                Continuar para o WhatsApp
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Clique no botão abaixo para
                iniciar uma conversa com a
                nossa equipa.
              </p>

              <button
                type="button"
                onClick={openWhatsApp}
                disabled={!whatsappNumber}
                className="mt-6 flex w-full items-center justify-center gap-2.5 bg-white py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageCircle size={16} />
                Continuar para WhatsApp
              </button>
            </div>

            {/* VOLTAR */}

            <div className="pt-1 text-center">
              <Link
                href={storePath}
                className="inline-flex items-center justify-center border border-neutral-300 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-950 transition hover:border-neutral-950"
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
