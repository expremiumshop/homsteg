import { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  CircleAlert,
  Settings2,
  ArrowUpRight,
} from "lucide-react";

type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  icon: "mpesa" | "emola" | "card" | "cash";
  enabled: boolean;
};

const initialMethods: PaymentMethod[] = [
  {
    id: "mpesa",
    name: "M-Pesa",
    description: "Receba pagamentos através do M-Pesa.",
    icon: "mpesa",
    enabled: false,
  },
  {
    id: "emola",
    name: "e-Mola",
    description: "Receba pagamentos através do e-Mola.",
    icon: "emola",
    enabled: false,
  },
  {
    id: "card",
    name: "Cartão bancário",
    description: "Aceite pagamentos com cartões Visa e Mastercard.",
    icon: "card",
    enabled: false,
  },
  {
    id: "cash",
    name: "Pagamento na entrega",
    description: "Permita que o cliente pague quando receber a encomenda.",
    icon: "cash",
    enabled: true,
  },
];

function MethodIcon({ type }: { type: PaymentMethod["icon"] }) {
  if (type === "mpesa" || type === "emola") {
    return <Smartphone className="h-5 w-5" />;
  }

  if (type === "card") {
    return <CreditCard className="h-5 w-5" />;
  }

  return <Wallet className="h-5 w-5" />;
}

export default function PaymentsPage() {
  const [methods, setMethods] = useState(initialMethods);

  const enabledMethods = methods.filter((method) => method.enabled).length;

  function toggleMethod(id: string) {
    setMethods((current) =>
      current.map((method) =>
        method.id === id
          ? { ...method, enabled: !method.enabled }
          : method,
      ),
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
            Checkout
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Pagamentos
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Configure como os seus clientes podem pagar pelas encomendas.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Settings2 className="h-4 w-4" />
          Configurações
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Métodos disponíveis
            </span>

            <CreditCard className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {methods.length}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Opções configuráveis
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Métodos ativos
            </span>

            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {enabledMethods}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Disponíveis no checkout
          </div>
        </div>

        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Moeda da loja
            </span>

            <Wallet className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            MZN
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Metical moçambicano
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

        <div>
          <h3 className="text-sm font-semibold text-amber-900">
            Configure os métodos antes de publicar
          </h3>

          <p className="mt-1 text-xs leading-5 text-amber-800">
            Os métodos de pagamento precisam de configuração adicional antes
            de poderem processar pagamentos reais.
          </p>
        </div>
      </div>

      {/* Payment methods */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Métodos de pagamento
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ative os métodos que deseja disponibilizar no checkout.
          </p>
        </div>

        <div className="space-y-3">
          {methods.map((method) => (
            <div
              key={method.id}
              className={`rounded-2xl border bg-white p-4 transition ${
                method.enabled
                  ? "border-emerald-200"
                  : "border-slate-200"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      method.enabled
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <MethodIcon type={method.icon} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {method.name}
                      </h3>

                      {method.enabled && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Ativo
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {method.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {method.enabled && (
                    <button
                      type="button"
                      className="hidden items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-slate-900 sm:flex"
                    >
                      Configurar
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleMethod(method.id)}
                    aria-label={
                      method.enabled
                        ? `Desativar ${method.name}`
                        : `Ativar ${method.name}`
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      method.enabled ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        method.enabled ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {method.enabled && (
                <div className="mt-4 border-t border-slate-100 pt-4 sm:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600"
                  >
                    Configurar método
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <CheckCircle2 className="h-5 w-5 text-slate-600" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Pagamentos seguros
            </h3>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              O processamento dos pagamentos deverá ser feito através de
              integrações seguras. As credenciais dos gateways nunca devem
              ficar expostas no código do navegador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}