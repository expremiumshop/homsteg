import { FormEvent, useEffect, useState } from "react";

import { useLocation } from "wouter";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Store,
} from "lucide-react";

import { trpc } from "@/lib/trpc";

type FormData = {
  fullName: string;
  storeName: string;
  phone: string;
  whatsapp: string;
  country: string;
  province: string;
  district: string;
  neighborhood: string;
  notes: string;
};

const initialForm: FormData = {
  fullName: "",
  storeName: "",
  phone: "",
  whatsapp: "",
  country: "Moçambique",
  province: "",
  district: "",
  neighborhood: "",
  notes: "",
};

export default function CreateStoreData() {
  const [, navigate] = useLocation();
  const meQuery = trpc.auth.me.useQuery();

  const [form, setForm] = useState<FormData>(initialForm);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = meQuery.data?.id;

  useEffect(() => {
    if (!userId) return;

    try {
      const storedBusinessTypes = sessionStorage.getItem(
        `homsteg_business_types_${userId}`,
      );

      const storedForm = sessionStorage.getItem(
        `homsteg_store_data_${userId}`,
      );

      if (storedBusinessTypes) {
        const parsedBusinessTypes = JSON.parse(storedBusinessTypes);

        if (Array.isArray(parsedBusinessTypes)) {
          setBusinessTypes(parsedBusinessTypes);
        }
      } else {
        const legacyBusinessTypes = sessionStorage.getItem(
          "homsteg_business_types",
        );

        if (legacyBusinessTypes) {
          const parsedBusinessTypes =
            JSON.parse(legacyBusinessTypes);

          if (Array.isArray(parsedBusinessTypes)) {
            setBusinessTypes(parsedBusinessTypes);
          }
        }
      }

      if (storedForm) {
        const parsedForm = JSON.parse(storedForm);

        if (parsedForm && typeof parsedForm === "object") {
          setForm((current) => ({
            ...current,
            fullName:
              typeof parsedForm.fullName === "string"
                ? parsedForm.fullName
                : current.fullName,
            storeName:
              typeof parsedForm.storeName === "string"
                ? parsedForm.storeName
                : current.storeName,
            phone:
              typeof parsedForm.phone === "string"
                ? parsedForm.phone
                : current.phone,
            whatsapp:
              typeof parsedForm.whatsapp === "string"
                ? parsedForm.whatsapp
                : current.whatsapp,
            country:
              typeof parsedForm.country === "string"
                ? parsedForm.country
                : current.country,
            province:
              typeof parsedForm.province === "string"
                ? parsedForm.province
                : current.province,
            district:
              typeof parsedForm.district === "string"
                ? parsedForm.district
                : current.district,
            neighborhood:
              typeof parsedForm.neighborhood === "string"
                ? parsedForm.neighborhood
                : current.neighborhood,
            notes:
              typeof parsedForm.notes === "string"
                ? parsedForm.notes
                : current.notes,
          }));
        }
      } else {
        const legacyForm = sessionStorage.getItem(
          "homsteg_store_data",
        );

        if (legacyForm) {
          const parsedForm = JSON.parse(legacyForm);

          if (parsedForm && typeof parsedForm === "object") {
            setForm((current) => ({
              ...current,
              fullName:
                typeof parsedForm.fullName === "string"
                  ? parsedForm.fullName
                  : current.fullName,
              storeName:
                typeof parsedForm.storeName === "string"
                  ? parsedForm.storeName
                  : current.storeName,
              phone:
                typeof parsedForm.phone === "string"
                  ? parsedForm.phone
                  : current.phone,
              whatsapp:
                typeof parsedForm.whatsapp === "string"
                  ? parsedForm.whatsapp
                  : current.whatsapp,
              country:
                typeof parsedForm.country === "string"
                  ? parsedForm.country
                  : current.country,
              province:
                typeof parsedForm.province === "string"
                  ? parsedForm.province
                  : current.province,
              district:
                typeof parsedForm.district === "string"
                  ? parsedForm.district
                  : current.district,
              neighborhood:
                typeof parsedForm.neighborhood === "string"
                  ? parsedForm.neighborhood
                  : current.neighborhood,
              notes:
                typeof parsedForm.notes === "string"
                  ? parsedForm.notes
                  : current.notes,
            }));
          }
        }
      }
    } catch (error) {
      console.error(
        "Erro ao carregar dados da loja:",
        error,
      );
    }
  }, [userId]);

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!userId) {
      return;
    }

    const requiredFields = [
      form.fullName,
      form.storeName,
      form.phone,
      form.whatsapp,
      form.country,
      form.province,
      form.district,
      form.neighborhood,
    ];

    const hasEmptyField = requiredFields.some(
      (value) => !String(value).trim(),
    );

    if (hasEmptyField) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const finalForm: FormData = {
      fullName: form.fullName.trim(),
      storeName: form.storeName.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      country: form.country.trim(),
      province: form.province.trim(),
      district: form.district.trim(),
      neighborhood: form.neighborhood.trim(),
      notes: form.notes.trim(),
    };

    try {
      sessionStorage.setItem(
        `homsteg_store_data_${userId}`,
        JSON.stringify(finalForm),
      );

      sessionStorage.setItem(
        `homsteg_business_types_${userId}`,
        JSON.stringify(businessTypes),
      );

      navigate("/criar-loja/revisao");
    } catch (error) {
      console.error(
        "Erro ao guardar os dados da loja:",
        error,
      );

      alert(
        "Não foi possível guardar os dados. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/criar-loja/negocio")}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-400">
                Criar loja
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Dados da loja
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-zinc-400">
            Preencha os seus dados e as informações da sua loja.
            O nome da loja será usado posteriormente para criar
            o endereço público da loja.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Os teus dados
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Estes dados pertencem ao proprietário da conta.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Nome completo *
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(event) =>
                    updateField(
                      "fullName",
                      event.target.value,
                    )
                  }
                  placeholder="Digite o seu nome completo"
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Número de telefone *
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value,
                    )
                  }
                  placeholder="+258 84 000 0000"
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="whatsapp"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Número do WhatsApp *
                </label>

                <input
                  id="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={(event) =>
                    updateField(
                      "whatsapp",
                      event.target.value,
                    )
                  }
                  placeholder="+258 84 000 0000"
                  className={inputClassName}
                  required
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                A tua loja
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                O nome da loja será a identidade pública da sua
                loja.
              </p>
            </div>

            <div>
              <label
                htmlFor="storeName"
                className="mb-2 block text-sm font-medium text-white"
              >
                Nome da loja *
              </label>

              <input
                id="storeName"
                type="text"
                value={form.storeName}
                onChange={(event) =>
                  updateField(
                    "storeName",
                    event.target.value,
                  )
                }
                placeholder="Ex.: Moda Fashion"
                className={inputClassName}
                required
              />

              <p className="mt-2 text-xs text-zinc-500">
                Este nome será usado para gerar o endereço
                público da loja.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Localização
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Informe a localização da sua atividade comercial.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  País *
                </label>

                <input
                  id="country"
                  type="text"
                  value={form.country}
                  onChange={(event) =>
                    updateField(
                      "country",
                      event.target.value,
                    )
                  }
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="province"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Província *
                </label>

                <input
                  id="province"
                  type="text"
                  value={form.province}
                  onChange={(event) =>
                    updateField(
                      "province",
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: Maputo"
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="district"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Distrito *
                </label>

                <input
                  id="district"
                  type="text"
                  value={form.district}
                  onChange={(event) =>
                    updateField(
                      "district",
                      event.target.value,
                    )
                  }
                  placeholder="Digite o distrito"
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="neighborhood"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Bairro *
                </label>

                <input
                  id="neighborhood"
                  type="text"
                  value={form.neighborhood}
                  onChange={(event) =>
                    updateField(
                      "neighborhood",
                      event.target.value,
                    )
                  }
                  placeholder="Digite o bairro"
                  className={inputClassName}
                  required
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Observações
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Adicione alguma informação adicional, se necessário.
              </p>
            </div>

            <textarea
              id="notes"
              value={form.notes}
              onChange={(event) =>
                updateField(
                  "notes",
                  event.target.value,
                )
              }
              placeholder="Escreva alguma observação..."
              rows={5}
              className={`${inputClassName} resize-none`}
            />
          </section>

          {businessTypes.length > 0 && (
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Tipos de negócio selecionados
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Estes dados foram selecionados na etapa anterior.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {businessTypes.map((type) => (
                  <div
                    key={type}
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                  >
                    <Check className="h-4 w-4" />
                    {type}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() =>
                navigate("/criar-loja/negocio")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "A guardar..." : "Continuar"}

              {!isSubmitting && (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}