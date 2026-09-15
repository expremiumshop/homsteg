import { useState } from "react";
import {
  Megaphone,
  Tag,
  Percent,
  MessageCircle,
  Plus,
  BarChart3,
  CheckCircle2,
  Clock3,
} from "lucide-react";

type Campaign = {
  id: number;
  name: string;
  type: string;
  status: "active" | "draft";
  reach: number;
  conversions: number;
};

const initialCampaigns: Campaign[] = [];

export default function MarketingPage() {
  const [campaigns] = useState<Campaign[]>(initialCampaigns);

  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "active",
  ).length;

  const totalReach = campaigns.reduce(
    (total, campaign) => total + campaign.reach,
    0,
  );

  const totalConversions = campaigns.reduce(
    (total, campaign) => total + campaign.conversions,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
            Crescimento
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Marketing
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Crie campanhas e promova os produtos da sua loja.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Nova campanha
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Campanhas
            </span>

            <Megaphone className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {campaigns.length}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Total criadas
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Ativas
            </span>

            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {activeCampaigns}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Campanhas em execução
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Alcance
            </span>

            <BarChart3 className="h-4 w-4 text-blue-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {totalReach.toLocaleString("pt-MZ")}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Pessoas alcançadas
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Conversões
            </span>

            <Tag className="h-4 w-4 text-violet-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {totalConversions.toLocaleString("pt-MZ")}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Resultados das campanhas
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Ferramentas de marketing
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Escolha uma ferramenta para promover a sua loja.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Percent className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              Descontos
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Crie códigos promocionais e descontos para os seus clientes.
            </p>

            <span className="mt-4 inline-flex text-xs font-semibold text-emerald-600">
              Criar desconto →
            </span>
          </button>

          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Megaphone className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              Campanhas
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Crie campanhas para destacar produtos e aumentar as vendas.
            </p>

            <span className="mt-4 inline-flex text-xs font-semibold text-blue-600">
              Criar campanha →
            </span>
          </button>

          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <MessageCircle className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              WhatsApp
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Use o WhatsApp para divulgar produtos e comunicar com clientes.
            </p>

            <span className="mt-4 inline-flex text-xs font-semibold text-green-600">
              Configurar WhatsApp →
            </span>
          </button>
        </div>
      </section>

      {/* Campaigns */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Campanhas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Acompanhe as suas campanhas de marketing.
            </p>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Megaphone className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              Nenhuma campanha criada
            </h3>

            <p className="mt-2 max-w-md text-xs leading-5 text-slate-500">
              Quando criar uma campanha, os seus resultados e métricas
              aparecerão nesta área.
            </p>

            <button
              type="button"
              className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Criar primeira campanha
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Megaphone className="h-5 w-5 text-slate-500" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {campaign.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {campaign.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">
                      Alcance
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-800">
                      {campaign.reach.toLocaleString("pt-MZ")}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">
                      Conversões
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-800">
                      {campaign.conversions.toLocaleString("pt-MZ")}
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                      campaign.status === "active"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {campaign.status === "active" ? "Ativa" : "Rascunho"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Future integrations */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <Clock3 className="h-5 w-5 text-slate-500" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Mais ferramentas em breve
            </h3>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              A plataforma poderá receber posteriormente integração com
              campanhas externas, recuperação de carrinho, e-mail marketing,
              notificações e automações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}