import {
  getPlanProductLimitLabel,
  formatPlanUsage,
  getPlanDisplayName,
} from "@/lib/plans";
import { useStorePlan } from "./useStorePlan";
import PlanBadge from "./PlanBadge";

export default function PlanUsageCard({
  storeId,
}: {
  storeId: string | null | undefined;
}) {
  const {
    planQuery,
    planKey,
    productsUsed,
    latestRequest,
  } = useStorePlan(storeId);

  const limit =
    getPlanProductLimitLabel(planKey);

  const pendingRequest =
    latestRequest?.status === "pending"
      ? latestRequest
      : null;

  if (planQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-600">
            Plano ativo
          </p>

          <div className="mt-2 flex items-center gap-2">
            <PlanBadge planKey={planKey} />

            <span className="text-sm font-semibold text-slate-950">
              {getPlanDisplayName(planKey)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">
            Limite
          </p>

          <p className="text-sm font-bold text-slate-950">
            {limit}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Produtos usados
        </span>

        <span className="font-bold text-slate-950">
          {formatPlanUsage(
            productsUsed,
            planKey,
          )}
        </span>
      </div>

      {pendingRequest && (
        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          Pedido de upgrade para{" "}
          {getPlanDisplayName(
            pendingRequest.requestedPlanKey,
          )}{" "}
          aguarda aprovação.
        </p>
      )}
    </div>
  );
}
