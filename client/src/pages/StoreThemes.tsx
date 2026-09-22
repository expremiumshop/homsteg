import { useEffect, useState } from "react";

import {
  Palette,
  Check,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Crown,
  Sparkles,
  Store,
  ExternalLink,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { useLocation } from "wouter";

import NovaStorefront from "@/themes/nova/Storefront";
import LuxeStorefront from "@/themes/luxe/Storefront";
import UrbanStorefront from "@/themes/urban/Storefront";
import PrimeStorefront from "@/themes/prime/Storefront";
import { getPublicStoreUrl } from "@/lib/store-url";

import { trpc } from "@/lib/trpc";

type Theme = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  popular?: boolean;
};

const themes: Theme[] = [
  {
    id: "nova",
    name: "Nova",
    description:
      "Marketplace moderno, limpo e versátil.",
    category: "Marketplace",
    price: "Grátis",
    popular: true,
  },
  {
    id: "luxe",
    name: "Luxe",
    description:
      "Elegante e sofisticado para marcas premium.",
    category: "Moda & Luxo",
    price: "Premium",
  },
  {
    id: "urban",
    name: "Urban",
    description:
      "Visual moderno para lifestyle e tendências.",
    category: "Lifestyle",
    price: "Premium",
  },
  {
    id: "prime",
    name: "Prime",
    description:
      "Tecnologia e produtos modernos em destaque.",
    category: "Tecnologia",
    price: "Premium",
  },
];

type PreviewDevice =
  | "desktop"
  | "tablet"
  | "mobile";

type ClientStore = {
  id: string;
  name: string;
  slug: string;
  themeKey?: string | null;
};

type StoreMineItem =
  | ClientStore
  | {
      store: ClientStore;
    };

type ThemeKey =
  | "nova"
  | "luxe"
  | "urban"
  | "prime";

function getTheme(
  themeId: string | null | undefined,
) {
  return (
    themes.find(
      (theme) => theme.id === themeId,
    ) ?? themes[0]
  );
}

/* ============================================================
 *   NORMALIZA A RESPOSTA DE stores.mine
 *   ============================================================ */
function normalizeStore(
  item: StoreMineItem | undefined,
): ClientStore | undefined {
  if (!item) {
    return undefined;
  }

  if (
    "store" in item &&
    item.store
  ) {
    return item.store;
  }

  return item as ClientStore;
}

/* ============================================================
 *   MINIATURA DOS TEMAS
 *   ============================================================ */
