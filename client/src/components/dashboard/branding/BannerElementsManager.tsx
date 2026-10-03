import { useEffect, useState } from "react";

import {
  Eye,
  Loader2,
  Pencil,
  Plus,
  UploadCloud,
} from "lucide-react";

import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

import type {
  BannerButtonPosition,
  BannerTextPosition,
  BannerAnimation,
  BannerFeatureSet,
  BannerButtonFeature,
  BannerTextFeature,
  BannerAnimationFeature,
  BannerCountdownFeature,
} from "@/themes/nova/bannerModels";

/*
 * ============================================================
 * GESTÃO DE ELEMENTOS POR BANNER (Market 4banner)
 * ============================================================
 * Desbloqueada pela compra do 4banner (Banner
 * Personalizado) no Market. Cada banner individual
 * (chave R2) pode ter:
 *
 *   - Texto livre com posição;
 *   - Botão com destino (produto da loja ou link);
 *   - Animação leve do slide ativo;
 *   - Contagem decrescente (datetime);
 *   - Estado de publicação: Publicar / Despublicar
 *     (Rascunho) — novos banners nascem como Rascunho.
 *
 * Réplica da gestão real de "Personalizar Loja" que a
 * página demo do Market (market/components/banner/
 * 4banner) apresenta: mesmos campos, mesmos estados.
 * ============================================================
 */

type BannerItem = {
  key: string;
  url: string | null;
};

type FeatureInput = BannerFeatureSet;

const BUTTON_POSITION_LABELS: Record<
  BannerButtonPosition,
  string
> = {
  "bottom-left": "Inferior esquerda",
  "bottom-right": "Inferior direita",
  "top-left": "Superior esquerda",
  "top-right": "Superior direita",
  center: "Centro",
};

const TEXT_POSITION_LABELS: Record<
  BannerTextPosition,
  string
> = {
  "top-left": "Superior esquerda",
  "top-center": "Superior centro",
  "bottom-left": "Inferior esquerda",
  "bottom-center": "Inferior centro",
  "bottom-right": "Inferior direita",
};

const ANIMATION_LABELS: Record<BannerAnimation, string> = {
  none: "Nenhuma",
  fade: "Fade",
  zoom: "Zoom",
  "slide-up": "Deslizar para cima",
  "slide-left": "Deslizar para a esquerda",
};

/**
 * Normaliza um registo de bannerFeatures vindo da
 * base de dados para um BannerFeatureSet total.
 */
function normalizeFeatureSet(
  value: unknown,
): FeatureInput {
  if (!value || typeof value !== "object") {
    return { published: true };
  }

  return value as FeatureInput;
}

