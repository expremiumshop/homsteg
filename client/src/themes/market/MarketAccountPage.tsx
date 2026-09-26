import { useState } from "react";

import {
  ChevronDown,
  CreditCard,
  MessageCircle,
  PackageCheck,
  ShoppingCart,
  UserPlus,
} from "lucide-react";

import { Link, useSearch } from "wouter";

import { trpc } from "@/lib/trpc";

export default function MarketAccountPage() {
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
    (storeSlug ? "Loja" : "Market");

  const whatsappNumber =
    storeQuery.data?.store.whatsapp?.replace(
      /\D/g,
      "",
    );

  const storePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : "/themes/market";

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
            <strong className="font-black text-slate-950">
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
            <strong className="font-black text-slate-950">
              WhatsApp
            </strong>
            . É por esse canal que
            confirmamos os produtos,
            disponibilidade, quantidades,
            dados de entrega, valores e
            formas de pagamento.
          </p>

          <p>
            Basta escolher o produto na
            loja, preencher os dados no
            checkout e enviar o pedido pelo
            WhatsApp.
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
            Trabalhamos com produtos
            verificados e selecionados para
            atender às diferentes
            necessidades dos nossos
            clientes.
          </p>

          <p>
            <strong className="font-black text-slate-950">
              Não encontrou o produto que
              procura?
            </strong>{" "}
            Envie uma{" "}
            <strong className="font-black text-slate-950">
              foto do produto
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b3d2e] px-4 py-3.5 text-sm font-black text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MessageCircle className="h-4.5 w-4.5" />
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
            depois de escolher os produtos.
            Navegue pela loja, consulte os
            detalhes e escolha a opção de
            compra.
          </p>

          <p>
            Depois de adicionar ao carrinho
            ou selecionar{" "}
            <strong className="font-black text-slate-950">
              Comprar agora
            </strong>
            , será encaminhado para o
            checkout.
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
      icon: ShoppingCart,
      content: (
        <div className="space-y-4">
          <p>
            O checkout é a etapa onde os
            dados necessários para preparar
            e enviar a sua encomenda são
            preenchidos.
          </p>

          <p>
            <strong className="font-black text-slate-950">
              Dica:
            </strong>{" "}
            antes de enviar, verifique o
            nome, telefone, localização de
            entrega, produtos e
            quantidades.
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
            <strong className="font-black text-slate-950">
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b3d2e] px-4 py-3.5 text-sm font-black text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MessageCircle className="h-4.5 w-4.5" />
            Continuar para WhatsApp
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* CABEÇALHO */}

          <div className="px-6 py-7 md:px-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-600">
              Informações
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              {storeName}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Informações importantes para a
              sua compra.
            </p>
          </div>

          {/* SEÇÕES */}

          <div className="space-y-2.5 px-6 pb-7 md:px-8">
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
                    className="overflow-hidden rounded-2xl border border-slate-100"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleSection(
                          index,
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Icon className="h-4.5 w-4.5 shrink-0 text-emerald-600" />

                        <span className="text-sm font-black text-slate-950">
                          {section.title}
                        </span>
                      </div>

                      <ChevronDown
                        className={`h-4.5 w-4.5 shrink-0 text-slate-400 transition-transform ${
                          isOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                        <div className="text-sm leading-7 text-slate-500">
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

          <div className="px-6 pb-8 text-center md:px-8">
            <Link
              href={storePath}
              className="inline-flex items-center justify-center rounded-xl bg-[#0b3d2e] px-7 py-3.5 text-sm font-black text-white transition hover:bg-emerald-600"
            >
              Voltar à loja
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
