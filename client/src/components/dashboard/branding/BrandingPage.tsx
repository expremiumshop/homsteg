import { useMemo, useRef, useState } from "react";

import {
  Image as ImageIcon,
  Loader2,
  Store,
  Trash2,
  Upload,
} from "lucide-react";

import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

import MarketQuickCard from "@/components/dashboard/market/MarketQuickCard";

import type { ProductCardModel } from "@/themes/nova/productCardModels";
import { MODEL_PURCHASE_TO_CARD } from "@/themes/nova/productCardModels";
import type { NavButtonModel } from "@/themes/nova/navButtonModels";
import { NAV_PURCHASE_TO_BUTTON } from "@/themes/nova/navButtonModels";
import {
  ProductCardModelSelector,
  NavButtonModelSelector,
} from "@/themes/nova/components/ModelCardPreview";

const MAX_LOGO_SIZE = 1 * 1024 * 1024;
const MAX_BANNER_SIZE = 3 * 1024 * 1024;

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
  addLabel = "Carregar imagem",
  replaceLabel = "Substituir",
}: {
  title: string;
  description: string;
  aspect: string;
  previewUrl: string | null;
  previewKey: string | null;
  onPickFile: (file: File) => void;
  /** Opcional: quando ausente, o botão Remover não aparece. */
  onRemove?: () => void;
  isUploading: boolean;
  accept: string;
  maxSize: number;
  addLabel?: string;
  replaceLabel?: string;
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
            ? replaceLabel
            : addLabel}
        </button>

        {previewKey && onRemove && (
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

  const setNavModel =
    trpc.stores.branding.setNavButtonModel.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  const [uploadingAsset, setUploadingAsset] =
    useState<"logo" | "banner" | null>(null);

  /*
   * Upload do banner SIMPLES: 1 imagem por loja.
   * Guarda a chave no bannerKey (legado) e limpa
   * bannerKeys — os eventuais banners extra de
   * versões anteriores são removidos da loja.
   */
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
        ...(asset === "logo"
          ? { logoKey: upload.key }
          : {
              bannerKey: upload.key,
              bannerKeys: [],
            }),
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

  async function handleRemoveLogo() {
    if (!storeId) {
      return;
    }

    try {
      await setBranding.mutateAsync({
        storeId,
        logoKey: null,
      } as never);

      toast.success("Logo removido.");
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

  /*
   * O banner da loja: 1 único banner. É a chave
   * legada (bannerKey) se existir; caso contrário,
   * o primeiro banner extra guardado (bannerKeys),
   * que é o "1.º banner" de lojas de versões
   * anteriores.
   */
  const currentBanner = (() => {
    if (brandingQuery.data?.bannerKey) {
      return {
        key: brandingQuery.data.bannerKey,
        url: brandingQuery.data?.bannerUrl ?? null,
      };
    }

    const extraKeys =
      brandingQuery.data?.bannerKeys ?? [];

    if (extraKeys.length > 0) {
      return {
        key: extraKeys[0],
        url:
          brandingQuery.data?.bannerUrls?.[0] ??
          null,
      };
    }

    return null;
  })();

  const selectedCardModel =
    brandingQuery.data?.productCardModel ?? null;

  const selectedNavModel =
    brandingQuery.data?.navButtonModel ?? null;

  /*
   * Desbloqueios da loja (Market → store_market_features).
   * Apenas os modelos comprados aparecem em
   * "Cartões de produto". Fonte: base de dados.
   */
  const unlockQuery =
    trpc.market.purchases.mine.useQuery(
      { storeId: storeId ?? "" },
      {
        enabled: Boolean(storeId),
      },
    );

  const unlockedCardModels = useMemo<ProductCardModel[]>(
    () =>
      (unlockQuery.data?.featureKeys ?? [])
        .map(
          (
            featureKey,
          ): ProductCardModel | null =>
            MODEL_PURCHASE_TO_CARD[featureKey] ??
            null,
        )
        .filter(
          (model): model is ProductCardModel =>
            model !== null,
        ),
    [unlockQuery.data],
  );

  /*
   * Desbloqueios dos botões de navegação (Market →
   * store_market_features). Apenas os modelos comprados
   * aparecem em "Botões de Navegação". Fonte: base de
   * dados.
   */
  const unlockedNavModels = useMemo<NavButtonModel[]>(
    () =>
      (unlockQuery.data?.featureKeys ?? [])
        .map(
          (
            featureKey,
          ): NavButtonModel | null =>
            NAV_PURCHASE_TO_BUTTON[featureKey] ??
            null,
        )
        .filter(
          (model): model is NavButtonModel =>
            model !== null,
        ),
    [unlockQuery.data],
  );

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

  async function handleSelectNavModel(
    model: NavButtonModel,
  ) {
    if (!storeId) {
      return;
    }

    try {
      await setNavModel.mutateAsync({
        storeId,
        model,
      });

      toast.success(
        "Modelo dos botões de navegação atualizado.",
      );
    } catch (error) {
      console.error(
        "[Branding] Erro ao definir modelo de navegação:",
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
          aparecem no tema Nova. Podes substituir a
          qualquer momento.
        </p>
      </div>

      {brandingQuery.isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-gray-200 bg-white">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* ============ 0. MARKET ============ */}

          <MarketQuickCard storeId={storeId} />

          {/* ============ 1. LOGO + 2. BANNER ============ */}

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
              onRemove={handleRemoveLogo}
              isUploading={
                uploadingAsset === "logo"
              }
              accept={LOGO_TYPES.join(",")}
              maxSize={MAX_LOGO_SIZE}
            />

            {/*
              BANNER SIMPLES — apenas 1 banner por loja:
              sem imagem → "Adicionar banner" (1 imagem);
              com imagem → pré-visualização + "Substituir".
              Sem Remover, sem títulos, sem elementos
              (botão/texto/animação/contagem), sem
              publicação e sem carrossel.
            */}
            <BrandingAssetCard
              title="Banner da loja"
              description="Aparece no topo da loja. PNG, JPG ou WEBP até 3 MB. Apenas 1 banner."
              aspect="h-36"
              previewUrl={currentBanner?.url ?? null}
              previewKey={currentBanner?.key ?? null}
              onPickFile={(file) =>
                handleUpload("banner", file)
              }
              isUploading={
                uploadingAsset === "banner"
              }
              accept={BANNER_TYPES.join(",")}
              maxSize={MAX_BANNER_SIZE}
              addLabel="Adicionar banner"
              replaceLabel="Substituir banner"
            />
          </div>

          {/* ============ 3. PRODUCT CARDS ============ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#111713]">
                Cartões de produto
              </h3>

              {unlockedCardModels.length === 0 ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Ainda não há cartões de produto
                  desbloqueados. Compra modelos no Market
                  para os usar aqui.
                </p>
              ) : (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Escolhe como os produtos aparecem na
                  tua loja (tema Nova). A alteração é
                  aplicada imediatamente.
                </p>
              )}
            </div>

            {unlockedCardModels.length > 0 && (
              <ProductCardModelSelector
                value={selectedCardModel}
                onChange={handleSelectCardModel}
                disabled={setCardModel.isPending}
                previewImage={
                  brandingQuery.data?.bannerUrl ?? null
                }
                unlockedModels={unlockedCardModels}
              />
            )}

            {unlockedCardModels.length === 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5">
                <Store className="h-5 w-5 shrink-0 text-gray-400" />

                <p className="text-xs leading-5 text-gray-500">
                  Os modelos de cartões de produto estão
                  disponíveis no Market. Compra um modelo
                  para o desbloquear aqui.
                </p>
              </div>
            )}
          </div>

          {/* ============ 4. BOTÕES DE NAVEGAÇÃO ============ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#111713]">
                Botões de Navegação
              </h3>

              {unlockedNavModels.length === 0 ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Ainda não há botões de navegação
                  desbloqueados. Compra modelos no Market
                  para os usar aqui.
                </p>
              ) : (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Escolhe como a barra de navegação aparece
                  na tua loja (tema Nova, mobile). A
                  alteração é aplicada imediatamente.
                </p>
              )}
            </div>

            {unlockedNavModels.length > 0 && (
              <NavButtonModelSelector
                value={selectedNavModel}
                onChange={handleSelectNavModel}
                disabled={setNavModel.isPending}
                unlockedModels={unlockedNavModels}
              />
            )}

            {unlockedNavModels.length === 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5">
                <Store className="h-5 w-5 shrink-0 text-gray-400" />

                <p className="text-xs leading-5 text-gray-500">
                  Os modelos de botões de navegação estão
                  disponíveis no Market. Compra um modelo
                  para o desbloquear aqui.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