export default function BannerElementsManager({
  storeId,
  banners,
}: {
  storeId: string;

  /**
   * Banners da loja, na ordem
   * [bannerKey legado, ...bannerKeys].
   */
  banners: BannerItem[];
}) {
  const brandingQuery =
    trpc.stores.branding.get.useQuery(
      { storeId },
      { retry: false },
    );

  const setBannerFeatures =
    trpc.stores.branding.setBannerFeatures.useMutation();

  const setBannerTexts =
    trpc.stores.branding.setBannerTexts.useMutation();

  /*
   * Elementos por banner (trabalho local, keyed por
   * chave R2). Um único "Guardar" persiste tudo via
   * setBannerFeatures.
   */
  const [features, setFeatures] = useState<
    Record<string, FeatureInput>
  >({});

  const [texts, setTexts] = useState<
    { title?: string; subtitle?: string }[]
  >([]);

  const [previewKey, setPreviewKey] = useState<
    string | null
  >(null);

  /* Sincroniza a partir da base de dados. */
  const serverFeatures =
    brandingQuery.data?.bannerFeatures ?? {};

  const serverTexts =
    brandingQuery.data?.bannerTexts ?? [];

  const serverKey = brandingQuery.dataUpdatedAt;

  useEffect(() => {
    setFeatures((current) => {
      /* Não sobrescrever edições não guardadas. */
      if (Object.keys(current).length > 0) {
        return current;
      }

      const next: Record<string, FeatureInput> = {};

      for (const banner of banners) {
        next[banner.key] = normalizeFeatureSet(
          serverFeatures[banner.key],
        );
      }

      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverKey]);

  useEffect(() => {
    setTexts((current) => {
      if (current.length > 0) {
        return current;
      }

      return serverTexts;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverKey]);

  function patchFeature(
    key: string,
    patch: Partial<FeatureInput>,
  ) {
    setFeatures((current) => ({
      ...current,
      [key]: {
        ...normalizeFeatureSet(current[key]),
        ...patch,
      },
    }));
  }

  function patchText(
    index: number,
    patch: Partial<{ title?: string; subtitle?: string }>,
  ) {
    setTexts((current) => {
      const next = [...current];

      while (next.length <= index) {
        next.push({});
      }

      next[index] = { ...next[index], ...patch };

      return next;
    });
  }

  /*
   * Patches por grupo de elementos: garantem que o
   * campo "enabled" é sempre boolean (os tipos exigem
   * obrigatório), mesmo quando o grupo ainda não
   * existe no banner.
   */
  function patchButton(
    key: string,
    patch: Partial<BannerButtonFeature>,
  ) {
    const current =
      normalizeFeatureSet(features[key]).button ??
      { enabled: false };

    patchFeature(key, {
      button: { ...current, ...patch },
    });
  }

  function patchTextFeature(
    key: string,
    patch: Partial<BannerTextFeature>,
  ) {
    const current =
      normalizeFeatureSet(features[key]).text ??
      { enabled: false };

    patchFeature(key, {
      text: { ...current, ...patch },
    });
  }

  function patchAnimation(
    key: string,
    patch: Partial<BannerAnimationFeature>,
  ) {
    const current =
      normalizeFeatureSet(features[key]).animation ??
      { enabled: false };

    patchFeature(key, {
      animation: { ...current, ...patch },
    });
  }

  function patchCountdown(
    key: string,
    patch: Partial<BannerCountdownFeature>,
  ) {
    const current =
      normalizeFeatureSet(features[key]).countdown ??
      { enabled: false };

    patchFeature(key, {
      countdown: { ...current, ...patch },
    });
  }

  const isPending =
    setBannerFeatures.isPending ||
    setBannerTexts.isPending;

  async function handleSave() {
    try {
      await setBannerFeatures.mutateAsync({
        storeId,
        bannerFeatures: features,
      });

      await setBannerTexts.mutateAsync({
        storeId,
        bannerTexts: texts,
      });

      toast.success(
        "Elementos dos banners guardados.",
      );
    } catch (error) {
      console.error(
        "[Branding] Erro ao guardar elementos dos banners:",
        error,
      );

      toast.error(
        "Não foi possível guardar. Tenta novamente.",
      );
    }
  }

  async function handleSaveAndPublish(key: string) {
    const current =
      features[key] ?? normalizeFeatureSet(undefined);

    patchFeature(key, { published: true });

    try {
      await setBannerFeatures.mutateAsync({
        storeId,
        bannerFeatures: {
          ...features,
          [key]: { ...current, published: true },
        },
      });

      toast.success("Banner publicado.");
    } catch (error) {
      console.error(
        "[Branding] Erro ao publicar banner:",
        error,
      );

      patchFeature(key, { published: current.published });

      toast.error(
        "Não foi possível publicar. Tenta novamente.",
      );
    }
  }

  async function handleUnpublish(key: string) {
    const current =
      features[key] ?? normalizeFeatureSet(undefined);

    patchFeature(key, { published: false });

    try {
      await setBannerFeatures.mutateAsync({
        storeId,
        bannerFeatures: {
          ...features,
          [key]: { ...current, published: false },
        },
      });

      toast.success(
        "Banner movido para Rascunho (não aparece na loja).",
      );
    } catch (error) {
      console.error(
        "[Branding] Erro ao despublicar banner:",
        error,
      );

      patchFeature(key, { published: current.published });

      toast.error(
        "Não foi possível despublicar. Tenta novamente.",
      );
    }
  }

  if (banners.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-xs leading-5 text-gray-500">
        Ainda não há banners na loja. Adiciona um banner
        acima para configurar os elementos.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {banners.map((banner, index) => {
        const feature = normalizeFeatureSet(
          features[banner.key],
        );

        const isDraft = feature.published === false;

        return (
          <div
            key={banner.key}
            className="rounded-xl border border-gray-200 p-3"
          >
            {/* ============ IMAGEM ============ */}

            <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-[#f7f8f5]">
              {banner.url ? (
                <img
                  src={banner.url}
                  alt={`Banner ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-gray-400">
                  Imagem do banner
                </span>
              )}

              <span className="absolute left-2 top-2 rounded-md bg-[#111713]/80 px-2 py-0.5 text-[10px] font-bold text-white">
                {index + 1}
              </span>

              <span
                className={`absolute right-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold text-white ${
                  isDraft
                    ? "bg-amber-500/90"
                    : "bg-emerald-600/90"
                }`}
              >
                {isDraft ? "Rascunho" : "Publicado"}
              </span>
            </div>

            {/* ============ TÍTULO / SUBTÍTULO ============ */}

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <input
                type="text"
                value={texts[index]?.title ?? ""}
                maxLength={120}
                placeholder="Título do banner"
                onChange={(event) =>
                  patchText(index, {
                    title: event.target.value,
                  })
                }
                className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none transition focus:border-gray-400"
              />

              <input
                type="text"
                value={texts[index]?.subtitle ?? ""}
                maxLength={200}
                placeholder="Subtítulo do banner"
                onChange={(event) =>
                  patchText(index, {
                    subtitle: event.target.value,
                  })
                }
                className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none transition focus:border-gray-400"
              />
            </div>

            {/* ============ AÇÕES ============ */}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {isDraft ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleSaveAndPublish(banner.key)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#111713] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2a2f2b] disabled:opacity-50"
                >
                  <UploadCloud className="h-4 w-4" />
                  Publicar
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleUnpublish(banner.key)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-[#111713] transition hover:bg-gray-50 disabled:opacity-50"
                >
                  <Eye className="h-4 w-4" />
                  Despublicar
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setPreviewKey(
                    previewKey === banner.key
                      ? null
                      : banner.key,
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-[#111713] transition hover:bg-gray-50"
              >
                <Pencil className="h-4 w-4" />
                {previewKey === banner.key
                  ? "Fechar elementos"
                  : "Pré-visualizar"}
              </button>

              <span className="flex-1" />

              <button
                type="button"
                disabled={isPending}
                onClick={handleSave}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Guardar elementos
              </button>
            </div>

            {/* ============ ELEMENTOS ============ */}

            {previewKey === banner.key && (
              <div className="mt-3 space-y-3 rounded-lg bg-[#f7f8f5] p-3">
                {/* BOTÃO */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        feature.button?.enabled ?? false
                      }
                      onChange={(event) =>
                        patchButton(banner.key, {
                          enabled: event.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[#111713]"
                    />

                    <span className="text-xs font-bold text-[#111713]">
                      Botão
                    </span>
                  </label>

                  {feature.button?.enabled && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        type="text"
                        maxLength={40}
                        value={
                          feature.button.label ?? ""
                        }
                        placeholder="Texto do botão (ex.: Comprar)"
                        onChange={(event) =>
                          patchButton(banner.key, {
                            label: event.target.value,
                          })
                        }
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400"
                      />

                      <select
                        value={
                          feature.button.target ?? ""
                        }
                        onChange={(event) =>
                          patchButton(banner.key, {
                            target: (event.target
                              .value ||
                              undefined) as
                              | "product"
                              | "link"
                              | undefined,
                          })
                        }
                        className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400"
                      >
                        <option value="">
                          Destino...
                        </option>

                        <option value="product">
                          Página de produto
                        </option>

                        <option value="link">
                          Link
                        </option>
                      </select>

                      {feature.button.target ===
                        "product" && (
                        <input
                          type="text"
                          maxLength={180}
                          value={
                            feature.button.destination ??
                            ""
                          }
                          placeholder="Slug do produto..."
                          onChange={(event) =>
                            patchButton(
                              banner.key,
                              {
                                destination:
                                  event.target
                                    .value,
                              },
                            )
                          }
                          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400"
                        />
                      )}

                      {feature.button.target ===
                        "link" && (
                        <input
                          type="text"
                          maxLength={600}
                          value={
                            feature.button.destination ??
                            ""
                          }
                          placeholder="https://..."
                          onChange={(event) =>
                            patchButton(
                              banner.key,
                              {
                                destination:
                                  event.target
                                    .value,
                              },
                            )
                          }
                          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400"
                        />
                      )}

                      <select
                        value={
                          feature.button.position ??
                          "bottom-left"
                        }
                        onChange={(event) =>
                          patchButton(banner.key, {
                            position: event.target
                              .value as BannerButtonPosition,
                          })
                        }
                        className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400"
                      >
                        {(
                          Object.entries(
                            BUTTON_POSITION_LABELS,
                          ) as [
                            BannerButtonPosition,
                            string,
                          ][]
                        ).map(([value, label]) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* TEXTO */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        feature.text?.enabled ?? false
                      }
                      onChange={(event) =>
                        patchTextFeature(banner.key, {
                          enabled: event.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[#111713]"
                    />

                    <span className="text-xs font-bold text-[#111713]">
                      Texto
                    </span>
                  </label>

                  {feature.text?.enabled && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        type="text"
                        maxLength={200}
                        value={feature.text.text ?? ""}
                        placeholder="Texto a exibir no banner"
                        onChange={(event) =>
                          patchTextFeature(banner.key, {
                            text: event.target.value,
                          })
                        }
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400"
                      />

                      <select
                        value={
                          feature.text.position ??
                          "bottom-center"
                        }
                        onChange={(event) =>
                          patchTextFeature(banner.key, {
                            position: event.target
                              .value as BannerTextPosition,
                          })
                        }
                        className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400"
                      >
                        {(
                          Object.entries(
                            TEXT_POSITION_LABELS,
                          ) as [
                            BannerTextPosition,
                            string,
                          ][]
                        ).map(([value, label]) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* ANIMAÇÃO (LEVE) */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        feature.animation?.enabled ??
                        false
                      }
                      onChange={(event) =>
                        patchAnimation(banner.key, {
                          enabled: event.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[#111713]"
                    />

                    <span className="text-xs font-bold text-[#111713]">
                      Animação (leve)
                    </span>
                  </label>

                  {feature.animation?.enabled && (
                    <select
                      value={
                        feature.animation.type ?? "fade"
                      }
                      onChange={(event) =>
                        patchAnimation(banner.key, {
                          type: event.target
                            .value as BannerAnimation,
                        })
                      }
                      className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400"
                    >
                      {(
                        Object.entries(
                          ANIMATION_LABELS,
                        ) as [BannerAnimation, string][]
                      ).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* CONTAGEM DECRESCENTE */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        feature.countdown?.enabled ??
                        false
                      }
                      onChange={(event) =>
                        patchCountdown(banner.key, {
                          enabled: event.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[#111713]"
                    />

                    <span className="text-xs font-bold text-[#111713]">
                      Contagem decrescente
                    </span>
                  </label>

                  {feature.countdown?.enabled && (
                    <input
                      type="datetime-local"
                      value={
                        feature.countdown.endsAt?.slice(
                          0,
                          16,
                        ) ?? ""
                      }
                      onChange={(event) =>
                        patchCountdown(banner.key, {
                          endsAt: event.target.value
                            ? new Date(
                                event.target.value,
                              ).toISOString()
                            : undefined,
                        })
                      }
                      className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <p className="text-[11px] leading-4 text-gray-400">
        Guarda os elementos para os aplicar. Banners em
        Rascunho não aparecem na loja.
      </p>
    </div>
  );
}