function ThemeMiniPreview({
  theme,
}: {
  theme: Theme;
}) {
  if (theme.id === "nova") {
    return (
      <div className="h-[270px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="pointer-events-none origin-top scale-[0.28]">
          <div className="w-[1100px]">
            <NovaStorefront mode="demo" />
          </div>
        </div>
      </div>
    );
  }

  if (theme.id === "luxe") {
    return (
      <div className="h-[270px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="pointer-events-none origin-top scale-[0.28]">
          <div className="w-[1100px]">
            <LuxeStorefront mode="demo" />
          </div>
        </div>
      </div>
    );
  }

  if (theme.id === "urban") {
    return (
      <div className="h-[270px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="pointer-events-none origin-top scale-[0.28]">
          <div className="w-[1100px]">
            <UrbanStorefront mode="demo" />
          </div>
        </div>
      </div>
    );
  }

  if (theme.id === "prime") {
    return (
      <div className="h-[270px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="pointer-events-none origin-top scale-[0.28]">
          <div className="w-[1100px]">
            <PrimeStorefront mode="demo" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[270px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
      <div className="px-5 text-center">
        <Palette className="mx-auto mb-3 h-8 w-8 text-slate-400" />

        <p className="text-sm font-bold text-slate-700">
          Tema em desenvolvimento
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          A visualização completa deste tema
          estará disponível quando o tema for
          implementado.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 *   VISUALIZAÇÃO DA LOJA REAL
 *   ============================================================ */
function RealStorePreview({
  store,
  device,
}: {
  store: ClientStore;
  device: PreviewDevice;
}) {
  const themeId =
    store.themeKey || "nova";

  const previewWidth =
    device === "mobile"
      ? "w-[390px]"
      : device === "tablet"
        ? "w-[768px]"
        : "min-w-[1100px] w-full";

  /* ========================================================
   *     NOVA
   *     ======================================================== */
  if (themeId === "nova") {
    return (
      <div className="h-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <div className="h-full overflow-auto">
          <div
            className={`mx-auto ${previewWidth}`}
          >
            <NovaStorefront
              mode="store"
              storeSlug={store.slug}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================
   *     LUXE
   *     ======================================================== */
  if (themeId === "luxe") {
    return (
      <div className="h-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <div className="h-full overflow-auto">
          <div
            className={`mx-auto ${previewWidth}`}
          >
            <LuxeStorefront
              mode="store"
              store={store}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================
   *     URBAN
   *     ======================================================== */
  if (themeId === "urban") {
    return (
      <div className="h-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <div className="h-full overflow-auto">
          <div
            className={`mx-auto ${previewWidth}`}
          >
            <UrbanStorefront
              mode="store"
              store={store}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================
   *     PRIME
   *     ======================================================== */
  if (themeId === "prime") {
    return (
      <div className="h-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <div className="h-full overflow-auto">
          <div
            className={`mx-auto ${previewWidth}`}
          >
            <PrimeStorefront
              mode="store"
              store={store}
            />
          </div>
        </div>
      </div>
    );
  }

  const theme = getTheme(themeId);

  return (
    <div className="flex h-[620px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
      <div className="max-w-md px-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
          <Palette className="h-7 w-7" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          Tema em desenvolvimento
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          A sua loja está configurada com o tema{" "}
          <strong>{theme.name}</strong>,
          mas a versão real deste tema ainda
          está em desenvolvimento.
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Os seus produtos e outros dados continuam
          preservados.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 *   VISUALIZAÇÃO COMPLETA DE UM TEMA
 *   ============================================================ */
function ThemeFullPreview({
  themeId,
}: {
  themeId: string;
}) {
  if (themeId === "nova") {
    return (
      <NovaStorefront mode="demo" />
    );
  }

  if (themeId === "luxe") {
    return (
      <LuxeStorefront mode="demo" />
    );
  }

  if (themeId === "urban") {
    return (
      <UrbanStorefront mode="demo" />
    );
  }

  if (themeId === "prime") {
    return (
      <PrimeStorefront mode="demo" />
    );
  }

  const theme = getTheme(themeId);

  return (
    <div className="flex min-h-[650px] items-center justify-center bg-slate-50">
      <div className="max-w-md px-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
          <Palette className="h-7 w-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          {theme.name}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Este tema ainda está em desenvolvimento.
          A visualização completa será adicionada
          quando o Storefront do tema estiver
          implementado.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 *   PÁGINA DE TEMAS
 *   ============================================================ */
export default function StoreThemes() {
  const [, navigate] =
    useLocation();

  /* ========================================================
   *     BUSCA AS LOJAS
   *     ======================================================== */
  const storesQuery =
    trpc.stores.mine.useQuery();

  /* ========================================================
   *     UTILITÁRIOS TRPC
   *     ======================================================== */
  const utils =
    trpc.useUtils();

  /* ========================================================
   *     MUTATION PARA SALVAR O TEMA
   *     ======================================================== */
  const setThemeMutation =
    trpc.stores.theme.set.useMutation({
      onSuccess: async () => {
        await utils.stores.mine.invalidate();
      },
    });

  /* ========================================================
   *     LOJA DO UTILIZADOR
   *     ======================================================== */
  const clientStore =
    normalizeStore(
      storesQuery.data?.[0] as
        | StoreMineItem
        | undefined,
    );

  /* ========================================================
   *     TEMA ATIVO
   *     ======================================================== */
  const activeThemeId =
    clientStore?.themeKey ||
    "nova";

  const activeTheme =
    getTheme(activeThemeId);

  /* ========================================================
   *     DISPOSITIVO DE PRÉ-VISUALIZAÇÃO
   *     ======================================================== */
  const [
    previewDevice,
    setPreviewDevice,
  ] = useState<PreviewDevice>(
    "desktop",
  );

  /* ========================================================
   *     TEMA SENDO VISUALIZADO
   *     ======================================================== */
  const [
    viewingTheme,
    setViewingTheme,
  ] = useState<string | null>(
    null,
  );

  /* ========================================================
   *     FECHA VISUALIZAÇÃO QUANDO O TEMA É APLICADO
   *     ======================================================== */
  useEffect(() => {
    if (
      viewingTheme &&
      viewingTheme ===
        activeThemeId
    ) {
      setViewingTheme(null);
    }
  }, [
    activeThemeId,
    viewingTheme,
  ]);

  /* ========================================================
   *     SELECIONAR TEMA
   *     ======================================================== */
  const handleSelectTheme =
    async (
      themeId: string,
    ) => {
      if (!clientStore) {
        console.error(
          "Não foi encontrada uma loja para aplicar o tema.",
        );

        return;
      }

      if (
        themeId ===
        activeThemeId
      ) {
        return;
      }

      try {
        await setThemeMutation.mutateAsync(
          {
            storeId:
              clientStore.id,
            themeKey:
              themeId as ThemeKey,
          },
        );

        setViewingTheme(null);

        await utils.stores.mine.invalidate();
      } catch (error) {
        console.error(
          "Erro ao selecionar o tema:",
          error,
        );
      }
    };

  /* ========================================================
   *     VER TEMA
   *     ======================================================== */
  const handleViewTheme =
    (themeId: string) => {
      setViewingTheme(
        themeId,
      );

      window.setTimeout(
        () => {
          document
            .getElementById(
              "theme-viewer",
            )
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        },
        50,
      );
    };

  /* ========================================================
   *     FECHAR VISUALIZAÇÃO
   *     ======================================================== */
  const handleCloseThemeViewer =
    () => {
      setViewingTheme(null);

      window.setTimeout(
        () => {
          document
            .getElementById(
              "available-themes",
            )
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        },
        50,
      );
    };

  /* ========================================================
   *     ABRIR A LOJA REAL
   *     ======================================================== */
  const handleViewStore =
    () => {
      if (
        !clientStore?.slug
      ) {
        return;
      }

      window.open(
        getPublicStoreUrl(clientStore.slug),
        "_blank",
        "noopener,noreferrer",
      );
    };

  const viewingThemeData =
    viewingTheme
      ? getTheme(
          viewingTheme,
        )
      : null;

  return (
    <div className="min-h-screen bg-white">
      {/* ======================================================
       *          HEADER
       *          ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Palette className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-950">
                Temas da loja
              </h1>

              <p className="text-sm text-slate-500">
                Escolha o visual da sua loja.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleViewTheme(
                activeThemeId,
              )
            }
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
          >
            <Eye className="h-4 w-4" />
            Ver tema
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ====================================================
         *            1. PRÉ-VISUALIZAÇÃO DA LOJA
         *            ==================================================== */}
        <section className="mb-12">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
                <Store className="h-3.5 w-3.5" />
                Loja real
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Pré-visualização
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Veja a sua loja real com o tema
                atualmente aplicado.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* DISPOSITIVOS */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() =>
                    setPreviewDevice(
                      "desktop",
                    )
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                    previewDevice ===
                    "desktop"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                  title="Desktop"
                >
                  <Monitor className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewDevice(
                      "tablet",
                    )
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                    previewDevice ===
                    "tablet"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                  title="Tablet"
                >
                  <Tablet className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewDevice(
                      "mobile",
                    )
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                    previewDevice ===
                    "mobile"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                  title="Mobile"
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>

              {/* VER LOJA */}
              <button
                type="button"
                onClick={
                  handleViewStore
                }
                disabled={
                  !clientStore?.slug
                }
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ExternalLink className="h-4 w-4" />
                Ver loja
              </button>
            </div>
          </div>

          {/* LOJA REAL */}
          {storesQuery.isLoading ? (
            <div className="flex h-[620px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-slate-400" />

                <p className="text-sm font-medium text-slate-600">
                  A carregar a sua loja...
                </p>
              </div>
            </div>
          ) : storesQuery.isError ? (
            <div className="flex h-[620px] items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50">
              <div className="max-w-md px-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-400 shadow-sm">
                  <Store className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  Não foi possível carregar a loja
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  O sistema não conseguiu carregar
                  os dados da sua loja neste momento.
                </p>
              </div>
            </div>
          ) : clientStore ? (
            <RealStorePreview
              store={clientStore}
              device={
                previewDevice
              }
            />
          ) : (
            <div className="flex h-[620px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
              <div className="max-w-md px-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <Store className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  Nenhuma loja associada
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ainda não existe uma loja vinculada à
                  sua conta. Quando ela for criada e
                  associada, a pré-visualização real aparecerá aqui.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ====================================================
         *            2. TEMAS DISPONÍVEIS
         *            ==================================================== */}
        <section id="available-themes">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
              <Sparkles className="h-3.5 w-3.5" />
              Personalização
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Temas disponíveis
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Escolha o tema da sua loja ou veja
              a experiência completa antes de decidir.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {themes.map(
              (theme) => {
                const isActive =
                  theme.id ===
                  activeThemeId;

                const isApplying =
                  setThemeMutation.isPending &&
                  setThemeMutation
                    .variables
                    ?.themeKey ===
                    theme.id;

                return (
                  <article
                    key={theme.id}
                    className={`overflow-hidden rounded-2xl border bg-white transition ${
                      isActive
                        ? "border-slate-900 ring-1 ring-slate-900"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* MINIATURA */}
                    <div className="relative">
                      <ThemeMiniPreview
                        theme={theme}
                      />

                      {theme.popular && (
                        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">
                          <Crown className="h-3.5 w-3.5" />
                          Popular
                        </div>
                      )}

                      {isActive && (
                        <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
                          <Check className="h-3.5 w-3.5" />
                          Tema ativo
                        </div>
                      )}
                    </div>

                    {/* INFORMAÇÕES */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-950">
                            {theme.name}
                          </h3>

                          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {theme.category}
                          </p>
                        </div>

                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                            theme.price ===
                            "Grátis"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {theme.price}
                        </span>
                      </div>

                      <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                        {theme.description}
                      </p>

                      {/* BOTÕES */}
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        {/* SELECIONAR TEMA */}
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectTheme(
                              theme.id,
                            )
                          }
                          disabled={
                            isActive ||
                            setThemeMutation.isPending ||
                            !clientStore
                          }
                          className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                            isActive
                              ? "cursor-default border border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <Check className="h-4 w-4" />
                              Selecionado
                            </>
                          ) : isApplying ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Aplicando...
                            </>
                          ) : (
                            "Selecionar tema"
                          )}
                        </button>

                        {/* VER TEMA */}
                        <button
                          type="button"
                          onClick={() =>
                            handleViewTheme(
                              theme.id,
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                          Ver tema
                        </button>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </section>

        {/* ====================================================
         *            VISUALIZAÇÃO COMPLETA DO TEMA
         *            ==================================================== */}
        {viewingTheme &&
          viewingThemeData && (
            <section
              id="theme-viewer"
              className="mt-12 scroll-mt-6"
            >
              <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
                    <Eye className="h-3.5 w-3.5" />
                    Visualização completa
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    {viewingThemeData.name}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Esta demonstração usa conteúdo fictício
                    e não altera os dados da sua loja.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    handleCloseThemeViewer
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar aos temas
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <ThemeFullPreview
                  themeId={
                    viewingTheme
                  }
                />
              </div>
            </section>
          )}
      </main>
    </div>
  );
}
