import { useEffect, useState } from "react";

import { useLocation } from "wouter";
import HomstegLogo from "@/components/HomstegLogo";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  MessageCircle,
  Store,
  User,
} from "lucide-react";

import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

import { getStoreUrlLabel } from "@/lib/store-url";

type StoreData = {
  fullName: string;
  storeName: string;
  phone: string;
  whatsapp: string;
  country: string;
  province: string;
  district: string;
  neighborhood: string;
  notes: string;
  businessTypes: string[];
};

export default function CreateStoreReview() {
  const [, navigate] = useLocation();

  const [data, setData] =
    useState<StoreData | null>(null);

  // Verifica se o backend reconhece a sessão atual.
  const meQuery = trpc.auth.me.useQuery();

  const utils = trpc.useUtils();

  const createStoreMutation =
    trpc.stores.application.create.useMutation({
      onSuccess: async (result) => {
        toast.success("Loja criada com sucesso!");

        const userId = meQuery.data?.id;

        if (userId) {
          sessionStorage.removeItem(
            `homsteg_business_types_${userId}`,
          );

          sessionStorage.removeItem(
            `homsteg_store_data_${userId}`,
          );
        }

        sessionStorage.removeItem(
          "homsteg_business_types",
        );

        sessionStorage.removeItem(
          "homsteg_store_data",
        );

        sessionStorage.setItem(
          "homsteg_active_store_id",
          result.store.id,
        );

        await utils.stores.mine.invalidate();

        navigate(
          `/app?storeId=${encodeURIComponent(
            result.store.id,
          )}`,
        );
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });

  useEffect(() => {
    if (meQuery.isLoading) {
      return;
    }

    if (!meQuery.data) {
      navigate("/criar-conta");
      return;
    }

    try {
      const userId = meQuery.data.id;

      const saved = sessionStorage.getItem(
        `homsteg_store_data_${userId}`,
      );

      const savedBusinessTypes =
        sessionStorage.getItem(
          `homsteg_business_types_${userId}`,
        );

      if (!saved || !savedBusinessTypes) {
        navigate("/criar-loja/dados");
        return;
      }

      const parsed = JSON.parse(saved);
      const businessTypes =
        JSON.parse(savedBusinessTypes);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        !Array.isArray(businessTypes) ||
        businessTypes.length === 0
      ) {
        navigate("/criar-loja/dados");
        return;
      }

      setData({
        fullName: String(parsed.fullName ?? ""),
        storeName: String(parsed.storeName ?? ""),
        phone: String(parsed.phone ?? ""),
        whatsapp: String(parsed.whatsapp ?? ""),
        country: String(parsed.country ?? ""),
        province: String(parsed.province ?? ""),
        district: String(parsed.district ?? ""),
        neighborhood: String(
          parsed.neighborhood ?? "",
        ),
        notes: String(parsed.notes ?? ""),
        businessTypes,
      });
    } catch {
      navigate("/criar-loja/dados");
    }
  }, [meQuery.data, meQuery.isLoading, navigate]);

  function createStoreSlug(storeName: string) {
    return storeName
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleSubmit() {
    if (!data) {
      return;
    }

    if (!meQuery.data) {
      toast.error(
        "A sessão não foi reconhecida. Faz login novamente.",
      );
      return;
    }

    const storeName = data.storeName.trim();

    if (!storeName) {
      toast.error("O nome da loja é obrigatório.");
      return;
    }

    const storeSlug = createStoreSlug(storeName);

    if (storeSlug.length < 3) {
      toast.error(
        "O nome da loja é demasiado curto para criar o endereço da loja.",
      );
      return;
    }

    createStoreMutation.mutate({
      businessTypes: data.businessTypes,
      fullName: data.fullName.trim(),
      storeName,
      storeSlug,
      phone: data.phone.trim(),
      whatsapp: data.whatsapp.trim(),
      country: data.country.trim(),
      province: data.province.trim(),
      district: data.district.trim(),
      neighborhood: data.neighborhood.trim(),
      notes: data.notes.trim(),
    });
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        <p className="text-sm text-slate-500">
          A carregar...
        </p>
      </main>
    );
  }

  const storeSlug = createStoreSlug(
    data.storeName,
  );

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto min-h-screen w-full max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
        {/* HEADER */}
        <div className="mb-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate("/criar-loja/dados")
            }
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <HomstegLogo size={42} />
        </div>

        <div className="mx-auto w-full max-w-3xl">
          {/* TESTE DE SESSÃO */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">
              Estado da sessão
            </p>

            {meQuery.isLoading && (
              <p className="text-sm text-yellow-600">
                A verificar sessão...
              </p>
            )}

            {!meQuery.isLoading && meQuery.data && (
              <div className="text-sm text-green-600">
                Sessão reconhecida ✓

                <span className="ml-2 text-slate-400">
                  {meQuery.data.email}
                </span>
              </div>
            )}

            {!meQuery.isLoading &&
              !meQuery.data && (
                <div>
                  <p className="text-sm text-red-600">
                    Sessão NÃO reconhecida ✕
                  </p>

                  {meQuery.error && (
                    <p className="mt-1 text-xs text-slate-400">
                      {meQuery.error.message}
                    </p>
                  )}
                </div>
              )}
          </div>

          {/* TITLE */}
          <div className="mb-10">
            <p className="mb-4 text-sm font-medium text-slate-500">
              Revisão
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              Confirma os dados da tua loja
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
              Verifica se todas as informações estão
              corretas antes de criar a loja.
            </p>
          </div>

          <div className="space-y-5">
            {/* DADOS PESSOAIS */}
            <ReviewSection
              icon={<User className="h-5 w-5" />}
              title="Os teus dados"
            >
              <ReviewItem
                label="Nome completo"
                value={data.fullName}
              />

              <ReviewItem
                label="Telefone"
                value={data.phone}
              />

              <ReviewItem
                label="WhatsApp"
                value={data.whatsapp}
              />
            </ReviewSection>

            {/* LOJA */}
            <ReviewSection
              icon={<Store className="h-5 w-5" />}
              title="A tua loja"
            >
              <ReviewItem
                label="Nome da loja"
                value={data.storeName}
              />

              <ReviewItem
                label="Endereço da loja"
                value={getStoreUrlLabel(storeSlug)}
              />

              <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs uppercase tracking-wider text-slate-400">
                  Como vendes actualmente
                </p>

                <div className="flex flex-wrap gap-2">
                  {data.businessTypes.map(
                    (type) => (
                      <span
                        key={type}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                      >
                        {type}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </ReviewSection>

            {/* LOCALIZAÇÃO */}
            <ReviewSection
              icon={<MapPin className="h-5 w-5" />}
              title="Localização"
            >
              <ReviewItem
                label="País"
                value={data.country}
              />

              <ReviewItem
                label="Província"
                value={data.province}
              />

              <ReviewItem
                label="Distrito"
                value={data.district}
              />

              <ReviewItem
                label="Bairro"
                value={data.neighborhood}
              />
            </ReviewSection>

            {/* INFORMAÇÃO ADICIONAL */}
            {data.notes && (
              <ReviewSection
                icon={
                  <MessageCircle className="h-5 w-5" />
                }
                title="Informação adicional"
              >
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {data.notes}
                  </p>
                </div>
              </ReviewSection>
            )}

            {/* CONFIRMAÇÃO */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                  <Check className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Tudo pronto
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    A tua loja será criada com o nome{" "}
                    <span className="font-medium text-slate-900">
                      {data.storeName}
                    </span>{" "}
                    e terá o seguinte endereço
                    público:
                  </p>

                  <p className="mt-3 text-sm font-medium text-black">
                    {getStoreUrlLabel(storeSlug)}
                  </p>
                </div>
              </div>
            </section>

            {/* BOTÕES */}
            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() =>
                  navigate("/criar-loja/dados")
                }
                disabled={
                  createStoreMutation.isPending
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Corrigir dados
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  createStoreMutation.isPending ||
                  meQuery.isLoading
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-7 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createStoreMutation.isPending
                  ? "A criar..."
                  : "Criar loja"}

                {!createStoreMutation.isPending && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* PROGRESSO */}
          <div className="mt-14 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Configuração da loja
              </span>

              <span>3 de 3</span>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-full rounded-full bg-black" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

type ReviewSectionProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

function ReviewSection({
  icon,
  title,
  children,
}: ReviewSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-black">
            {title}
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

type ReviewItemProps = {
  label: string;
  value: string;
};

function ReviewItem({
  label,
  value,
}: ReviewItemProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-medium text-slate-900 sm:text-right">
        {value}
      </span>
    </div>
  );
}
