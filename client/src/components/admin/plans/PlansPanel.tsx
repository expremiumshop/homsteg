import { useState } from "react";

import {
  AlertTriangle,
  Check,
  MessageCircle,
  X,
} from "lucide-react";

import { trpc } from "@/lib/trpc";
import {
  CLIENT_PLANS,
  type ClientPlanKey,
  getPlanDisplayName,
  getPlanProductLimitLabel,
} from "@/lib/plans";
import {
  getSubscriptionStatus,
  type SubscriptionStatus,
} from "@shared/homsteg";

const PLAN_OPTIONS: ClientPlanKey[] = [
  "free",
  "starter",
  "business",
  "professional",
  "enterprise",
];

function formatDateTime(
  value: string | Date | null | undefined,
) {
  if (!value) {
    return "—";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("pt-PT", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function PlanStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-[#fff7e8] text-[#aa7429]",
    approved: "bg-[#eaf6cf] text-[#648e31]",
    rejected: "bg-[#fff0f0] text-[#a64b4b]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] ?? styles.pending
      }`}
    >
      {status}
    </span>
  );
}

function PlanSelect({
  value,
  onChange,
}: {
  value: ClientPlanKey;
  onChange: (plan: ClientPlanKey) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value as ClientPlanKey,
        )
      }
      className="h-7 rounded-lg border border-[#dfe7dc] bg-[#fafcfa] px-2 text-[10px] font-semibold text-[#465346] outline-none"
    >
      {PLAN_OPTIONS.map((plan) => (
        <option key={plan} value={plan}>
          {CLIENT_PLANS[plan].name}
        </option>
      ))}
    </select>
  );
}

export default function PlansPanel() {
  const [tab, setTab] = useState<
    "stores" | "requests"
  >("stores");

  const [assignPlan, setAssignPlan] = useState<
    Record<string, ClientPlanKey>
  >({});

  const [
    reviewPlanSelection,
    setReviewPlanSelection,
  ] = useState<Record<number, ClientPlanKey>>(
    {},
  );

  const overviewQuery =
    trpc.admin.plans.overview.useQuery();

  const requestsQuery =
    trpc.admin.plans.requests.useQuery();

  const utils = trpc.useUtils();

  const reviewMutation =
    trpc.admin.plans.review.useMutation({
      onSuccess: () => {
        utils.admin.plans.overview.invalidate();
        utils.admin.plans.requests.invalidate();
      },
    });

  const assignMutation =
    trpc.admin.plans.assign.useMutation({
      onSuccess: () => {
        utils.admin.plans.overview.invalidate();
      },
    });

  const markPaidMutation =
    trpc.admin.plans.markPaid.useMutation({
      onSuccess: () => {
        utils.admin.plans.overview.invalidate();
      },
    });

  const overview = overviewQuery.data;
  const requests = requestsQuery.data ?? [];

  const pendingRequests = requests.filter(
    (item) => item.request.status === "pending",
  );

  /*
   * Alertas de subscrição: lojas com plano pago
   * expirado ou a expirar nos próximos 7 dias.
   */
  const subscriptionAlerts = (
    overview?.stores ?? []
  ).filter((entry) => {
    const status = getSubscriptionStatus({
      planKey: entry.store.planKey,
      paidUntil:
        entry.store.subscriptionPaidUntil ??
        null,
    });

    return (
      status === "expired" ||
      status === "expiring"
    );
  });

  function whatsappPaymentLink(
    whatsapp: string | null,
    storeName: string,
    planKey: string,
  ) {
    const digits =
      whatsapp?.replace(/\D/g, "") ?? "";

    if (!digits) {
      return null;
    }

    const message = encodeURIComponent(
      `Olá! A sua loja ${storeName} tem o ${getPlanDisplayName(planKey)} a expirar. Para renovar a subscrição mensal, basta confirmar o pagamento.`,
    );

    return `https://wa.me/${digits}?text=${message}`;
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("stores")}
          className={`rounded-full px-4 py-1.5 text-[11px] font-bold ${
            tab === "stores"
              ? "bg-[#162016] text-white"
              : "bg-white text-[#657464] hover:bg-[#eff5ec]"
          }`}
        >
          Lojas e planos
        </button>

        <button
          type="button"
          onClick={() => setTab("requests")}
          className={`rounded-full px-4 py-1.5 text-[11px] font-bold ${
            tab === "requests"
              ? "bg-[#162016] text-white"
              : "bg-white text-[#657464] hover:bg-[#eff5ec]"
          }`}
        >
          Pedidos
          {pendingRequests.length > 0 && (
            <span className="ml-2 rounded-full bg-[#c8ff4a] px-1.5 text-[9px] font-black text-[#203016]">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* =============================================
          ALERTA DE SUBSCRIÇÃO
      ============================================= */}
      {subscriptionAlerts.length > 0 && (
        <div className="mb-4 rounded-[14px] border border-[#f2d9a4] bg-[#fff7e8] p-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#aa7429]">
            <AlertTriangle size={14} />

            {subscriptionAlerts.length}{" "}
            {subscriptionAlerts.length === 1
              ? "subscrição requer atenção"
              : "subscrições requerem atenção"}
          </div>

          <p className="mt-1 text-[10px] text-[#aa7429]">
            Lojas com plano pago expirado ou a
            expirar nos próximos 7 dias. Contacte
            o proprietário via WhatsApp para o
            pagamento e use "Marcar pago".
          </p>
        </div>
      )}

      {/* =============================================
          LOJAS E PLANOS
      ============================================= */}
      {tab === "stores" && (
        <div className="overflow-x-auto rounded-[14px] border border-[#e1e9df] bg-white">
          <div className="min-w-[980px]">
          <div className="grid grid-cols-[1.2fr_.8fr_.7fr_.6fr_.8fr_1fr_1.1fr_1.3fr] gap-3 border-b border-[#edf1eb] px-5 py-3 text-[9px] font-bold uppercase tracking-[.13em] text-[#9ba69b]">
            <span>Loja</span>
            <span>Plano atual</span>
            <span>Limite</span>
            <span>Usados</span>
            <span>WhatsApp</span>
            <span>Subscrição</span>
            <span>Pedido / aprovação</span>
            <span>Atribuir plano</span>
          </div>

          {overview?.stores.length === 0 && (
            <div className="px-5 py-4 text-[10px] text-[#748074]">
              Nenhuma loja encontrada.
            </div>
          )}

          {overview?.stores.map(
            (entry) => {
              const selected =
                assignPlan[entry.store.id] ??
                (entry.store.planKey === "free"
                  ? "starter"
                  : (entry.store
                      .planKey as ClientPlanKey));

              const isUnlimited =
                entry.plan?.productLimit ===
                2147483647;

              const subscriptionStatus =
                getSubscriptionStatus({
                  planKey: entry.store.planKey,
                  paidUntil:
                    entry.store.subscriptionPaidUntil ??
                    null,
                });

              const waLink =
                whatsappPaymentLink(
                  entry.store.whatsapp,
                  entry.store.name,
                  entry.store.planKey,
                );

              return (
                <div
                  key={entry.store.id}
                  className="grid grid-cols-[1.2fr_.8fr_.7fr_.6fr_.8fr_1fr_1.1fr_1.3fr] items-center gap-3 border-b border-[#edf1eb] px-5 py-3.5 text-[10px] last:border-0"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-[#141714]">
                      {entry.store.name}
                    </div>

                    <div className="mt-0.5 truncate text-[9px] text-[#98a398]">
                      {entry.owner?.name ??
                        entry.owner?.email ??
                        "—"}
                    </div>
                  </div>

                  <span className="font-bold text-[#465346]">
                    {getPlanDisplayName(
                      entry.store.planKey,
                    )}
                  </span>

                  <span className="text-[#748074]">
                    {isUnlimited
                      ? "Ilimitado"
                      : (entry.plan
                          ?.productLimit ?? "—")}
                  </span>

                  <span
                    className={`font-bold ${
                      entry.plan &&
                      entry.plan.productLimit !==
                        2147483647 &&
                      entry.productsUsed >=
                        entry.plan.productLimit
                        ? "text-[#a64b4b]"
                        : "text-[#465346]"
                    }`}
                  >
                    {entry.productsUsed}
                  </span>

                  <span className="truncate text-[#748074]">
                    {waLink ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#58754c] hover:underline"
                      >
                        <MessageCircle size={11} />
                        {
                          entry.store.whatsapp
                        }
                      </a>
                    ) : (
                      entry.store.whatsapp ??
                      "—"
                    )}
                  </span>

                  {/* =====================================
                      SUBSCRIÇÃO MENSAL
                  ====================================== */}
                  <span className="text-[9px]">
                    {subscriptionStatus ===
                      "free" && (
                      <span className="text-[#98a398]">
                        —
                      </span>
                    )}

                    {subscriptionStatus ===
                      "active" && (
                      <span className="text-[#648e31]">
                        Até{" "}
                        {formatDateTime(
                          entry.store
                            .subscriptionPaidUntil,
                        )}
                      </span>
                    )}

                    {subscriptionStatus ===
                      "expiring" && (
                      <span className="font-bold text-[#aa7429]">
                        Expira{" "}
                        {formatDateTime(
                          entry.store
                            .subscriptionPaidUntil,
                        )}
                      </span>
                    )}

                    {subscriptionStatus ===
                      "expired" && (
                      <span className="font-bold text-[#a64b4b]">
                        Expirada
                      </span>
                    )}
                  </span>

                  <span className="text-[9px] text-[#748074]">
                    {formatDateTime(
                      entry.latestRequest?.createdAt,
                    )}
                    {" / "}
                    {formatDateTime(
                      entry.latestRequest
                        ?.reviewedAt,
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    <PlanSelect
                      value={selected}
                      onChange={(
                        plan: ClientPlanKey,
                      ) =>
                        setAssignPlan(
                          (current) => ({
                            ...current,
                            [entry.store.id]:
                              plan,
                          }),
                        )
                      }
                    />

                    <button
                      type="button"
                      disabled={
                        assignMutation.isPending ||
                        selected ===
                          entry.store.planKey
                      }
                      onClick={() =>
                        assignMutation.mutate({
                          storeId: entry.store.id,
                          planKey: selected,
                        })
                      }
                      className="rounded-lg bg-[#162016] px-3 py-1.5 text-[9px] font-bold text-white disabled:opacity-40"
                    >
                      Aplicar
                    </button>

                    {subscriptionStatus !==
                      "free" && (
                      <button
                        type="button"
                        disabled={
                          markPaidMutation.isPending
                        }
                        onClick={() =>
                          markPaidMutation.mutate(
                            {
                              storeId:
                                entry.store.id,
                            },
                          )
                        }
                        title="Renovar a subscrição mensal após confirmação do pagamento"
                        className="rounded-lg bg-[#eaf6cf] px-3 py-1.5 text-[9px] font-bold text-[#58754c] hover:bg-[#dff3b6] disabled:opacity-40"
                      >
                        Marcar pago
                      </button>
                    )}
                  </div>
                </div>
              );
            },
          )}
          </div>
        </div>
      )}

      {/* =============================================
          PEDIDOS DE UPGRADE
      ============================================= */}
      {tab === "requests" && (
        <div className="space-y-3">
          {requests.length === 0 && (
            <div className="rounded-[14px] border border-[#e1e9df] bg-white px-5 py-4 text-[10px] text-[#748074]">
              Sem pedidos de upgrade.
            </div>
          )}

          {requests.map(
            ({
              request,
              store,
              productsUsed,
            }) => (
              <div
                key={request.id}
                className="rounded-[14px] border border-[#e1e9df] bg-white px-5 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-[#141714]">
                        {store.name}
                      </span>

                      <PlanStatus
                        status={
                          request.status
                        }
                      />
                    </div>

                    <div className="mt-1 text-[10px] text-[#748074]">
                      {getPlanDisplayName(
                        request.currentPlanKey,
                      )}{" "}
                      →{" "}
                      <span className="font-bold">
                        {getPlanDisplayName(
                          request.requestedPlanKey,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {store.whatsapp && (
                      <a
                        href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf6cf] px-3 py-1.5 text-[9px] font-bold text-[#58754c] hover:bg-[#dff3b6]"
                      >
                        <MessageCircle
                          size={12}
                        />
                        {store.whatsapp}
                      </a>
                    )}

                    {request.status ===
                      "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            reviewMutation.mutate({
                              requestId:
                                request.id,
                              decision: "rejected",
                            })
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#fff0f0] px-3 py-1.5 text-[9px] font-bold text-[#a64b4b] hover:bg-[#ffe4e4]"
                        >
                          <X size={12} />
                          Rejeitar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            reviewMutation.mutate({
                              requestId:
                                request.id,
                              decision: "approved",
                              assignedPlanKey:
                                reviewPlanSelection[
                                  request.id
                                ],
                            })
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#162016] px-3 py-1.5 text-[9px] font-bold text-white hover:bg-[#2a3a2a]"
                        >
                          <Check size={12} />
                          Aprovar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 text-[9px] text-[#748074] sm:grid-cols-4">
                  <span>
                    Loja:{" "}
                    <span className="font-semibold text-[#465346]">
                      {getPlanDisplayName(
                        store.planKey,
                      )}
                    </span>
                  </span>

                  <span>
                    Limite:{" "}
                    <span className="font-semibold text-[#465346]">
                      {getPlanProductLimitLabel(
                        store.planKey,
                      )}
                    </span>
                  </span>

                  <span>
                    Usados:{" "}
                    <span className="font-semibold text-[#465346]">
                      {productsUsed}
                    </span>
                  </span>

                  <span>
                    Pedido:{" "}
                    <span className="font-semibold text-[#465346]">
                      {formatDateTime(
                        request.createdAt,
                      )}
                    </span>
                  </span>
                </div>

                {request.note && (
                  <p className="mt-2 rounded-lg bg-[#fafcfa] px-3 py-2 text-[10px] text-[#4f5d50]">
                    “{request.note}”
                  </p>
                )}

                {request.status ===
                  "pending" && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-[.13em] text-[#9ba69b]">
                      Atribuir plano aprovado:
                    </span>

                    <PlanSelect
                      value={
                        reviewPlanSelection[
                          request.id
                        ] ??
                        (request.requestedPlanKey as ClientPlanKey)
                      }
                      onChange={(plan) =>
                        setReviewPlanSelection(
                          (current) => ({
                            ...current,
                            [request.id]: plan,
                          }),
                        )
                      }
                    />
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
