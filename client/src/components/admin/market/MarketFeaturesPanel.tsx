import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

import type { MarketFeature } from "@/components/dashboard/market/registry";
import {
  MARKET_SECTION_LABELS,
  MARKET_SECTION_ORDER,
  getMarketVariants,
} from "@/components/dashboard/market/registry";

/* =========================================================
   ADMIN → PRODUTOS — FUNCIONALIDADES DO MARKET
   Mesma fonte que o Market: o registry do módulo
   (client/src/components/dashboard/market/registry.ts).

   Aqui NÃO existe um segundo catálogo. As secções, a
   ordem, os featureKeys, os nomes e os previews vêm
   EXATAMENTE do mesmo sítio que a página do Market:

     Código dos componentes → registry → Market
                            → Admin → Produtos

   Layout de cada cartão (igual ao espaço do Market):
     [ PREVIEW GRANDE DA FUNCIONALIDADE ]
     Nome da funcionalidade
     Preço: 150 créditos
     [ Editar ]  [ Publicar ]

   "Comprar" NÃO existe aqui — pertence exclusivamente
   ao cliente no Market.
   ========================================================= */

/**
 * Linha comercial da tabela market_features:
 * os mesmos campos de MarketFeature + id da linha.
 */
type AdminMarketFeatureRow = MarketFeature & {
  id: string;
};

type FeatureMap = Record<
  string,
  AdminMarketFeatureRow | undefined
>;

