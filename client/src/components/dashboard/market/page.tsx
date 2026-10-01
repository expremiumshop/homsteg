import {
  Check,
  ChevronLeft,
  Compass,
  Images,
  LayoutGrid,
  MousePointerClick,
  Package,
  Palette,
  PanelBottom,
  Store,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

import type {
  MarketSectionKind,
  MarketFeature,
} from "./registry";
import { getMarketVariants } from "./registry";

/* =========================================================
   MARKET — PÁGINA PRINCIPAL (sistema de categorias)
   Módulo isolado do dashboard.

   A página principal mostra CARTÕES DE CATEGORIA.
   Ao clicar num cartão, o utilizador entra numa vista
   dedicada que mostra APENAS os modelos dessa categoria
   (troca de vista por estado interno — sem rotas novas).

   Cada modelo continua a renderizar o SEU próprio código
   isolado, pela ordem numérica definida no catálogo
   partilhado (shared/market-catalog.ts).

   A estrutura (variantes) vem do registry; o conteúdo
   comercial (nome, descrição, preço em créditos e
   status) vem SEMPRE da base de dados (market.features).
   Nenhum preço é definido aqui. Se a base de dados
   estiver indisponível, os modelos continuam visíveis.
   ========================================================= */

type FeatureMap = Record<
  string,
  MarketFeature | undefined
>;

/*
 * Cartões da página principal, pela ordem pretendida:
 * Banners → Botões → Navegação → Cartões de Produto →
 * Seções → Temas (link para a página existente) →
 * Rodapés (outras categorias existentes).
 */
type MarketHomeCard =
  | {
      type: "category";
      kind: MarketSectionKind;
      title: string;
      description: string;
      icon: typeof Compass;
    }
  | {
      type: "themes";
      title: string;
      description: string;
      icon: typeof Compass;
    };

const MARKET_HOME_CARDS: MarketHomeCard[] = [
  {
    type: "category",
    kind: "banner",
    title: "Banners",
    description:
      "Banners promocionais e carrosséis do topo da loja.",
    icon: Images,
  },
  {
    type: "category",
    kind: "nav_button",
    title: "Botões",
    description:
      "Botões de navegação mobile da barra inferior.",
    icon: MousePointerClick,
  },
  {
    type: "category",
    kind: "header",
    title: "Navegação",
    description:
      "Menus e cabeçalhos de navegação da loja.",
    icon: Compass,
  },
  {
    type: "category",
    kind: "product_card",
    title: "Cartões de Produto",
    description:
      "Como os produtos aparecem na vitrine da loja.",
    icon: Package,
  },
  {
    type: "category",
    kind: "category_card",
    title: "Seções",
    description:
      "Seções de categorias em destaque na loja.",
    icon: LayoutGrid,
  },
  {
    type: "themes",
    title: "Temas",
    description: "Temas e design completo da loja.",
    icon: Palette,
  },
  {
    type: "category",
    kind: "footer",
    title: "Rodapés",
    description: "Rodapés do fundo da loja.",
    icon: PanelBottom,
  },
];

/* Rota existente do dashboard (Design e temas). */
const THEMES_PATH = "/store/themes";

export default function MarketPage({
  storeId,
}: {
  storeId?: string;
}) {
  /*
   * Categoria aberta. null = página principal
   * (cartões de categoria). A troca de vista é feita
   * por estado interno — sem alterar rotas.
   */
  const [selectedCategory, setSelectedCategory] =
    useState<MarketSectionKind | null>(null);

  /*
   * Funcionalidades Market ativas com preços em créditos.
   * Fonte: tabela market_features (Neon).
   */
  const featuresQuery = trpc.market.features.useQuery();

  const featuresByKey = useMemo<FeatureMap>(() => {
    const map: FeatureMap = {};

    for (const feature of featuresQuery.data ?? []) {
      map[feature.featureKey] = feature;
    }

    return map;
  }, [featuresQuery.data]);

  /*
   * Compras/desbloqueios da loja (store_market_features).
   * Fonte de verdade: base de dados — nunca localStorage.
   */
  const purchasesQuery = trpc.market.purchases.mine.useQuery(
    { storeId: storeId ?? "" },
    {
      enabled: Boolean(storeId),
    },
  );

  const ownedKeys = useMemo(
    () =>
      new Set(purchasesQuery.data?.featureKeys ?? []),
    [purchasesQuery.data],
  );

  const utils = trpc.useUtils();

  const buyFeature =
    trpc.market.purchases.buy.useMutation({
      onSuccess: async (result) => {
        toast.success(
          `"${result.purchase.name}" comprada por ${result.purchase.priceCredits} créditos. Já disponível na Personalização da loja.`,
        );

        await Promise.all([
          utils.market.purchases.mine.invalidate(),
          utils.stores.usage.current.invalidate(),
        ]);
      },
      onError: (error) => {
        toast.error(
          error.message ||
            "Não foi possível concluir a compra.",
        );
      },
    });

  /*
   * Temas: navega para a página "Design e temas" que já
   * existe no dashboard, pelo mesmo mecanismo usado pela
   * sidebar (pushState + popstate). Nenhuma rota nova.
   */
  function openThemes() {
    window.history.pushState({}, "", THEMES_PATH);

    window.dispatchEvent(
      new PopStateEvent("popstate"),
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Cabeçalho da página */}
      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
          Gestão do Market
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Market
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Escolhe uma categoria para ver os modelos de
              personalização da tua loja. Preços e
              disponibilidade são geridos no Admin e
              carregados da base de dados.
            </p>
          </div>

          <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#111713] px-4 text-sm font-semibold text-white">
            <Store className="h-4 w-4" />
            {storeId ? "Loja ativa" : "Pré-visualização"}
          </span>
        </div>
      </div>

      {/* Aviso: conteúdo comercial indisponível (não bloqueia os modelos) */}
      {featuresQuery.isLoading && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-xs text-gray-500">
          A carregar preços e disponibilidade do Market...
        </div>
      )}

      {featuresQuery.isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-xs text-red-700">
          Não foi possível carregar os preços do Market.
          Os modelos continuam visíveis abaixo.
        </div>
      )}

      {selectedCategory === null ? (
        /* =========================================================
           PÁGINA PRINCIPAL — cartões de categoria
           ========================================================= */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MARKET_HOME_CARDS.map((card) => {
            const Icon = card.icon;

            if (card.type === "themes") {
              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={openThemes}
                  className="
                    group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition
                    hover:border-gray-300 hover:shadow-sm
                  "
                >
                  <span
                    className="
                      flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f2e5]
                    "
                  >
                    <Icon className="h-5 w-5 text-[#465346]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#111713]">
                        {card.title}
                      </span>

                      <span className="text-[11px] font-semibold text-emerald-600 opacity-0 transition group-hover:opacity-100">
                        Abrir →
                      </span>
                    </span>

                    <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                      {card.description}
                    </span>
                  </span>
                </button>
              );
            }

            const count = getMarketVariants(
              card.kind,
            ).length;

            return (
              <button
                key={card.kind}
                type="button"
                onClick={() =>
                  setSelectedCategory(card.kind)
                }
                className="
                  group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition
                  hover:border-gray-300 hover:shadow-sm
                "
              >
                <span
                  className="
                    flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f2e5]
                  "
                >
                  <Icon className="h-5 w-5 text-[#465346]" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#111713]">
                      {card.title}
                    </span>

                    <span className="shrink-0 rounded-full bg-[#111713] px-2 py-0.5 text-[10px] font-bold text-white">
                      {count}{" "}
                      {count === 1
                        ? "modelo"
                        : "modelos"}
                    </span>
                  </span>

                  <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                    {card.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* =========================================================
           VISTA DE CATEGORIA — apenas os modelos desta categoria
           ========================================================= */
        (() => {
          const activeCard =
            MARKET_HOME_CARDS.find(
              (card): card is Extract<
                MarketHomeCard,
                { type: "category" }
              > =>
                card.type === "category" &&
                card.kind === selectedCategory,
            );

          if (!activeCard) {
            return null;
          }

          const variants = getMarketVariants(
            activeCard.kind,
          );

          const gridCols =
            activeCard.kind === "category_card" ||
            activeCard.kind === "product_card"
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "";

          return (
            <section
              key={activeCard.kind}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory(null)
                  }
                  className="
                    mb-3 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 transition
                    hover:text-[#111713]
                  "
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar ao Market
                </button>

                <h2 className="text-sm font-bold text-[#111713]">
                  {activeCard.title}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {activeCard.description}{" "}
                  {variants.length}{" "}
                  {variants.length === 1
                    ? "modelo disponível."
                    : "modelos disponíveis."}
                </p>
              </div>

              {/* Todos os modelos existentes, por ordem numérica */}
              <div
                className={
                  gridCols
                    ? `grid grid-cols-1 gap-4 ${gridCols}`
                    : "space-y-4"
                }
              >
                {variants.map((variant) => {
                  const feature =
                    featuresByKey[variant.featureKey];

                  const VariantComponent =
                    variant.Component;

                  return (
                    <article
                      key={variant.featureKey}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      {/* Pré-visualização real (código isolado do modelo) */}
                      <div className="p-3">
                        <VariantComponent />
                      </div>

                      {/* Nome da funcionalidade */}
                      <div className="flex items-center gap-2 border-t border-gray-100 px-3 pt-3">
                        <span className="shrink-0 rounded-full bg-[#111713] px-2 py-0.5 text-[10px] font-bold text-white">
                          {variant.featureKey}
                        </span>

                        <p className="truncate text-sm font-bold text-[#111713]">
                          {feature?.name ??
                            variant.featureKey}
                        </p>
                      </div>

                      {/* Preço em créditos (da base de dados) + Comprar/Adquirido, ao lado */}
                      <div className="flex flex-wrap items-center gap-3 px-3 pb-3 pt-2.5">
                        <span className="inline-flex items-baseline gap-1.5 rounded-xl bg-lime-100 px-3 py-1.5">
                          <span className="text-xl font-bold leading-none text-[#111713]">
                            {feature
                              ? feature.priceCredits
                              : "—"}
                          </span>

                          <span className="text-[11px] font-bold uppercase tracking-wide text-[#465346]">
                            créditos
                          </span>
                        </span>

                        {ownedKeys.has(variant.featureKey) ? (
                          <span className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white">
                            <Check className="h-4 w-4" />
                            Adquirido
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              !feature ||
                              !storeId ||
                              buyFeature.isPending
                            }
                            onClick={() => {
                              if (!feature || !storeId) {
                                return;
                              }

                              buyFeature.mutate({
                                storeId,
                                featureKey:
                                  variant.featureKey,
                              });
                            }}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#111713] px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {buyFeature.isPending
                              ? "A comprar..."
                              : "Comprar"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })()
      )}
    </div>
  );
}
