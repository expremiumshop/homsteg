import { Suspense, lazy, useMemo, useRef, useState } from "react";

import {
  ArrowRight,
  Image as ImageIcon,
  Loader2,
  Monitor,
  Smartphone,
  Store,
  Trash2,
  Upload,
  UploadCloud,
} from "lucide-react";

import { toast } from "sonner";

import { trpc } from "@/lib/trpc";
import {
  getPublicStoreUrl,
  getStoreUrlLabel,
} from "@/lib/store-url";

import MarketQuickCard from "@/components/dashboard/market/MarketQuickCard";

import type { ProductCardModel } from "@/themes/nova/productCardModels";
import { MODEL_PURCHASE_TO_CARD } from "@/themes/nova/productCardModels";
import type { NavButtonModel } from "@/themes/nova/navButtonModels";
import { NAV_PURCHASE_TO_BUTTON } from "@/themes/nova/navButtonModels";
import type { BannerModel } from "@/themes/nova/bannerModels";
import {
  BANNER_PURCHASE_TO_MODEL,
  BANNER_FEATURES_PURCHASE_KEY,
  isBannerModel,
} from "@/themes/nova/bannerModels";
import type {
  BannerFeatureMap,
  BannerText,
} from "@/themes/nova/bannerModels";
import type { NovaStorefrontOverrides } from "@/themes/nova/Storefront";

import BannerElementsManager from "./BannerElementsManager";
import type { StorePreviewDevice } from "./StorefrontPreview";
import type { HeaderModel } from "@/themes/nova/headerModels";
import { HEADER_PURCHASE_TO_MODEL } from "@/themes/nova/headerModels";
import type { FooterModel } from "@/themes/nova/footerModels";
import { FOOTER_PURCHASE_TO_MODEL } from "@/themes/nova/footerModels";
import type { CategoryCardModel } from "@/themes/nova/categoryCardModels";
import { CATEGORY_PURCHASE_TO_MODEL } from "@/themes/nova/categoryCardModels";
import {
  ProductCardModelSelector,
  NavButtonModelSelector,
} from "@/themes/nova/components/ModelCardPreview";
import { BannerModelSelector } from "@/themes/nova/components/BannerModelPreview";
import {
  HeaderModelSelector,
  FooterModelSelector,
  CategoryCardModelSelector,
} from "@/themes/nova/components/SectionModelPreview";

/*
 * A storefront real (tema Nova) é grande: carrega-se em chunk
 * próprio, apenas quando a Personalizar Loja é aberta. Assim o
 * resto do painel não paga o custo do storefront.
 */
const StorefrontPreview = lazy(() => import("./StorefrontPreview"));

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

/**
 * Cabeçalho de uma secção da Personalizar Loja.
 * Mantém a linguagem visual das restantes secções do painel.
 */
