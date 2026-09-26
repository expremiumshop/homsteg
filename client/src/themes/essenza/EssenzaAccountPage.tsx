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

export default function EssenzaAccountPage() {
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
            <strong className="font-medium text-neutral-950">
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
            <strong className="font-medium text-neutral-950">
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
            selecionadas e verificadas,
            escolhidas para durar mais do
            que uma estação.
          </p>

          <p>
            <strong className="font-medium text-neutral-950">
              Não encontrou o que procura?
            </strong>{" "}
            Envie uma{" "}
            <strong className="font-medium text-neutral-950">
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
            className="flex w-full items-center justify-center gap-2.5 bg-neutral-950 px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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
            <strong className="font-medium text-neutral-950">
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
            <strong className="font-medium text-neutral-950">
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
            className="flex w-full items-center justify-center gap-2.5 bg-neutral-950 px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MessageCircle size={15} />
            Continuar para WhatsApp
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-white px-5 py-10 md:px-8 md:py-14">
      <div
        className="mx-auto w-full max-w-2xl"
        style={{
          fontFamily:
            "'Inter', system-ui, sans-serif",
        }}
      >
        <section>
          {/* CABEÇALHO */}

          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
              Informações
            </p>

            <h1
              className="mt-3 text-3xl text-neutral-950 sm:text-4xl"
              style={{
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                fontWeight: 500,
              }}
            >
              {storeName}
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Informações importantes para a
              sua compra.
            </p>
          </div>

          {/* SEÇÕES */}

          <div className="mt-10 divide-y divide-neutral-100 border-y border-neutral-100">
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
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleSection(
                          index,
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:opacity-70"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <Icon
                          size={17}
                          strokeWidth={1.5}
                          className="shrink-0 text-neutral-950"
                        />

                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-950">
                          {section.title}
                        </span>
                      </div>

                      {isOpen ? (
                        <Minus
                          size={15}
                          className="shrink-0 text-neutral-400"
                        />
                      ) : (
                        <Plus
                          size={15}
                          className="shrink-0 text-neutral-400"
                        />
                      )}
                    </button>

                    {isOpen && (
                      <div className="pb-6 pl-[34px] pr-2">
                        <div className="text-sm leading-7 text-neutral-500">
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
              className="inline-flex items-center justify-center bg-neutral-950 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-800"
            >
              Voltar à loja
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
