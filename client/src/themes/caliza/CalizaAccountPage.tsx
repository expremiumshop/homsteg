import { useState } from "react";

import {
  CreditCard,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  UserPlus,
} from "lucide-react";

import { Link, useSearch } from "wouter";

import { trpc } from "@/lib/trpc";

import { useThemeFonts } from "./useThemeFonts";

import {
  calizaColors,
  calizaHeadingFont,
  calizaBodyFont,
} from "./theme";

export default function CalizaAccountPage() {
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
      `Olá, ${storeName}! Gostaria de obter informações sobre uma compra.`,
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

  const [
    openSection,
    setOpenSection,
  ] = useState<number | null>(
    null,
  );

  function toggleSection(index: number) {
    setOpenSection(
      openSection === index
        ? null
        : index,
    );
  }

  const sections = [
    {
      title: "Criar conta",
      icon: UserPlus,
      content: (
        <div className="space-y-4">
          <p>
            Nesta loja,{" "}
            <strong
              style={{
                color:
                  calizaColors.text,
              }}
            >
              não é necessário criar uma
              conta para realizar uma
              compra
            </strong>
            . O processo é simples e
            direto.
          </p>

          <p>
            Todo o processo de compra é
            acompanhado pela nossa equipa
            através do{" "}
            <strong
              style={{
                color:
                  calizaColors.text,
              }}
            >
              WhatsApp
            </strong>
            . É por esse canal que
            confirmamos as peças,
            disponibilidade, quantidades,
            dados de entrega, valores e
            formas de pagamento.
          </p>
        </div>
      ),
    },
    {
      title: "Produtos",
      icon: PackageCheck,
      content: (
        <div className="space-y-4">
          <p>
            Trabalhamos com peças
            selecionadas de ateliers
            independentes, escolhidas para
            durar mais do que uma estação.
          </p>

          <p>
            <strong
              style={{
                color:
                  calizaColors.text,
              }}
            >
              Não encontrou o que procura?
            </strong>{" "}
            Envie uma{" "}
            <strong
              style={{
                color:
                  calizaColors.text,
              }}
            >
              fotografia do produto
            </strong>{" "}
            para a nossa equipa através do
            WhatsApp. Iremos informar
            disponibilidade, preço e
            condições.
          </p>

          <button
            type="button"
            onClick={openWhatsApp}
            disabled={!whatsappNumber}
            className="flex w-full items-center justify-center gap-2.5 rounded-full px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background:
                calizaColors.primary,
              color:
                calizaColors.primaryContrast,
            }}
          >
            <MessageCircle size={15} />
            Enviar foto pelo WhatsApp
          </button>
        </div>
      ),
    },
    {
      title: "Como funciona o pagamento",
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <p>
            O processo de pagamento começa
            depois de escolher as peças.
            Navegue pela loja, consulte os
            detalhes e escolha a opção de
            compra.
          </p>

          <p>
            No checkout, preencha os dados
            de contacto e localização de
            entrega e envie o pedido pelo
            WhatsApp. A equipa entra em
            contacto consigo para confirmar
            os detalhes e orientar o
            pagamento.
          </p>
        </div>
      ),
    },
    {
      title: "Como chegar ao checkout",
      icon: ShoppingBag,
      content: (
        <div className="space-y-4">
          <p>
            O checkout é a etapa onde os
            dados necessários para preparar
            e enviar a sua encomenda são
            preenchidos.
          </p>

          <p>
            <strong
              style={{
                color:
                  calizaColors.text,
              }}
            >
              Dica:
            </strong>{" "}
            antes de enviar, verifique o
            nome, telefone, localização de
            entrega, peças e quantidades.
          </p>
        </div>
      ),
    },
    {
      title: "Confirmação do pedido",
      icon: PackageCheck,
      content: (
        <div className="space-y-4">
          <p>
            Depois de enviar o pedido pelo
            WhatsApp, a nossa equipa recebe
            as informações e inicia o
            processo de confirmação.
          </p>

          <p>
            <strong
              style={{
                color:
                  calizaColors.text,
              }}
            >
              Enviar o pedido não significa
              que o pagamento já foi
              realizado.
            </strong>{" "}
            O WhatsApp é utilizado para
            comunicação, confirmação e
            orientação das etapas
            seguintes.
          </p>
        </div>
      ),
    },
    {
      title: "Continuar para WhatsApp",
      icon: MessageCircle,
      content: (
        <div className="space-y-4">
          <p>
            O WhatsApp é o principal canal
            de atendimento para acompanhar
            o processo de compra: dúvidas,
            confirmação de informações e
            orientações de pagamento.
          </p>

          <button
            type="button"
            onClick={openWhatsApp}
            disabled={!whatsappNumber}
            className="flex w-full items-center justify-center gap-2.5 rounded-full px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background:
                calizaColors.primary,
              color:
                calizaColors.primaryContrast,
            }}
          >
            <MessageCircle size={15} />
            Continuar para WhatsApp
          </button>
        </div>
      ),
    },
  ];

  return (
    <main
      className="min-h-screen px-5 py-10 md:px-8 md:py-14"
      style={{
        background: calizaColors.bg,
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <section>
          {/* CABEÇALHO */}

          <div className="text-center">
            <p
              className="text-[11px] uppercase tracking-[0.28em]"
              style={{
                color:
                  calizaColors.accent,
              }}
            >
              Informações
            </p>

            <h1
              className="mt-3 text-3xl sm:text-4xl"
              style={{
                fontFamily:
                  calizaHeadingFont,
                fontWeight: 500,
                color:
                  calizaColors.text,
              }}
            >
              {storeName}
            </h1>

            <p
              className="mt-2 text-sm"
              style={{
                color:
                  calizaColors.textMuted,
              }}
            >
              Informações importantes para a
              sua compra.
            </p>
          </div>

          {/* SEÇÕES */}

          <div
            className="mt-10 divide-y rounded-2xl border"
            style={{
              borderColor:
                calizaColors.border,
            }}
          >
            {sections.map(
              (section, index) => {
                const Icon =
                  section.icon;

                const isOpen =
                  openSection ===
                  index;

                return (
                  <div
                    key={section.title}
                    style={{
                      borderColor:
                        calizaColors.border,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleSection(
                          index,
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:opacity-70"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <Icon
                          size={17}
                          strokeWidth={1.5}
                          className="shrink-0"
                          style={{
                            color:
                              calizaColors.text,
                          }}
                        />

                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                          {section.title}
                        </span>
                      </div>

                      {isOpen ? (
                        <Minus
                          size={15}
                          className="shrink-0"
                          style={{
                            color:
                              calizaColors.textMuted,
                          }}
                        />
                      ) : (
                        <Plus
                          size={15}
                          className="shrink-0"
                          style={{
                            color:
                              calizaColors.textMuted,
                          }}
                        />
                      )}
                    </button>

                    {isOpen && (
                      <div className="pb-6 pl-[38px] pr-5">
                        <div
                          className="text-sm leading-7"
                          style={{
                            color:
                              calizaColors.textMuted,
                          }}
                        >
                          {
                            section.content
                          }
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>

          {/* VOLTAR */}

          <div className="mt-10 text-center">
            <Link
              href={storePath}
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90"
              style={{
                background:
                  calizaColors.primary,
                color:
                  calizaColors.primaryContrast,
              }}
            >
              Voltar à loja
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
