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
  username: string;
  phone: string;
  whatsapp: string;
  alternativePhone: string;
  country: string;
  province: string;
  district: string;
  neighborhood: string;
  notes: string;
};

const initialForm: FormData = {
  fullName: "",
  storeName: "",
  username: "",
  phone: "",
  whatsapp: "",
  alternativePhone: "",
  country: "Moçambique",
  province: "",
  district: "",
  neighborhood: "",
  notes: "",
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/50"
      />
    </div>
  );
}

export default function CreateStoreData() {
  const [, navigate] = useLocation();

  const [form, setForm] = useState<FormData>(initialForm);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const meQuery = trpc.auth.me.useQuery();

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

      const businessKey = `homsteg_business_types_${userId}`;
      const storeDataKey = `homsteg_store_data_${userId}`;

      let savedBusinessTypes = sessionStorage.getItem(businessKey);

      // Compatibilidade com a chave antiga
      if (!savedBusinessTypes) {
        const oldBusinessTypes = sessionStorage.getItem(
          "homsteg_business_types",
        );

        if (oldBusinessTypes) {
          savedBusinessTypes = oldBusinessTypes;

          sessionStorage.setItem(
            businessKey,
            oldBusinessTypes,
          );
        }
      }

      if (savedBusinessTypes) {
        try {
          const parsed = JSON.parse(savedBusinessTypes);

          if (Array.isArray(parsed)) {
            setBusinessTypes(parsed);
          }
        } catch {
          setBusinessTypes([]);
        }
      }

      const savedStoreData = sessionStorage.getItem(storeDataKey);

      if (savedStoreData) {
        try {
          const parsed = JSON.parse(savedStoreData);

          setForm({
            ...initialForm,
            ...parsed,
          });
        } catch {
          setForm(initialForm);
        }
      }

      setIsReady(true);
    } catch {
      navigate("/criar-loja/negocio");
    }
  }, [meQuery.data, meQuery.isLoading, navigate]);

  function updateField(field: keyof FormData, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!meQuery.data) {
      navigate("/criar-conta");
      return;
    }

    if (
      !form.fullName.trim() ||
      !form.storeName.trim() ||
      !form.username.trim() ||
      !form.phone.trim() ||
      !form.whatsapp.trim() ||
      !form.country.trim() ||
      !form.province.trim() ||
      !form.district.trim() ||
      !form.neighborhood.trim()
    ) {
      return;
    }

    const cleanedUsername = form.username
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (cleanedUsername.length < 3) {
      return;
    }

    const userId = meQuery.data.id;

    const storeDataKey = `homsteg_store_data_${userId}`;
    const businessKey = `homsteg_business_types_${userId}`;

    const finalForm: FormData = {
      ...form,
      username: cleanedUsername,
    };

    sessionStorage.setItem(
      storeDataKey,
      JSON.stringify(finalForm),
    );

    sessionStorage.setItem(
      businessKey,
      JSON.stringify(businessTypes),
    );

    // Remove as chaves antigas não associadas ao utilizador.
    sessionStorage.removeItem("homsteg_store_data");
    sessionStorage.removeItem("homsteg_business_types");

    // A candidatura é criada na revisão. Ir diretamente ao painel fazia o
    // fluxo terminar antes da mutation que a persiste no backend.
    navigate("/criar-loja/revisao");
  }

  if (!isReady || meQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-sm text-white/60">
          A carregar...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/criar-loja/negocio")}
            className="flex items-center gap-2 text-sm font-medium text-white transition hover:text-white/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <div className="text-sm font-semibold tracking-tight text-white">
            HOMSTEG
          </div>

          <div className="text-xs text-white/50">
            2 de 3
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                <Store className="h-4 w-4" />
              </div>

              <span className="text-sm font-medium text-white/50">
                Configuração da loja
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Conta-nos mais sobre a tua loja
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Preenche os dados abaixo para podermos preparar
              o teu espaço dentro da HOMSTEG.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Os teus dados */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Os teus dados
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  Informações básicas para contacto.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Nome completo"
                  value={form.fullName}
                  onChange={(value) =>
                    updateField("fullName", value)
                  }
                  placeholder="Ex.: João Manuel"
                  required
                />

                <Field
                  label="Telefone"
                  value={form.phone}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                  placeholder="Ex.: 84 000 0000"
                  required
                  type="tel"
                />

                <Field
                  label="WhatsApp"
                  value={form.whatsapp}
                  onChange={(value) =>
                    updateField("whatsapp", value)
                  }
                  placeholder="Número do WhatsApp"
                  required
                  type="tel"
                />

                <Field
                  label="Telefone alternativo"
                  value={form.alternativePhone}
                  onChange={(value) =>
                    updateField("alternativePhone", value)
                  }
                  placeholder="Opcional"
                  type="tel"
                />
              </div>
            </section>

            {/* A tua loja */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-white" />

                  <h2 className="text-lg font-semibold text-white">
                    A tua loja
                  </h2>
                </div>

                <p className="mt-1 text-sm text-white/50">
                  Define o nome e o endereço da tua loja.
                </p>
              </div>

              <div className="space-y-5">
                <Field
                  label="Nome da loja"
                  value={form.storeName}
                  onChange={(value) =>
                    updateField("storeName", value)
                  }
                  placeholder="Ex.: Minha Loja"
                  required
                />

                <div>
                  <Field
                    label="Nome de utilizador da loja"
                    value={form.username}
                    onChange={(value) =>
                      updateField("username", value)
                    }
                    placeholder="Ex.: minha-loja"
                    required
                  />

                  <p className="mt-2 text-xs text-white/40">
                    Será usado no endereço público da tua loja.
                    Usa pelo menos 3 caracteres.
                  </p>
                </div>
              </div>
            </section>

            {/* Localização */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-white" />

                  <h2 className="text-lg font-semibold text-white">
                    Localização
                  </h2>
                </div>

                <p className="mt-1 text-sm text-white/50">
                  Indica onde a tua loja está localizada.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="País"
                  value={form.country}
                  onChange={(value) =>
                    updateField("country", value)
                  }
                  required
                />

                <Field
                  label="Província"
                  value={form.province}
                  onChange={(value) =>
                    updateField("province", value)
                  }
                  placeholder="Ex.: Maputo"
                  required
                />

                <Field
                  label="Distrito"
                  value={form.district}
                  onChange={(value) =>
                    updateField("district", value)
                  }
                  placeholder="Ex.: KaMpfumo"
                  required
                />

                <Field
                  label="Bairro"
                  value={form.neighborhood}
                  onChange={(value) =>
                    updateField("neighborhood", value)
                  }
                  placeholder="Ex.: Central"
                  required
                />
              </div>
            </section>

            {/* Observações */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Observações
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  Existe alguma informação adicional que
                  devemos saber?
                </p>
              </div>

              <textarea
                value={form.notes}
                onChange={(e) =>
                  updateField("notes", e.target.value)
                }
                placeholder="Escreve aqui alguma observação..."
                rows={5}
                className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/50"
              />
            </section>

            {/* Resumo */}
            {businessTypes.length > 0 && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black">
                    <Check className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Informação recebida
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-white/60">
                      As opções que selecionaste anteriormente
                      foram guardadas.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {businessTypes.map((type) => (
                        <span
                          key={type}
                          className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/80"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Continuar */}
            <div className="flex justify-end border-t border-white/10 pt-6">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/85 sm:w-auto"
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
