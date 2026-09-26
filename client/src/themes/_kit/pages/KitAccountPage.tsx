import { useState } from "react";
import {
  MessageCircle,
  CreditCard,
  ShoppingCart,
  PackageCheck,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { Link, useSearch } from "wouter";

import { trpc } from "@/lib/trpc";

import { ThemeStyleScope } from "../ThemeStyleScope";
import type { ThemeConfig } from "../themeConfig";

export interface KitAccountPageProps {
  theme: ThemeConfig;
}

/**
 * ============================================================
 * CONTA DA _kit
 * ============================================================
 *
 * Espelho funcional da NovaAccountPage: informação sobre o
 * processo de compra em acordeão + WhatsApp.
 */
export function KitAccountPage({ theme }: KitAccountPageProps) {
  const search = useSearch();
  const storeSlug = new URLSearchParams(search).get("storeSlug")?.trim();

  const storeQuery = trpc.stores.bySlug.useQuery(
    { slug: storeSlug ?? "" },
    { enabled: Boolean(storeSlug) },
  );

  const storeName =
    storeQuery.data?.store.name ?? (storeSlug ? "Loja" : theme.name);
  const whatsappNumber = storeQuery.data?.store.whatsapp?.replace(/\D/g, "");

  const storePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : `/themes/${theme.key}`;

  const whatsappMessage = encodeURIComponent(
    `Olá, ${storeName}! Gostaria de obter informações sobre uma compra.`,
  );

  const [openSection, setOpenSection] = useState<number | null>(null);

  function toggleSection(index: number) {
    setOpenSection(openSection === index ? null : index);
  }

  function openWhatsApp() {
    if (!whatsappNumber) return;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const sections = [
    {
      title: "Criar conta",
      icon: UserPlus,
      content: (
        <div className="space-y-4">
          <p>
            Nesta loja, <strong>não é necessário criar uma conta para realizar
            uma compra</strong>. O processo é simples e direto, sem etapas
            desnecessárias de registo.
          </p>
          <p>
            Todo o processo de compra é acompanhado pela nossa equipa através
            do <strong>WhatsApp</strong>. É por esse canal que confirmamos os
            produtos, disponibilidade, quantidades, dados de entrega, valores
            e formas de pagamento.
          </p>
          <p>
            Basta escolher o produto na loja, preencher os dados necessários
            no checkout e enviar o pedido pelo WhatsApp.
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
            Trabalhamos para disponibilizar uma grande variedade de produtos
            para atender às diferentes necessidades dos nossos clientes.
          </p>
          <p>
            <strong>Não encontrou o produto que procura?</strong> Envie uma{" "}
            <strong>foto do produto</strong> para a nossa equipa através do
            WhatsApp. A partir da imagem, iremos analisar o produto e
            procurar uma solução para o seu pedido.
          </p>
          <button
            type="button"
            onClick={openWhatsApp}
            disabled={!whatsappNumber}
            className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "#16a34a", borderRadius: "var(--tk-radius)" }}
          >
            <MessageCircle className="h-5 w-5" />
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
            O processo de pagamento começa depois de escolher os produtos que
            deseja comprar. Depois de adicionar ao carrinho ou selecionar{" "}
            <strong>Comprar</strong>, será encaminhado para o checkout.
          </p>
          <p>
            No checkout, preencha os dados de contacto e localização para
            entrega e envie o pedido pelo WhatsApp.
          </p>
          <p>
            A equipa entra em contacto consigo para confirmar os detalhes da
            compra e orientar sobre o pagamento.
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
            O checkout é a etapa onde os dados necessários para preparar e
            enviar a sua encomenda são preenchidos.
          </p>
          <p>
            Escolha o produto, clique em <strong>Comprar</strong> ou adicione
            ao carrinho e avance para finalizar a compra.
          </p>
          <p>
            <strong>Dica:</strong> antes de enviar, verifique o nome, número
            de telefone, localização de entrega, produtos e quantidades.
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
            Depois de enviar o pedido pelo WhatsApp, a nossa equipa recebe as
            informações da sua compra e inicia o processo de confirmação.
          </p>
          <p>
            <strong>
              Enviar o pedido pelo checkout não significa que o pagamento já
              foi realizado.
            </strong>{" "}
            O WhatsApp é utilizado para a comunicação, confirmação e
            orientação das etapas seguintes.
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
            O WhatsApp é o principal canal de atendimento utilizado para
            acompanhar o processo de compra.
          </p>
          <p>
            <strong>Quer continuar?</strong> Clique no botão abaixo para abrir
            o WhatsApp e iniciar a conversa.
          </p>
          <button
            type="button"
            onClick={openWhatsApp}
            disabled={!whatsappNumber}
            className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "#16a34a", borderRadius: "var(--tk-radius)" }}
          >
            <MessageCircle className="h-5 w-5" />
            Continuar para WhatsApp
          </button>
        </div>
      ),
    },
  ];

  return (
    <ThemeStyleScope theme={theme}>
      <main className="min-h-screen px-4 py-8">
        <div className="mx-auto w-full max-w-3xl">
          <section
            className="overflow-hidden border shadow-sm"
            style={{
              background: "var(--tk-surface)",
              borderColor: "var(--tk-border)",
              borderRadius: "var(--tk-card-radius)",
            }}
          >
            <div
              className="border-b px-5 py-6 sm:px-8"
              style={{ borderColor: "var(--tk-border)" }}
            >
              <h1 className="text-2xl font-bold tracking-tight text-[var(--tk-text)] sm:text-3xl">
                {storeName}
              </h1>
              <p className="mt-2 text-sm text-[var(--tk-muted)]">
                Informações importantes para a sua compra
              </p>
            </div>

            <div className="px-5 py-6 sm:px-8">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-[var(--tk-text)]">
                  Informações
                </h2>
                <p className="mt-1 text-sm text-[var(--tk-muted)]">
                  Saiba mais sobre o processo de compra e atendimento.
                </p>
              </div>

              <div className="space-y-3">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isOpen = openSection === index;

                  return (
                    <div
                      key={section.title}
                      className="overflow-hidden border"
                      style={{
                        borderColor: "var(--tk-border)",
                        borderRadius: "var(--tk-radius)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(index)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-black/[0.03]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Icon className="h-5 w-5 shrink-0 text-[var(--tk-muted)]" />
                          <span className="text-sm font-semibold text-[var(--tk-text)]">
                            {section.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-[var(--tk-muted)] transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div
                          className="border-t px-4 pb-5 pt-4"
                          style={{ borderColor: "var(--tk-border)" }}
                        >
                          <div className="text-sm leading-7 text-[var(--tk-muted)]">
                            {section.content}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                className="mt-7 border-t pt-6 text-center"
                style={{ borderColor: "var(--tk-border)" }}
              >
                <Link
                  href={storePath}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold shadow-sm transition hover:opacity-90"
                  style={{
                    background: "var(--tk-primary)",
                    color: "var(--tk-primary-contrast)",
                    borderRadius: "var(--tk-radius)",
                  }}
                >
                  Voltar à loja
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ThemeStyleScope>
  );
}

export default KitAccountPage;
