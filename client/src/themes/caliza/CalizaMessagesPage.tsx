import {
  Clock,
  HelpCircle,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

import { Link, useSearch } from "wouter";

import { trpc } from "@/lib/trpc";

import { useThemeFonts } from "./useThemeFonts";

import {
  calizaColors,
  calizaHeadingFont,
  calizaBodyFont,
} from "./theme";

export default function CalizaMessagesPage() {
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
    (storeSlug ? "Loja" : "Caliza Studio");

  const whatsappNumber =
    storeQuery.data?.store.whatsapp?.replace(
      /\D/g,
      "",
    );

  const storePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : "/themes/caliza";

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
    <main
      className="min-h-screen px-5 py-10 md:px-8 md:py-14"
      style={{
        background: calizaColors.bg,
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <section
          className="overflow-hidden rounded-2xl border"
          style={{
            background:
              calizaColors.surface,
            borderColor:
              calizaColors.border,
          }}
        >
          {/* CABEÇALHO */}

          <div
            className="border-b px-7 py-9 text-center sm:px-10"
            style={{
              borderColor:
                calizaColors.border,
            }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.28em]"
              style={{
                color:
                  calizaColors.accent,
              }}
            >
              Atendimento
            </p>

            <h1
              className="mt-3 text-3xl"
              style={{
                fontFamily:
                  calizaHeadingFont,
                fontWeight: 500,
                color:
                  calizaColors.text,
              }}
            >
              Fale com a {storeName}
            </h1>

            <p
              className="mt-2 text-sm"
              style={{
                color:
                  calizaColors.textMuted,
              }}
            >
              Atendimento dedicado pelo
              WhatsApp.
            </p>
          </div>

          {/* CONTEÚDO */}

          <div className="space-y-8 px-7 py-9 sm:px-10">
            <p
              className="text-center text-sm leading-7"
              style={{
                color:
                  calizaColors.textMuted,
              }}
            >
              O nosso atendimento é realizado
              através do{" "}
              <strong
                style={{
                  color:
                    calizaColors.text,
                }}
              >
                WhatsApp
              </strong>
              . Através deste canal poderá
              falar diretamente com a nossa
              equipa e obter ajuda durante o
              processo de compra.
            </p>

            {/* INFORMAÇÕES */}

            <div
              className="divide-y rounded-2xl border"
              style={{
                borderColor:
                  calizaColors.border,
              }}
            >
              <div
                className="flex items-start gap-3.5 py-5"
                style={{
                  borderColor:
                    calizaColors.border,
                }}
              >
                <ShoppingBag
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0"
                  style={{
                    color:
                      calizaColors.text,
                  }}
                />

                <div className="min-w-0">
                  <h3
                    className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{
                      color:
                        calizaColors.text,
                    }}
                  >
                    Dúvidas sobre peças
                  </h3>

                  <p
                    className="mt-1.5 text-sm leading-6"
                    style={{
                      color:
                        calizaColors.textMuted,
                    }}
                  >
                    Pergunte sobre peças,
                    preços, disponibilidade,
                    tamanhos ou materiais.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-3.5 py-5"
                style={{
                  borderColor:
                    calizaColors.border,
                }}
              >
                <HelpCircle
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0"
                  style={{
                    color:
                      calizaColors.text,
                  }}
                />

                <div className="min-w-0">
                  <h3
                    className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{
                      color:
                        calizaColors.text,
                    }}
                  >
                    Ajuda durante a compra
                  </h3>

                  <p
                    className="mt-1.5 text-sm leading-6"
                    style={{
                      color:
                        calizaColors.textMuted,
                    }}
                  >
                    A nossa equipa pode ajudar
                    com o carrinho, checkout,
                    encomenda e outras dúvidas.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-3.5 py-5"
                style={{
                  borderColor:
                    calizaColors.border,
                }}
              >
                <Clock
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0"
                  style={{
                    color:
                      calizaColors.text,
                  }}
                />

                <div className="min-w-0">
                  <h3
                    className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{
                      color:
                        calizaColors.text,
                    }}
                  >
                    Resposta da equipa
                  </h3>

                  <p
                    className="mt-1.5 text-sm leading-6"
                    style={{
                      color:
                        calizaColors.textMuted,
                    }}
                  >
                    Envie a sua mensagem e a
                    nossa equipa dará
                    continuidade ao atendimento.
                  </p>
                </div>
              </div>
            </div>

            {/* WHATSAPP */}

            <div
              className="rounded-2xl p-7"
              style={{
                background:
                  calizaColors.footerBg,
                color:
                  calizaColors.footerText,
              }}
            >
              <h2
                className="text-xl"
                style={{
                  fontFamily:
                    calizaHeadingFont,
                  fontWeight: 500,
                }}
              >
                Continuar para o WhatsApp
              </h2>

              <p className="mt-2 text-sm leading-6 opacity-75">
                Clique no botão abaixo para
                iniciar uma conversa com a
                nossa equipa.
              </p>

              <button
                type="button"
                onClick={openWhatsApp}
                disabled={!whatsappNumber}
                className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-white py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  color:
                    calizaColors.text,
                }}
              >
                <MessageCircle size={16} />
                Continuar para WhatsApp
              </button>
            </div>

            {/* VOLTAR */}

            <div className="pt-1 text-center">
              <Link
                href={storePath}
                className="inline-flex items-center justify-center rounded-full border px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-80"
                style={{
                  borderColor:
                    calizaColors.border,
                  color:
                    calizaColors.text,
                }}
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
