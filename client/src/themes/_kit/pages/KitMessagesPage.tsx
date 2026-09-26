import {
  MessageCircle,
  Clock,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";
import { Link, useSearch } from "wouter";

import { trpc } from "@/lib/trpc";

import { ThemeStyleScope } from "../ThemeStyleScope";
import type { ThemeConfig } from "../themeConfig";

export interface KitMessagesPageProps {
  theme: ThemeConfig;
}

/**
 * ============================================================
 * ATENDIMENTO DA _kit
 * ============================================================
 *
 * Espelho funcional da NovaMessagesPage: atendimento por
 * WhatsApp com contexto da loja pela querystring.
 */
export function KitMessagesPage({ theme }: KitMessagesPageProps) {
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
    `Olá, ${storeName}! Gostaria de falar com o atendimento.`,
  );

  function openWhatsApp() {
    if (!whatsappNumber) return;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

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
            {/* cabeçalho */}
            <div
              className="border-b px-5 py-6 sm:px-8"
              style={{ borderColor: "var(--tk-border)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center"
                  style={{
                    borderRadius: "var(--tk-radius)",
                    background:
                      "color-mix(in srgb, var(--tk-primary) 12%, transparent)",
                    color: "var(--tk-primary)",
                  }}
                >
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--tk-text)] sm:text-3xl">
                    Atendimento
                  </h1>
                  <p className="mt-1 text-sm text-[var(--tk-muted)]">
                    Fale com a equipa da {storeName} pelo WhatsApp
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-[var(--tk-text)]">
                    Atendimento pelo WhatsApp
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--tk-muted)]">
                    O nosso atendimento é realizado através do{" "}
                    <strong>WhatsApp</strong>. Através deste canal poderá falar
                    diretamente com a nossa equipa e obter ajuda durante o
                    processo de compra.
                  </p>
                </div>

                {/* informações */}
                <div className="space-y-3">
                  {[
                    {
                      icon: ShoppingBag,
                      title: "Dúvidas sobre produtos",
                      text: "Pergunte sobre produtos, preços, disponibilidade, tamanhos, cores ou outras características.",
                    },
                    {
                      icon: HelpCircle,
                      title: "Ajuda durante a compra",
                      text: "A nossa equipa pode ajudar com o carrinho, checkout, encomenda e outras dúvidas relacionadas com a compra.",
                    },
                    {
                      icon: Clock,
                      title: "Atendimento",
                      text: "Envie a sua mensagem pelo WhatsApp e a nossa equipa dará continuidade ao atendimento.",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="flex items-start gap-3 p-4"
                        style={{
                          borderRadius: "var(--tk-radius)",
                          background: "var(--tk-bg)",
                        }}
                      >
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--tk-muted)]" />
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--tk-text)]">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-[var(--tk-muted)]">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* WhatsApp */}
                <div
                  className="p-5"
                  style={{
                    borderRadius: "var(--tk-card-radius)",
                    background:
                      "color-mix(in srgb, #16a34a 10%, var(--tk-surface))",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-[var(--tk-text)]">
                        Continuar para o WhatsApp
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-[var(--tk-muted)]">
                        Clique no botão abaixo para iniciar uma conversa com a
                        nossa equipa.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openWhatsApp}
                    disabled={!whatsappNumber}
                    className="mt-5 flex w-full items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ background: "#16a34a", borderRadius: "var(--tk-radius)" }}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Continuar para WhatsApp
                  </button>
                </div>

                {/* voltar */}
                <div
                  className="border-t pt-6 text-center"
                  style={{ borderColor: "var(--tk-border)" }}
                >
                  <Link
                    href={storePath}
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition hover:opacity-90"
                    style={{
                      background: "var(--tk-bg)",
                      color: "var(--tk-text)",
                      borderRadius: "var(--tk-radius)",
                      border: "1px solid var(--tk-border)",
                    }}
                  >
                    Voltar à loja
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ThemeStyleScope>
  );
}

export default KitMessagesPage;