function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold text-[#111713]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function BrandingPage({
  storeId,
  storeSlug,
}: {
  storeId?: string;
  storeSlug?: string;
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

  const setBannerModelMut =
    trpc.stores.branding.setBannerModel.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  const setHeaderModelMut =
    trpc.stores.branding.setHeaderModel.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  const setFooterModelMut =
    trpc.stores.branding.setFooterModel.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  const setCategoryModelMut =
    trpc.stores.branding.setCategoryCardModel.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  /*
   * Elementos e textos dos banners: deixam de ser guardados
   * diretamente pelo gestor de elementos e passam a ser
   * aplicados no "Publicar alterações".
   */
  const setBannerFeaturesMut =
    trpc.stores.branding.setBannerFeatures.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  const setBannerTextsMut =
    trpc.stores.branding.setBannerTexts.useMutation({
      onSuccess: async () => {
        await utils.stores.branding.get.invalidate();
      },
    });

  const [uploadingAsset, setUploadingAsset] =
    useState<"logo" | "banner" | null>(null);

  /*
   * ==========================================================
   * RASCUNHO (modelo de edição)
   * ==========================================================
   * As alterações não são aplicadas à loja à medida que o
   * utilizador edita. Ficam em memória (`previewOverrides`,
   * `pendingAssets`, `bannerDraft`) e só passam para a loja
   * quando o utilizador prime "Publicar alterações".
   *
   * A pré-visualização lê sempre este rascunho por cima dos
   * valores reais, para se ver o resultado antes de publicar.
   */
  const [previewDevice, setPreviewDevice] =
    useState<StorePreviewDevice>("desktop");

  /* Modelos escolhidos (alterações por publicar). */
  const [previewOverrides, setPreviewOverrides] =
    useState<NovaStorefrontOverrides>({});

  /* Logo/banner já carregados para R2, ainda por aplicar. */
  const [pendingAssets, setPendingAssets] = useState<{
    logoKey?: string | null;
    bannerKey?: string | null;
  }>({});

  /* Existe pelo menos uma alteração por publicar. */
  const [hasPendingChanges, setHasPendingChanges] =
    useState(false);

  /*
   * O utilizador editou elementos/textos de banners. Só nesse
   * caso é que a publicação reescreve os elementos — evita
   * enviar valores ainda em sincronização.
   */
  const [bannerDirty, setBannerDirty] = useState(false);

  const [isPublishing, setIsPublishing] =
    useState(false);

  /*
   * Elementos e textos dos banners em edição, reportados pelo
   * BannerElementsManager. Só são guardados ao publicar.
   */
  const [bannerDraft, setBannerDraft] = useState<{
    bannerFeatures: BannerFeatureMap;
    bannerTexts: BannerText[];
  } | null>(null);

  const previewOverridesWithBanners =
    useMemo<NovaStorefrontOverrides>(
      () => ({
        ...previewOverrides,
        ...(bannerDraft
          ? {
              bannerFeatures: bannerDraft.bannerFeatures,
              bannerTexts: bannerDraft.bannerTexts,
            }
          : {}),
      }),
      [previewOverrides, bannerDraft],
    );

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

      /*
       * O ficheiro já está no R2, mas a loja só passa a
       * apontar para ele ao publicar (rascunho).
       */
      const stagedUrl = upload.imageUrl ?? null;

      if (asset === "logo") {
        setPendingAssets((current) => ({
          ...current,
          logoKey: upload.key,
        }));

        setPreviewOverrides((current) => ({
          ...current,
          logoUrl: stagedUrl,
        }));
      } else {
        setPendingAssets((current) => ({
          ...current,
          bannerKey: upload.key,
        }));

        setPreviewOverrides((current) => ({
          ...current,
          bannerUrls: stagedUrl ? [stagedUrl] : [],
        }));
      }

      setHasPendingChanges(true);

      toast.success(
        asset === "logo"
          ? "Logo pronto. Publica as alterações para o aplicar."
          : "Banner pronto. Publica as alterações para o aplicar.",
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

  function handleRemoveLogo() {
    setPendingAssets((current) => ({
      ...current,
      logoKey: null,
    }));

    setPreviewOverrides((current) => ({
      ...current,
      logoUrl: null,
    }));

    setHasPendingChanges(true);

    toast.success(
      "Logo removido. Publica as alterações para o aplicar.",
    );
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

  /*
   * URL público da loja atual — o mesmo helper
   * (store-url.ts) usado pelo cabeçalho do painel
   * e pela Visão geral. Desenvolvimento abre pela
   * rota /store/:slug; produção pelo subdomínio.
   */
  const publicStoreUrl = storeSlug
    ? getPublicStoreUrl(storeSlug)
    : undefined;

  const storeUrlLabel = storeSlug
    ? getStoreUrlLabel(storeSlug)
    : undefined;

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

  /*
   * Valores mostrados nos cartões de logo/banner: refletem o
   * rascunho quando há um asset por publicar, senão os valores
   * reais da loja.
   */
  const displayLogoUrl =
    pendingAssets.logoKey !== undefined
      ? pendingAssets.logoKey === null
        ? null
        : (previewOverrides.logoUrl ?? null)
      : (brandingQuery.data?.logoUrl ?? null);

  const displayLogoKey =
    pendingAssets.logoKey !== undefined
      ? pendingAssets.logoKey
      : logoKey;

  const displayBanner =
    pendingAssets.bannerKey !== undefined
      ? pendingAssets.bannerKey === null
        ? null
        : {
            key: pendingAssets.bannerKey,
            url: previewOverrides.bannerUrls?.[0] ?? null,
          }
      : currentBanner;

  const selectedCardModel =
    brandingQuery.data?.productCardModel ?? null;

  const selectedNavModel =
    brandingQuery.data?.navButtonModel ?? null;

  const selectedBannerModel =
    brandingQuery.data?.bannerModel ?? null;

  const selectedHeaderModel =
    brandingQuery.data?.headerModel ?? null;

  const selectedFooterModel =
    brandingQuery.data?.footerModel ?? null;

  const selectedCategoryModel =
    brandingQuery.data?.categoryCardModel ?? null;

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

  /*
   * Desbloqueios dos banners do carrossel (Market →
   * store_market_features). Apenas os modelos comprados
   * aparecem em "Banners". Fonte: base de dados.
   */
  const unlockedBannerModels = useMemo<BannerModel[]>(
    () =>
      (unlockQuery.data?.featureKeys ?? [])
        .map(
          (
            featureKey,
          ): BannerModel | "features" | null =>
            BANNER_PURCHASE_TO_MODEL[featureKey] ?? null,
        )
        .filter(isBannerModel),
    [unlockQuery.data],
  );

  /*
   * O 4banner (Banner Personalizado) desbloqueia a
   * gestão de elementos por banner (texto, botão,
   * animação, contagem e publicação) — não um modelo
   * visual do carrossel.
   */
  const hasBannerElements = (
    unlockQuery.data?.featureKeys ?? []
  ).includes(BANNER_FEATURES_PURCHASE_KEY);

  /*
   * Desbloqueios dos headers (Market →
   * store_market_features). Apenas os modelos comprados
   * aparecem em "Navegação (Header)". Fonte: base de dados.
   */
  const unlockedHeaderModels = useMemo<HeaderModel[]>(
    () =>
      (unlockQuery.data?.featureKeys ?? [])
        .map(
          (featureKey): HeaderModel | null =>
            HEADER_PURCHASE_TO_MODEL[featureKey] ?? null,
        )
        .filter(
          (model): model is HeaderModel => model !== null,
        ),
    [unlockQuery.data],
  );

  /*
   * Desbloqueios dos rodapés (Market →
   * store_market_features). Apenas os modelos comprados
   * aparecem em "Rodapés". Fonte: base de dados.
   */
  const unlockedFooterModels = useMemo<FooterModel[]>(
    () =>
      (unlockQuery.data?.featureKeys ?? [])
        .map(
          (featureKey): FooterModel | null =>
            FOOTER_PURCHASE_TO_MODEL[featureKey] ?? null,
        )
        .filter(
          (model): model is FooterModel => model !== null,
        ),
    [unlockQuery.data],
  );

  /*
   * Desbloqueios dos cartões de categoria/Seções
   * (Market → store_market_features). Apenas os modelos
   * comprados aparecem em "Seções". Fonte: base de dados.
   */
  const unlockedCategoryModels =
    useMemo<CategoryCardModel[]>(
      () =>
        (unlockQuery.data?.featureKeys ?? [])
          .map(
            (
              featureKey,
            ): CategoryCardModel | null =>
              CATEGORY_PURCHASE_TO_MODEL[featureKey] ??
              null,
          )
          .filter(
            (
              model,
            ): model is CategoryCardModel =>
              model !== null,
          ),
      [unlockQuery.data],
    );

  /*
   * ==========================================================
   * RASCUNHO → PUBLICAÇÃO
   * ==========================================================
   * Durante a edição nada é enviado para a loja: só o rascunho
   * local é atualizado (e a pré-visualização).
   * `handlePublish` aplica o rascunho à loja com as mutations
   * já existentes — uma única ação para todos os itens.
   */

  function stageModels(patch: NovaStorefrontOverrides) {
    setPreviewOverrides((current) => ({
      ...current,
      ...patch,
    }));

    setHasPendingChanges(true);
  }

  async function handlePublish() {
    if (!storeId) {
      return;
    }

    setIsPublishing(true);

    try {
      /* 1. Logo / banner (chaves R2 já carregadas). */
      if (pendingAssets.logoKey !== undefined) {
        await setBranding.mutateAsync({
          storeId,
          logoKey: pendingAssets.logoKey,
        } as never);
      }

      if (pendingAssets.bannerKey !== undefined) {
        await setBranding.mutateAsync({
          storeId,
          bannerKey: pendingAssets.bannerKey,
          bannerKeys: [],
        } as never);
      }

      /* 2. Modelos de cada secção. */
      if (previewOverrides.productCardModel != null) {
        await setCardModel.mutateAsync({
          storeId,
          model: previewOverrides.productCardModel as ProductCardModel,
        });
      }

      if (previewOverrides.navButtonModel != null) {
        await setNavModel.mutateAsync({
          storeId,
          model: previewOverrides.navButtonModel as NavButtonModel,
        });
      }

      if (previewOverrides.bannerModel != null) {
        await setBannerModelMut.mutateAsync({
          storeId,
          model: previewOverrides.bannerModel as BannerModel,
        });
      }

      if (previewOverrides.headerModel != null) {
        await setHeaderModelMut.mutateAsync({
          storeId,
          model: previewOverrides.headerModel as HeaderModel,
        });
      }

      if (previewOverrides.footerModel != null) {
        await setFooterModelMut.mutateAsync({
          storeId,
          model: previewOverrides.footerModel as FooterModel,
        });
      }

      if (previewOverrides.categoryCardModel != null) {
        await setCategoryModelMut.mutateAsync({
          storeId,
          model: previewOverrides.categoryCardModel as CategoryCardModel,
        });
      }

      /* 3. Elementos e textos dos banners. */
      if (bannerDraft && bannerDirty) {
        await setBannerFeaturesMut.mutateAsync({
          storeId,
          bannerFeatures: bannerDraft.bannerFeatures,
        });

        await setBannerTextsMut.mutateAsync({
          storeId,
          bannerTexts: bannerDraft.bannerTexts,
        });
      }

      /*
       * Publicado: limpa o rascunho. A pré-visualização volta a
       * ler diretamente os valores guardados na loja.
       */
      setPreviewOverrides({});
      setPendingAssets({});
      setBannerDirty(false);
      setHasPendingChanges(false);

      toast.success("Alterações publicadas na loja.");
    } catch (error) {
      console.error(
        "[Branding] Erro ao publicar alterações:",
        error,
      );

      toast.error(
        "Não foi possível publicar as alterações. Tenta novamente.",
      );
    } finally {
      setIsPublishing(false);
    }
  }

  function handleSelectCardModel(model: ProductCardModel) {
    stageModels({ productCardModel: model });
  }

  function handleSelectNavModel(model: NavButtonModel) {
    stageModels({ navButtonModel: model });
  }

  function handleSelectBannerModel(model: BannerModel) {
    stageModels({ bannerModel: model });
  }

  function handleSelectHeaderModel(model: HeaderModel) {
    stageModels({ headerModel: model });
  }

  function handleSelectFooterModel(model: FooterModel) {
    stageModels({ footerModel: model });
  }

  function handleSelectCategoryModel(model: CategoryCardModel) {
    stageModels({ categoryCardModel: model });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ============ CABEÇALHO ============ */}

      <div>
        <h2 className="text-lg font-bold text-[#111713]">
          Personalizar loja
        </h2>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          Vê a tua loja a mudar em tempo real, abre a loja
          pública e publica as alterações quando estiver
          pronto.
        </p>
      </div>

      {/* ==========================================================
          PARTE 1 — VER LOJA ONLINE
          ========================================================== */}

      {publicStoreUrl && (
        <a
          href={publicStoreUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111713] text-white">
              <Store className="h-5 w-5" />
            </span>

            <div>
              <h3 className="text-sm font-bold text-[#111713]">
                Ver loja online
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Abre a loja pública atual numa nova aba
                {storeUrlLabel
                  ? ` (${storeUrlLabel}).`
                  : "."}
              </p>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-[#111713] transition group-hover:border-gray-300">
            Ver loja online
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </a>
      )}

      {/* ==========================================================
          PARTE 2 — PRÉ-VISUALIZAÇÃO DA LOJA
          ========================================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            title="Pré-visualização da loja"
            description={
              hasPendingChanges
                ? "A tua loja real (tema Nova), com as alterações desta página mesmo antes de serem guardadas. Os links estão desativados."
                : "A tua loja real (tema Nova). Os links estão desativados."
            }
          />

          {/* Publicar alterações + alternador de dispositivo */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            {hasPendingChanges && (
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Alterações por publicar
              </span>
            )}

            <button
              type="button"
              disabled={!hasPendingChanges || isPublishing}
              onClick={() => void handlePublish()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
              Publicar alterações
            </button>

            <div
              className="flex shrink-0 items-center gap-0.5 rounded-xl border border-gray-200 p-0.5"
              role="group"
              aria-label="Dispositivo da pré-visualização"
            >
            <button
              type="button"
              aria-pressed={previewDevice === "desktop"}
              onClick={() => setPreviewDevice("desktop")}
              className={
                previewDevice === "desktop"
                  ? "flex items-center gap-2 rounded-lg bg-[#111713] px-3 py-1.5 text-xs font-bold text-white"
                  : "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:text-[#111713]"
              }
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </button>

            <button
              type="button"
              aria-pressed={previewDevice === "mobile"}
              onClick={() => setPreviewDevice("mobile")}
              className={
                previewDevice === "mobile"
                  ? "flex items-center gap-2 rounded-lg bg-[#111713] px-3 py-1.5 text-xs font-bold text-white"
                  : "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:text-[#111713]"
              }
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </button>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex h-[645px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          }
        >
          <StorefrontPreview
            storeId={storeId}
            device={previewDevice}
            overrides={previewOverridesWithBanners}
          />
        </Suspense>
      </section>

      {/* ==========================================================
          PARTE 3 — ITENS DE PERSONALIZAÇÃO
          ========================================================== */}

      <div className="pt-2">
        <h3 className="text-sm font-bold text-[#111713]">
          Itens de personalização
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          Organiza aqui os elementos que podes
          personalizar: logotipo, banner, cartões de
          produto, botões, navegação, seções, rodapé,
          banners e restantes itens disponíveis no
          Market. Cada alteração reflete-se de imediato
          na pré-visualização acima.
        </p>
      </div>

      {brandingQuery.isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-gray-200 bg-white">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* ============ 3.0 MARKET ============ */}

          <MarketQuickCard storeId={storeId} />

          {/* ============ 3.1 LOGO + 3.2 BANNER ============ */}

          <div className="grid gap-6 lg:grid-cols-2">
            <BrandingAssetCard
              title="Logo da loja"
              description="Aparece no cabeçalho da loja. PNG, JPG, WEBP ou SVG até 1 MB."
              aspect="h-32"
              previewUrl={displayLogoUrl}
              previewKey={displayLogoKey}
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
              previewUrl={displayBanner?.url ?? null}
              previewKey={displayBanner?.key ?? null}
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

          {/* ============ 3.3 PRODUCT CARDS ============ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <SectionHeading
              title="Cartões de produto"
              description={
                unlockedCardModels.length === 0
                  ? "Ainda não há cartões de produto desbloqueados. Compra modelos no Market para os usar aqui."
                  : "Escolhe como os produtos aparecem na tua loja (tema Nova). A alteração é aplicada imediatamente."
              }
            />

            {unlockedCardModels.length > 0 && (
              <ProductCardModelSelector
                value={selectedCardModel}
                onChange={handleSelectCardModel}
                disabled={isPublishing}
                previewImage={
                  brandingQuery.data?.bannerUrls?.[0] ?? null
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

          {/* ============ 3.4 BOTÕES DE NAVEGAÇÃO ============ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <SectionHeading
              title="Botões de Navegação"
              description={
                unlockedNavModels.length === 0
                  ? "Ainda não há botões de navegação desbloqueados. Compra modelos no Market para os usar aqui."
                  : "Escolhe como a barra de navegação aparece na tua loja (tema Nova, mobile). A alteração é aplicada imediatamente."
              }
            />

            {unlockedNavModels.length > 0 && (
              <NavButtonModelSelector
                value={selectedNavModel}
                onChange={handleSelectNavModel}
                disabled={isPublishing}
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

          {/* ============ 3.5 BANNERS (carrossel) ============ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <SectionHeading
              title="Banners"
              description={
                unlockedBannerModels.length === 0
                  ? "Ainda não há modelos de banner desbloqueados. Compra modelos no Market para os usar aqui."
                  : "Escolhe o modelo do carrossel de banners da tua loja (tema Nova). A alteração é aplicada imediatamente."
              }
            />

            {hasBannerElements && (
              <p className="-mt-2 mb-4 text-xs leading-5 text-emerald-700">
                Banner Personalizado ativo: configures os
                elementos de cada banner abaixo.
              </p>
            )}

            {unlockedBannerModels.length > 0 && (
              <BannerModelSelector
                value={selectedBannerModel}
                onChange={handleSelectBannerModel}
                disabled={isPublishing}
                unlockedModels={unlockedBannerModels}
              />
            )}

            {unlockedBannerModels.length === 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5">
                <Store className="h-5 w-5 shrink-0 text-gray-400" />

                <p className="text-xs leading-5 text-gray-500">
                  Os modelos de banners do carrossel estão
                  disponíveis no Market. Compra um modelo
                  para o desbloquear aqui.
                </p>
              </div>
            )}

            {/*
              GESTÃO DE ELEMENTOS (Market 4banner):
              texto, botão, animação, contagem e
              publicação por banner. Fiel à demo do
              Market (Banner Personalizado).

              O rascunho local é reportado para a
              pré-visualização: o utilizador vê o
              resultado antes de "Guardar elementos".
            */}
            {hasBannerElements && (
              <div className="mt-5 border-t border-gray-100 pt-5">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Elementos por banner
                </h4>

                <BannerElementsManager
                  storeId={storeId}
                  draftMode
                  onDraftChange={setBannerDraft}
                  onDirty={() => {
                    setBannerDirty(true);
                    setHasPendingChanges(true);
                  }}
                  banners={
                    [
                      brandingQuery.data?.bannerKey
                        ? [
                            {
                              key: brandingQuery.data
                                .bannerKey,
                              url:
                                brandingQuery.data
                                  ?.bannerUrl ?? null,
                            },
                          ]
                        : [],
                      (brandingQuery.data?.bannerKeys ?? []).map(
                        (key, index) => ({
                          key,
                          url:
                            brandingQuery.data
                              ?.bannerUrls?.[index] ??
                            null,
                        }),
                      ),
                    ].flat()
                  }
                />
              </div>
            )}
          </div>

          {/* ============ 3.6 NAVEGAÇÃO (HEADER) ============ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <SectionHeading
              title="Navegação (Header)"
              description={
                unlockedHeaderModels.length === 0
                  ? "Ainda não há cabeçalhos desbloqueados. Compra modelos no Market para os usar aqui."
                  : "Escolhe o cabeçalho da tua loja (tema Nova). A alteração é aplicada imediatamente."
              }
            />

            {unlockedHeaderModels.length > 0 && (
              <HeaderModelSelector
                value={selectedHeaderModel}
                onChange={handleSelectHeaderModel}
                disabled={isPublishing}
                unlockedModels={unlockedHeaderModels}
              />
            )}

            {unlockedHeaderModels.length === 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5">
                <Store className="h-5 w-5 shrink-0 text-gray-400" />

                <p className="text-xs leading-5 text-gray-500">
                  Os modelos de cabeçalho estão
                  disponíveis no Market. Compra um modelo
                  para o desbloquear aqui.
                </p>
              </div>
            )}
          </div>

          {/* ============ 3.7 SEÇÕES (CARTÕES DE CATEGORIA) ============ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <SectionHeading
              title="Seções"
              description={
                unlockedCategoryModels.length === 0
                  ? "Ainda não há cartões de categoria desbloqueados. Compra modelos no Market para os usar aqui."
                  : "Escolhe como as categorias aparecem em destaque na tua loja (tema Nova). A alteração é aplicada imediatamente."
              }
            />

            {unlockedCategoryModels.length > 0 && (
              <CategoryCardModelSelector
                value={selectedCategoryModel}
                onChange={handleSelectCategoryModel}
                disabled={isPublishing}
                unlockedModels={unlockedCategoryModels}
              />
            )}

            {unlockedCategoryModels.length === 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5">
                <Store className="h-5 w-5 shrink-0 text-gray-400" />

                <p className="text-xs leading-5 text-gray-500">
                  Os modelos de seções (cartões de
                  categoria) estão disponíveis no Market.
                  Compra um modelo para o desbloquear
                  aqui.
                </p>
              </div>
            )}
          </div>

          {/* ============ 3.8 RODAPÉS ============ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <SectionHeading
              title="Rodapés"
              description={
                unlockedFooterModels.length === 0
                  ? "Ainda não há rodapés desbloqueados. Compra modelos no Market para os usar aqui."
                  : "Escolhe o rodapé da tua loja (tema Nova). A alteração é aplicada imediatamente."
              }
            />

            {unlockedFooterModels.length > 0 && (
              <FooterModelSelector
                value={selectedFooterModel}
                onChange={handleSelectFooterModel}
                disabled={isPublishing}
                unlockedModels={unlockedFooterModels}
              />
            )}

            {unlockedFooterModels.length === 0 && (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5">
                <Store className="h-5 w-5 shrink-0 text-gray-400" />

                <p className="text-xs leading-5 text-gray-500">
                  Os modelos de rodapé estão disponíveis
                  no Market. Compra um modelo para o
                  desbloquear aqui.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
