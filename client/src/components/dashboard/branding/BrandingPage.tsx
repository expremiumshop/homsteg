import { useRef, useState } from "react";

import {
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

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

  const [uploadingAsset, setUploadingAsset] =
    useState<"logo" | "banner" | null>(null);

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

          <BrandingAssetCard
            title="Banner da loja"
            description="Aparece na área principal da loja. PNG, JPG ou WEBP até 3 MB."
            aspect="h-48"
            previewUrl={
              brandingQuery.data?.bannerUrl ??
              null
            }
            previewKey={bannerKey}
            onPickFile={(file) =>
              handleUpload("banner", file)
            }
            onRemove={() =>
              handleRemove("banner")
            }
            isUploading={
              uploadingAsset === "banner"
            }
            accept={BANNER_TYPES.join(",")}
            maxSize={MAX_BANNER_SIZE}
          />
        </div>
      )}
    </div>
  );
}
