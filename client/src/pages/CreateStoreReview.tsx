import { useEffect, useState } from "react";

import { useLocation } from "wouter";

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

type StoreData = {
  fullName: string;
  storeName: string;
  username: string;
  phone: string;
  whatsapp: string;
  alternativePhone: string;
  country: string;
  province: string;
  district: string;
  neighborhood: string;
  notes: string;
  businessTypes: string[];
};

export default function CreateStoreReview() {
  const [, navigate] = useLocation();

  const [data, setData] = useState<StoreData | null>(null);

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

        sessionStorage.setItem(
          "homsteg_active_store_id",
          result.store.id,
        );
        await utils.stores.mine.invalidate();
        navigate(
          `/app?storeId=${encodeURIComponent(result.store.id)}`,
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
      const savedBusinessTypes = sessionStorage.getItem(
        `homsteg_business_types_${userId}`,
      );

      if (!saved || !savedBusinessTypes) {
        navigate("/criar-loja/dados");
        return;
      }

      const parsed = JSON.parse(saved);
      const businessTypes = JSON.parse(savedBusinessTypes);

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
        ...parsed,
        businessTypes,
      });
    } catch {
      navigate("/criar-loja/dados");
    }
  }, [meQuery.data, meQuery.isLoading, navigate]);

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

    const username = data.username
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (username.length < 3) {
      toast.error(
        "O nome de utilizador da loja é inválido.",
      );
      return;
    }

    createStoreMutation.mutate({
      businessTypes: data.businessTypes,
      fullName: data.fullName.trim(),
      username,
      storeName: data.storeName.trim(),
      storeSlug: username,

      phone: data.phone.trim(),

      alternativePhone:
        data.alternativePhone?.trim() || "",

      whatsapp:
        data.whatsapp?.trim() || "",

      country: data.country.trim(),

      province:
        data.province?.trim() || "",

      district:
        data.district?.trim() || "",

      neighborhood:
        data.neighborhood?.trim() || "",

      notes:
        data.notes?.trim() || "",
    });
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-neutral-500">
          A carregar...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto min-h-screen w-full max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
        {/* HEADER */}
        <div className="mb-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate("/criar-loja/dados")
            }
            className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
              <Store className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              HOMSTEG
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl">
          {/* TESTE DE SESSÃO */}
          <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-neutral-600">
              Estado da sessão
            </p>

            {meQuery.isLoading && (
              <p className="text-sm text-yellow-500">
                A verificar sessão...
              </p>
            )}

            {!meQuery.isLoading && meQuery.data && (
              <div className="text-sm text-green-500">
                Sessão reconhecida ✓
                <span className="ml-2 text-neutral-500">
                  {meQuery.data.email}
                </span>
              </div>
            )}

            {!meQuery.isLoading && !meQuery.data && (
              <div>
                <p className="text-sm text-red-500">
                  Sessão NÃO reconhecida ✕
                </p>

                {meQuery.error && (
                  <p className="mt-1 text-xs text-neutral-600">
                    {meQuery.error.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* TITLE */}
          <div className="mb-10">
            <p className="mb-4 text-sm font-medium text-neutral-400">
              Revisão
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Confirma os dados da tua loja
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400">
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

              {data.alternativePhone && (
                <ReviewItem
                  label="Telefone alternativo"
                  value={data.alternativePhone}
                />
              )}
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
                value={`homsteg.com/${data.username}`}
              />

              <div className="border-t border-neutral-900 pt-4">
                <p className="mb-3 text-xs uppercase tracking-wider text-neutral-600">
                  Como vendes actualmente
                </p>

                <div className="flex flex-wrap gap-2">
                  {data.businessTypes.map(
                    (type) => (
                      <span
                        key={type}
                        className="rounded-lg border border-neutral-800 bg-black px-3 py-2 text-sm text-neutral-300"
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
                <div className="rounded-xl border border-neutral-800 bg-black p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-400">
                    {data.notes}
                  </p>
                </div>
              </ReviewSection>
            )}

            {/* CONFIRMAÇÃO */}
            <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black">
                  <Check className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Tudo pronto
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    Ao criar a loja, ela será associada à tua
                    conta e ficará ativa de imediato.
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
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-800 px-6 text-sm font-medium text-neutral-400 transition hover:border-neutral-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mt-14 border-t border-neutral-900 pt-5">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>Configuração da loja</span>
              <span>3 de 3</span>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-900">
              <div className="h-full w-full rounded-full bg-white" />
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
    <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
      <div className="mb-7 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-semibold">
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
    <div className="flex flex-col gap-1 border-b border-neutral-900 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-neutral-600">
        {label}
      </span>

      <span className="text-sm font-medium text-neutral-200 sm:text-right">
        {value}
      </span>
    </div>
  );
}
