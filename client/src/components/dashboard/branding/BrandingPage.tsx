import { useRef, useState } from "react";

import {
  Eye,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Trash2,
  Upload,
  UploadCloud,
} from "lucide-react";

import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

import type {
  BannerFeatureMap,
  BannerFeatureSet,
  BannerModel,
  BannerText,
} from "@/themes/nova/bannerModels";
import {
  BannerFeatureEditor,
  DebouncedTextInput,
} from "./BannerFeatureEditor";
import {
  bannerModelUsesText,
  isBannerPublished,
  makeDraftBannerFeatures,
} from "@/themes/nova/bannerModels";
import { BannerModelSelector } from "@/themes/nova/components/BannerModelPreview";
import BannerCarousel from "@/themes/nova/components/BannerCarousel";
import type { ProductCardModel } from "@/themes/nova/productCardModels";
import { ProductCardModelSelector } from "@/themes/nova/components/ModelCardPreview";

const MAX_LOGO_SIZE = 1 * 1024 * 1024;
const MAX_BANNER_SIZE = 3 * 1024 * 1024;

/* Número máximo de banners por loja. */
const MAX_BANNERS = 10;

const LOGO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const BANNER_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function BrandingAssetCard({
  title,
  description,
  aspect,
  previewUrl,
  previewKey,
  onPickFile,
  onRemove,
  isUploading,
  accept,
  maxSize,
}: {
  title: string;
  description: string;
  aspect: string;
  previewUrl: string | null;
  previewKey: string | null;
  onPickFile: (file: File) => void;
  onRemove: () => void;
  isUploading: boolean;
  accept: string;
  maxSize: number;
}) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#111713]">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <div
        className={`relative flex ${aspect} w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-[#f7f8f5]`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin" />

            <span className="text-xs font-medium">
              A carregar...
            </span>
          </div>
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt={title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageIcon className="h-7 w-7" />

            <span className="text-xs font-medium">
              Sem imagem
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          event.target.value = "";

          if (file) {
            if (file.size > maxSize) {
              toast.error(
                `A imagem ultrapassa o limite de ${Math.round(maxSize / 1024 / 1024)} MB.`,
              );

              return;
            }

            onPickFile(file);
          }
        }}
      />

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={isUploading}
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#111713] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2a2f2b] disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />

          {previewKey
            ? "Substituir"
            : "Carregar imagem"}
        </button>

        {previewKey && (
          <button
            type="button"
            disabled={isUploading}
            onClick={onRemove}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Remover
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SECÇÃO BANNER — MÚLTIPLOS BANNERS

   Mesma linguagem visual dos cards existentes
   (bordas arredondadas, dashed placeholder, botões).
   ============================================================ */
function BannerListCard({
  banners,
  bannerTexts,
  onTextChange,
  usesText,
  featureMap,
  onFeaturesChange,
  products,
  onAdd,
  onRemove,
  uploadingIndex,
  bannerModel,
  publishedMap,
  onTogglePublish,
}: {
  banners: { key: string; url: string | null }[];
  bannerTexts: BannerText[];
  onTextChange: (key: string, text: BannerText) => void;
  usesText: boolean;
  featureMap: BannerFeatureMap;
  onFeaturesChange: (
    key: string,
    features: BannerFeatureSet,
  ) => void;
  products: { slug: string; name: string }[];
  onAdd: (file: File) => void;
  onRemove: (key: string) => void;
  uploadingIndex: number | null;
  bannerModel: BannerModel;
  publishedMap: Record<string, boolean>;
  onTogglePublish: (key: string, publish: boolean) => void;
}) {
  const addInputRef = useRef<HTMLInputElement>(null);

  const maxReached = banners.length >= MAX_BANNERS;

  /*
   * Banner com o painel de edição aberto
   * (um de cada vez).
   */
  const [editingKey, setEditingKey] = useState<
    string | null
  >(null);

  /*
   * Banner com pré-visualização aberta
   * (um de cada vez).
   */
  const [previewKey, setPreviewKey] = useState<
    string | null
  >(null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#111713]">
            Banners da loja
          </h3>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Aparecem no carrossel principal da loja,
            pela ordem apresentada. PNG, JPG ou WEBP até 3 MB. Máximo de {MAX_BANNERS}.
            Banners novos começam como Rascunho e só
            aparecem na loja depois de Publicar.
            {usesText &&
              " O modelo ativo usa título e subtítulo — preenche-os em cada banner."}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {banners.length === 0 && (
          <div
            className={`flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-[#f7f8f5] text-gray-400 ${
              uploadingIndex !== null ? "opacity-60" : ""
            }`}
          >
            {uploadingIndex !== null ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />

                <span className="text-xs font-medium text-gray-500">
                  A carregar...
                </span>
              </>
            ) : (
              <>
                <ImageIcon className="h-7 w-7" />

                <span className="text-xs font-medium">
                  Sem banners
                </span>
              </>
            )}
          </div>
        )}

        {banners.map((banner, index) => (
          <div
            key={banner.key}
            className="rounded-xl border border-gray-200 p-3"
          >
            <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-[#f7f8f5]">
              {uploadingIndex === index ? (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin" />

                  <span className="text-xs font-medium">
                    A carregar...
                  </span>
                </div>
              ) : banner.url ? (
                <img
                  src={banner.url}
                  alt={`Banner ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <ImageIcon className="h-7 w-7" />
                </div>
              )}

              <span className="absolute left-2 top-2 rounded-md bg-[#111713]/80 px-2 py-0.5 text-[10px] font-bold text-white">
                {index + 1}
              </span>

              {publishedMap[banner.key] === false && (
                <span className="absolute right-2 top-2 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                  Rascunho
                </span>
              )}
            </div>

            {usesText && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <DebouncedTextInput
                  value={bannerTexts[index]?.title ?? ""}
                  onCommit={(title) =>
                    onTextChange(banner.key, {
                      ...bannerTexts[index],
                      title,
                    })
                  }
                  maxLength={120}
                  placeholder={`Título do banner ${index + 1}`}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none transition focus:border-gray-400"
                />

                <DebouncedTextInput
                  value={bannerTexts[index]?.subtitle ?? ""}
                  onCommit={(subtitle) =>
                    onTextChange(banner.key, {
                      ...bannerTexts[index],
                      subtitle,
                    })
                  }
                  maxLength={200}
                  placeholder={`Subtítulo do banner ${index + 1}`}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none transition focus:border-gray-400"
                />
              </div>
            )}

            {/* ============ PUBLICAR / EDITAR / PREVIEW ============ */}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {publishedMap[banner.key] === false ? (
                <button
                  type="button"
                  disabled={uploadingIndex !== null}
                  onClick={() =>
                    onTogglePublish(banner.key, true)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#111713] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2a2f2b] disabled:opacity-50"
                >
                  <UploadCloud className="h-4 w-4" />
                  Publicar
                </button>
              ) : (
                <button
                  type="button"
                  disabled={uploadingIndex !== null}
                  onClick={() =>
                    onTogglePublish(banner.key, false)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Despublicar
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setEditingKey(
                    editingKey === banner.key
                      ? null
                      : banner.key,
                  )
                }
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${
                  editingKey === banner.key
                    ? "border-[#111713] bg-[#111713] text-white hover:bg-[#2a2f2b]"
                    : "border-gray-200 text-[#111713] hover:bg-gray-50"
                }`}
              >
                <Pencil className="h-4 w-4" />
                Editar
              </button>

              <button
                type="button"
                onClick={() =>
                  setPreviewKey(
                    previewKey === banner.key
                      ? null
                      : banner.key,
                  )
                }
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${
                  previewKey === banner.key
                    ? "border-[#111713] bg-[#111713] text-white hover:bg-[#2a2f2b]"
                    : "border-gray-200 text-[#111713] hover:bg-gray-50"
                }`}
              >
                <Eye className="h-4 w-4" />
                Pré-visualizar
              </button>

              <span className="flex-1" />

              <button
                type="button"
                disabled={uploadingIndex !== null}
                onClick={() => onRemove(banner.key)}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Remover
              </button>
            </div>

            {/* ============ PRÉ-VISUALIZAÇÃO ============ */}

            {previewKey === banner.key && banner.url && (
              <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                <BannerCarousel
                  banners={[
                    {
                      id: `preview-${banner.key}`,
                      image_url: banner.url,
                      position: 1,
                      title: bannerTexts[index]?.title,
                      subtitle:
                        bannerTexts[index]?.subtitle,

                      /*
                       * Sem buttonHref: o botão aparece
                       * como span inerte (sem navegar).
                       */
                      features: featureMap[banner.key],
                    },
                  ]}
                  model={bannerModel}
                />
              </div>
            )}

            {/* ============ ELEMENTOS DO BANNER ============ */}

            {editingKey === banner.key && (
              <BannerFeatureEditor
                features={featureMap[banner.key]}
                products={products}
                onCommit={(next) =>
                  onFeaturesChange(banner.key, next)
                }
              />
            )}
          </div>
        ))}
      </div>

      <input
        ref={addInputRef}
        type="file"
        accept={BANNER_TYPES.join(",")}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          event.target.value = "";

          if (file) {
            if (file.size > MAX_BANNER_SIZE) {
              toast.error(
                `A imagem ultrapassa o limite de ${Math.round(MAX_BANNER_SIZE / 1024 / 1024)} MB.`,
              );

              return;
            }

            onAdd(file);
          }
        }}
      />

      <button
        type="button"
        disabled={uploadingIndex !== null || maxReached}
        onClick={() => addInputRef.current?.click()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111713] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2a2f2b] disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />

        {maxReached
          ? `Máximo de ${MAX_BANNERS} banners`
          : "Adicionar banner"}
      </button>
    </div>
  );
}

export default function BrandingPage({
  storeId,
}: {
  storeId?: string;
}) {
  const brandingQuery =
    trpc.stores.branding.get.useQuery(
      { storeId: storeId ?? "" },
      {
        enabled: Boolean(storeId),
        retry: false,
      },
    );

  /*
   * Produtos da loja para o destino do botão
   * dos banners (página de produto).
   */
  const productsQuery = trpc.products.list.useQuery(
    { storeId: storeId ?? "" },
    {
      enabled: Boolean(storeId),
    },
  );

  const products = productsQuery.data ?? [];

  const utils = trpc.useUtils();

  const storageUpload =
    trpc.stores.branding.createUploadUrl.useMutation({
      onSuccess: () => {
        /*
         * Nada: o fluxo continua no handler.
         */
      },
    });

  const setBranding =
    trpc.stores.branding.set.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  /*
   * Todas as mutations ficam ANTES de qualquer
   * early return (regras dos React Hooks): a ordem
   * de chamada tem de ser igual em todas as
   * renderizações, com ou sem storeId.
   */
  const setCardModel =
    trpc.stores.branding.setProductCardModel.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  const setBannerModelMutation =
    trpc.stores.branding.setBannerModel.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  const setBannerTextsMutation =
    trpc.stores.branding.setBannerTexts.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  const setBannerFeaturesMutation =
    trpc.stores.branding.setBannerFeatures.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  const [uploadingAsset, setUploadingAsset] =
    useState<"logo" | "banner" | null>(null);

  /*
   * Índice do banner a criar (-1) ou a substituir
   * (índice na lista). null = nenhum upload ativo.
   */
  const [uploadingBannerIndex, setUploadingBannerIndex] =
    useState<number | null>(null);

  /* Chave legada do banner principal (bannerKey). */
  const legacyBannerKey =
    brandingQuery.data?.bannerKey ?? null;

  /*
   * Banners atuais: a chave legada (bannerKey) em
   * primeiro lugar, seguida das chaves extra
   * (bannerKeys), na ordem guardada.
   */
  const banners = (() => {
    const list: { key: string; url: string | null }[] = [];

    if (legacyBannerKey) {
      list.push({
        key: legacyBannerKey,
        url: brandingQuery.data?.bannerUrl ?? null,
      });
    }

    const extraKeys = brandingQuery.data?.bannerKeys ?? [];
    const extraUrls = brandingQuery.data?.bannerUrls ?? [];

    /*
     * bannerUrls = [legado (se existir), ...extras]
     * (ver getStoreBrandingUrls no servidor).
     */
    extraKeys.forEach((key, index) => {
      list.push({
        key,
        url: extraUrls[index + (legacyBannerKey ? 1 : 0)] ?? null,
      });
    });

    return list;
  })();

  /*
   * Upload de um NOVO banner: faz o upload para o R2
   * e acrescenta a chave à lista bannerKeys.
   */
  async function handleAddBanner(file: File) {
    if (!storeId) {
      return;
    }

    setUploadingBannerIndex(-1);

    try {
      const upload =
        await storageUpload.mutateAsync({
          storeId,
          asset: "banner",
          fileName: file.name,
          contentType: file.type as
            | "image/jpeg"
            | "image/png"
            | "image/webp"
            | "image/svg+xml",
        });

      const uploadResponse = await fetch(
        upload.uploadUrl,
        {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        },
      );

      if (!uploadResponse.ok) {
        throw new Error(
          `Falha no upload para o Cloudflare R2. HTTP ${uploadResponse.status}.`,
        );
      }

      await setBranding.mutateAsync({
        storeId,
        bannerKeys: [
          ...banners.map((banner) => banner.key),
          upload.key,
        ],
      } as never);

      /*
       * NOVO FLUXO: todo banner adicionado começa
       * como Rascunho — só aparece na loja depois
       * de o utilizador clicar em Publicar. Se o
       * registo falhar, o banner fica publicado
       * (comportamento legado) e avisamos o
       * utilizador em vez de o enganar.
       */
      try {
        await setBannerFeaturesMutation.mutateAsync({
          storeId,
          bannerFeatures: {
            ...bannerFeatureMap,
            [upload.key]: makeDraftBannerFeatures(),
          },
        });

        toast.success(
          "Banner adicionado como Rascunho. Edita e clica em Publicar para o mostrar na loja.",
        );
      } catch (draftError) {
        console.error(
          "[Branding] Erro ao marcar banner como rascunho:",
          draftError,
        );

        toast.warning(
          "Banner adicionado, mas ficou publicado. Se o quiseres como rascunho, clica em Despublicar.",
        );
      }
    } catch (error) {
      console.error(
        "[Branding] Erro no upload do banner:",
        error,
      );

      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível adicionar o banner. Tenta novamente.",
      );
    } finally {
      setUploadingBannerIndex(null);
    }
  }

  /*
   * Remove um banner: se for a chave legada,
   * limpa bannerKey; caso contrário, retira-a da
   * lista bannerKeys.
   */
  async function handleRemoveBanner(key: string) {
    if (!storeId) {
      return;
    }

    const isLegacy = key === legacyBannerKey;

    try {
      await setBranding.mutateAsync({
        storeId,
        ...(isLegacy
          ? { bannerKey: null }
          : {
              bannerKeys: banners
                .filter((banner) => banner.key !== key)
                .map((banner) => banner.key),
            }),
      } as never);

      toast.success("Banner removido.");

      /*
       * Limpeza (não fatal): remove do mapa
       * bannerFeatures a entrada de elementos/estado
       * do banner removido, para não acumular entradas
       * órfãs (limite de 20 no servidor).
       */
      if (bannerFeatureMap[key]) {
        const nextFeatures: BannerFeatureMap =
          Object.fromEntries(
            Object.entries(bannerFeatureMap).filter(
              ([featureKey]) => featureKey !== key,
            ),
          );

        try {
          await setBannerFeaturesMutation.mutateAsync({
            storeId,
            bannerFeatures: nextFeatures,
          });
        } catch (cleanupError) {
          console.error(
            "[Branding] Erro ao limpar elementos do banner removido:",
            cleanupError,
          );
        }
      }
    } catch (error) {
      console.error(
        "[Branding] Erro ao remover banner:",
        error,
      );

      toast.error(
        "Não foi possível remover o banner. Tenta novamente.",
      );
    }
  }

  async function handleUpload(
    asset: "logo" | "banner",
    file: File,
  ) {
    if (!storeId) {
      return;
    }

    setUploadingAsset(asset);

    try {
      const upload =
        await storageUpload.mutateAsync({
          storeId,
          asset,
          fileName: file.name,
          contentType: file.type as
            | "image/jpeg"
            | "image/png"
            | "image/webp"
            | "image/svg+xml",
        });

      const uploadResponse = await fetch(
        upload.uploadUrl,
        {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        },
      );

      if (!uploadResponse.ok) {
        throw new Error(
          `Falha no upload para o Cloudflare R2. HTTP ${uploadResponse.status}.`,
        );
      }

      await setBranding.mutateAsync({
        storeId,
        [asset === "logo"
          ? "logoKey"
          : "bannerKey"]: upload.key,
      } as never);

      toast.success(
        asset === "logo"
          ? "Logo atualizado com sucesso."
          : "Banner atualizado com sucesso.",
      );
    } catch (error) {
      console.error(
        "[Branding] Erro no upload:",
        error,
      );

      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível atualizar. Tenta novamente.",
      );
    } finally {
      setUploadingAsset(null);
    }
  }

  async function handleRemove(
    asset: "logo" | "banner",
  ) {
    if (!storeId) {
      return;
    }

    try {
      await setBranding.mutateAsync({
        storeId,
        [asset === "logo"
          ? "logoKey"
          : "bannerKey"]: null,
      } as never);

      toast.success(
        asset === "logo"
          ? "Logo removido."
          : "Banner removido.",
      );
    } catch (error) {
      console.error(
        "[Branding] Erro ao remover:",
        error,
      );

      toast.error(
        "Não foi possível remover. Tenta novamente.",
      );
    }
  }

  if (!storeId) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          Nenhuma loja selecionada.
        </p>
      </div>
    );
  }

  const logoKey = brandingQuery.data?.logoKey ?? null;
  const bannerKey =
    brandingQuery.data?.bannerKey ?? null;

  /*
   * Modelo de banner atual ("1".."5"). Um único
   * modelo para todo o carrossel em cada momento.
   */
  const bannerModel =
    brandingQuery.data?.bannerModel ?? null;

  const usesBannerText = bannerModelUsesText(
    (bannerModel ?? "1") as BannerModel,
  );

  /*
   * Textos por slide, sempre com o mesmo número de
   * entradas que os banners listados (index alinhado).
   */
  const bannerTexts: BannerText[] = banners.map(
    (_, index) =>
      brandingQuery.data?.bannerTexts?.[index] ?? {},
  );

  async function handleSelectBannerModel(
    model: BannerModel,
  ) {
    if (!storeId) {
      return;
    }

    try {
      await setBannerModelMutation.mutateAsync({
        storeId,
        model,
      });

      toast.success(
        "Modelo de banner atualizado. Todos os banners do carrossel usam o mesmo modelo.",
      );
    } catch (error) {
      console.error(
        "[Branding] Erro ao definir modelo de banner:",
        error,
      );

      toast.error(
        "Não foi possível guardar o modelo. Tenta novamente.",
      );
    }
  }

  /*
   * Elementos por banner (botão/texto/animação/
   * countdown), guardados por chave R2 com autosave.
   */
  const bannerFeatureMap: BannerFeatureMap =
    (brandingQuery.data?.bannerFeatures as
      | BannerFeatureMap
      | undefined) ?? {};

  /*
   * Estado de publicação por banner: ausência do
   * registo = publicado (banners antigos mantêm-se
   * visíveis na loja).
   */
  const publishedMap: Record<string, boolean> =
    Object.fromEntries(
      banners.map((banner) => [
        banner.key,
        isBannerPublished(bannerFeatureMap[banner.key]),
      ]),
    );

  async function handleTogglePublish(
    key: string,
    publish: boolean,
  ) {
    if (!storeId) {
      return;
    }

    const current = bannerFeatureMap[key] ?? {};

    /*
     * Autosave; o toast de sucesso só aparece se
     * o estado ficou realmente guardado.
     */
    const saved = await handleBannerFeaturesChange(key, {
      ...current,
      published: publish,
    });

    if (saved) {
      toast.success(
        publish
          ? "Banner publicado — já aparece na loja."
          : "Banner despublicado — agora é rascunho.",
      );
    }
  }

  /*
   * Devolve true apenas se o autosave gravou com
   * sucesso (os toasts de Publicar dependem disto).
   */
  async function handleBannerFeaturesChange(
    key: string,
    features: BannerFeatureSet,
  ): Promise<boolean> {
    if (!storeId) {
      return false;
    }

    /*
     * Commits de banners já removidos são
     * ignorados (ex.: flush de debounce a seguir
     * a clicar Remover).
     */
    if (!banners.some((banner) => banner.key === key)) {
      return false;
    }

    /*
     * Funde com a entrada guardada: o editor nunca
     * envia `published`, por isso o estado de
     * publicação atual é sempre preservado.
     */
    const next: BannerFeatureMap = {
      ...bannerFeatureMap,
      [key]: {
        ...bannerFeatureMap[key],
        ...features,
      },
    };

    try {
      await setBannerFeaturesMutation.mutateAsync({
        storeId,
        bannerFeatures: next,
      });

      return true;
    } catch (error) {
      console.error(
        "[Branding] Erro ao guardar elementos do banner:",
        error,
      );

      toast.error(
        "Não foi possível guardar os elementos. Tenta novamente.",
      );

      return false;
    }
  }

  async function handleBannerTextChange(
    key: string,
    text: BannerText,
  ) {
    if (!storeId) {
      return;
    }

    /*
     * Commits por CHAVE (não índice): um debounce
     * que chegue depois de uma remoção nunca
     * escreve no banner errado.
     */
    const index = banners.findIndex(
      (banner) => banner.key === key,
    );

    if (index === -1) {
      return;
    }

    /*
     * Autosave: funde com a entrada atual (título e
     * subtítulo commitam em separado) e envia a
     * lista completa (o servidor normaliza).
     */
    const next = banners.map((_, i) =>
      i === index
        ? { ...bannerTexts[i], ...text }
        : bannerTexts[i],
    );

    try {
      await setBannerTextsMutation.mutateAsync({
        storeId,
        bannerTexts: next,
      });
    } catch (error) {
      console.error(
        "[Branding] Erro ao guardar textos do banner:",
        error,
      );

      toast.error(
        "Não foi possível guardar o texto. Tenta novamente.",
      );
    }
  }

  const selectedCardModel =
    brandingQuery.data?.productCardModel ?? null;

  async function handleSelectCardModel(
    model: ProductCardModel,
  ) {
    if (!storeId) {
      return;
    }

    try {
      await setCardModel.mutateAsync({
        storeId,
        model,
      });

      toast.success(
        "Modelo dos cartões de produto atualizado.",
      );
    } catch (error) {
      console.error(
        "[Branding] Erro ao definir modelo de cartão:",
        error,
      );

      toast.error(
        "Não foi possível guardar o modelo. Tenta novamente.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#111713]">
          Personalizar loja
        </h2>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          O logo e o banner pertencem à tua loja e
          aparecem no tema Nova. Podes substituir ou
          remover a qualquer momento.
        </p>
      </div>

      {brandingQuery.isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-gray-200 bg-white">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* ============ 1. LOGO + 2. BANNERS ============ */}

          <div className="grid gap-6 lg:grid-cols-2">
            <BrandingAssetCard
              title="Logo da loja"
              description="Aparece no cabeçalho da loja. PNG, JPG, WEBP ou SVG até 1 MB."
              aspect="h-32"
              previewUrl={
                brandingQuery.data?.logoUrl ?? null
              }
              previewKey={logoKey}
              onPickFile={(file) =>
                handleUpload("logo", file)
              }
              onRemove={() => handleRemove("logo")}
              isUploading={
                uploadingAsset === "logo"
              }
              accept={LOGO_TYPES.join(",")}
              maxSize={MAX_LOGO_SIZE}
            />

            <BannerListCard
              banners={banners}
              bannerTexts={bannerTexts}
              onTextChange={handleBannerTextChange}
              usesText={usesBannerText}
              featureMap={bannerFeatureMap}
              onFeaturesChange={handleBannerFeaturesChange}
              products={products.map((product) => ({
                slug: product.slug,
                name: product.name,
              }))}
              onAdd={handleAddBanner}
              onRemove={handleRemoveBanner}
              uploadingIndex={uploadingBannerIndex}
              bannerModel={(bannerModel ?? "1") as BannerModel}
              publishedMap={publishedMap}
              onTogglePublish={handleTogglePublish}
            />
          </div>

          {/* ============ 2. BANNERS — MODELO ============ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#111713]">
                Modelo do carrossel
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                A loja usa um modelo de cada vez. Todos
                os banners do carrossel partilham o mesmo
                modelo, dimensões e estrutura.
              </p>
            </div>

            <BannerModelSelector
              value={bannerModel}
              onChange={handleSelectBannerModel}
              disabled={setBannerModelMutation.isPending}
            />
          </div>

          {/* ============ 3. PRODUCT CARDS ============ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#111713]">
                Cartões de produto
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Escolhe como os produtos aparecem na
                tua loja (tema Nova). A alteração é
                aplicada imediatamente.
              </p>
            </div>

            <ProductCardModelSelector
              value={selectedCardModel}
              onChange={handleSelectCardModel}
              disabled={setCardModel.isPending}
              previewImage={
                brandingQuery.data?.bannerUrl ?? null
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