export default function MarketFeaturesPanel() {
  const listQuery =
    trpc.admin.market.features.list.useQuery();

  const utils = trpc.useUtils();

  const updateMutation =
    trpc.admin.market.features.update.useMutation({
      onSuccess: () => {
        utils.admin.market.features.list.invalidate();
        utils.market.features.invalidate();
        toast.success("Funcionalidade atualizada.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const setStatusMutation =
    trpc.admin.market.features.setStatus.useMutation({
      onSuccess: () => {
        utils.admin.market.features.list.invalidate();
        utils.market.features.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const [editing, setEditing] = useState<{
    id: string;
    name: string;
    description: string;
    priceCredits: string;
  } | null>(null);

  const features = listQuery.data ?? [];

  /* Mesma lista comercial que o Market consome. */
  const featuresByKey = useMemo<FeatureMap>(() => {
    const map: FeatureMap = {};

    for (const feature of features) {
      map[feature.featureKey] = feature;
    }

    return map;
  }, [features]);

  /* Publicar = gravar a informação comercial
     (antes chamado "Guardar"). */
  function handlePublishEdit() {
    if (!editing) return;

    if (
      !editing.name.trim() ||
      !editing.description.trim()
    ) {
      toast.error("Nome e descrição são obrigatórios.");
      return;
    }

    updateMutation.mutate({
      id: editing.id,
      name: editing.name.trim(),
      description: editing.description.trim(),
      priceCredits:
        Number(editing.priceCredits) || 0,
    });

    setEditing(null);
  }

  /* A carregar */
  if (listQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-[14px] border border-[#e1e9df] bg-white px-5 py-6 text-[11px] text-[#748074]">
        <Loader2 size={13} className="animate-spin" />
        A carregar produtos do Market...
      </div>
    );
  }

  /* Erro */
  if (listQuery.isError) {
    return (
      <div className="rounded-[14px] border border-[#e8d6d6] bg-[#fdf4f4] px-5 py-6 text-[11px] text-[#a05252]">
        Não foi possível carregar os produtos do
        Market. {listQuery.error?.message}
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-4">
        <h2 className="text-[12px] font-bold">
          Funcionalidades do Market
        </h2>

        <p className="mt-1 text-[10px] text-[#8e998e]">
          Os mesmos modelos disponíveis no Market —
          mesma origem, mesmo featureKey, mesmo preview.
          Edite e publique aqui a informação comercial;
          o Market reflete automaticamente.
        </p>
      </div>

      {/* Secções — mesma ordem do Market */}
      <div className="space-y-5">
        {MARKET_SECTION_ORDER.map((kind) => {
          const variants =
            getMarketVariants(kind);

          /*
           * Cada funcionalidade ocupa o MESMO espaço
           * visual que ocupa no Market:
           * category/product → grelha 2–3 colunas;
           * header/banner/footer → cartões empilhados
           * em largura total.
           */
          const cardsLayout =
            kind === "category_card" ||
            kind === "product_card"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : "space-y-4";

          return (
            <div
              key={kind}
              className="rounded-[14px] border border-[#e1e9df] bg-white"
            >
              {/* Cabeçalho da secção */}
              <div className="flex items-center justify-between gap-3 border-b border-[#edf1eb] px-5 py-3">
                <div>
                  <h3 className="text-[11px] font-bold text-[#141714]">
                    {MARKET_SECTION_LABELS[kind]}
                  </h3>

                  <p className="mt-0.5 text-[9px] text-[#8e998e]">
                    Modelos existentes no código do
                    Market.
                  </p>
                </div>

                <span className="rounded-full bg-[#e9f2e5] px-2 py-1 text-[9px] font-bold text-[#58754c]">
                  {variants.length}{" "}
                  {variants.length === 1
                    ? "modelo"
                    : "modelos"}
                </span>
              </div>

              {/* Cartões — mesma ordem numérica do Market */}
              <div className={`p-4 ${cardsLayout}`}>
                {variants.map((variant) => {
                  const feature =
                    featuresByKey[
                      variant.featureKey
                    ];

                  const VariantComponent =
                    variant.Component;

                  const isEditing =
                    feature !== undefined &&
                    editing?.id === feature.id;

                  return (
                    <article
                      key={variant.featureKey}
                      className="flex flex-col overflow-hidden rounded-[14px] border border-[#e1e9df] bg-white"
                    >
                      {/* PREVIEW GRANDE — o MESMO componente do
                          Market, em cima, largura total do cartão */}
                      <div className="p-3">
                        <VariantComponent />
                      </div>

                      {/* Informação comercial — ABAIXO da
                          funcionalidade */}
                      <div className="flex flex-1 flex-col gap-2 border-t border-[#edf1eb] px-4 py-3">
                        {feature && isEditing ? (
                          /* Edição: nome, descrição e preço */
                          <div className="space-y-1.5">
                            <input
                              value={editing.name}
                              onChange={(event) =>
                                setEditing((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        name: event
                                          .target
                                          .value,
                                      }
                                    : prev,
                                )
                              }
                              placeholder="Nome"
                              className="h-8 w-full rounded-lg border border-[#dfe7dc] bg-[#fafcfa] px-2 text-[10px] outline-none"
                            />

                            <input
                              value={editing.description}
                              onChange={(event) =>
                                setEditing((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        description:
                                          event.target
                                            .value,
                                      }
                                    : prev,
                                )
                              }
                              placeholder="Descrição"
                              className="h-8 w-full rounded-lg border border-[#dfe7dc] bg-[#fafcfa] px-2 text-[10px] outline-none"
                            />

                            <label className="flex items-center gap-2">
                              <span className="text-[8px] font-bold uppercase tracking-[.13em] text-[#9ba69b]">
                                Preço (créditos)
                              </span>

                              <input
                                type="number"
                                min={0}
                                value={editing.priceCredits}
                                onChange={(event) =>
                                  setEditing((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          priceCredits:
                                            event.target
                                              .value,
                                        }
                                      : prev,
                                  )
                                }
                                className="h-8 w-[90px] rounded-lg border border-[#dfe7dc] bg-[#fafcfa] px-2 text-[10px] outline-none"
                              />
                            </label>
                          </div>
                        ) : (
                          /* Leitura: nome, descrição e preço */
                          <>
                            <div className="flex items-center gap-2">
                              <span className="shrink-0 rounded-full bg-[#f0f4ef] px-2 py-0.5 font-mono text-[8px] text-[#748074]">
                                {variant.featureKey}
                              </span>

                              <p className="truncate text-[12px] font-bold text-[#141714]">
                                {feature?.name ??
                                  variant.featureKey}
                              </p>
                            </div>

                            <p className="line-clamp-2 text-[9px] text-[#98a398]">
                              {feature?.description ??
                                "Sem descrição — edite para a definir."}
                            </p>

                            {/* Preço associado a ESTA
                                funcionalidade */}
                            <div className="text-[11px] font-semibold text-[#465346]">
                              Preço:{" "}
                              <span className="text-[15px] font-bold text-[#3c5527]">
                                {feature
                                  ? feature.priceCredits
                                  : "—"}
                              </span>{" "}
                              créditos
                            </div>
                          </>
                        )}

                        {/* Ações — ABAIXO da funcionalidade */}
                        <div className="mt-auto flex items-center gap-2 pt-1">
                          {feature && isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditing(null)
                                }
                                className="h-7 rounded-full px-3 text-[9px] font-bold text-[#657464] hover:bg-[#eff5ec]"
                              >
                                Cancelar
                              </button>

                              {/* Antes "Guardar" */}
                              <button
                                type="button"
                                onClick={handlePublishEdit}
                                disabled={
                                  updateMutation.isPending
                                }
                                className="h-7 rounded-full bg-[#162016] px-3 text-[9px] font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                              >
                                Publicar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                disabled={!feature}
                                onClick={() => {
                                  if (!feature) return;

                                  setEditing({
                                    id: feature.id,
                                    name: feature.name,
                                    description:
                                      feature.description,
                                    priceCredits: String(
                                      feature.priceCredits,
                                    ),
                                  });
                                }}
                                className="h-7 rounded-full border border-[#dfe7dc] px-3 text-[9px] font-bold text-[#465346] transition hover:bg-[#eff5ec] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Editar
                              </button>

                              {/* Publicar/Despublicar no
                                  Market (toggle de status) */}
                              <button
                                type="button"
                                disabled={!feature}
                                title={
                                  feature?.status ===
                                  "active"
                                    ? "Clique para despublicar"
                                    : "Publicar no Market"
                                }
                                onClick={() => {
                                  if (!feature) return;

                                  setStatusMutation.mutate({
                                    id: feature.id,
                                    status:
                                      feature.status ===
                                      "active"
                                        ? "inactive"
                                        : "active",
                                  });
                                }}
                                className={`h-7 rounded-full px-3 text-[9px] font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                  feature?.status ===
                                  "active"
                                    ? "bg-[#eaf6cf] text-[#648e31] hover:bg-[#dcebb4]"
                                    : "bg-[#162016] text-white hover:bg-emerald-700"
                                }`}
                              >
                                {feature?.status ===
                                "active"
                                  ? "Publicado"
                                  : "Publicar"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
