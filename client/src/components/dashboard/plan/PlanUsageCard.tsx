import { formatStoreCredit } from "@/lib/plans";
import { useStorePlan } from "./useStorePlan";
import PlanBadge from "./PlanBadge";

/**
 * Cartão de crédito do dashboard.
 *
 * Sem planos e sem contadores de utilização: a loja
 * é gratuita e o utilizador gere produtos
 * normalmente. Mostra apenas o saldo de crédito,
 * que é usado exclusivamente no Market. A regra de
 * stock (limite de produtos) só aparece no momento
 * exato em que é relevante — nunca de forma
 * constante no painel.
 */
export default function PlanUsageCard({
  storeId,
}: {
  storeId: string | null | undefined;
}) {
  const {
    usageQuery,
    creditMzn,
  } = useStorePlan(storeId);

  if (usageQuery.isLoading) {
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
            Crédito
          </p>

          <div className="mt-2 flex items-center gap-2">
            <PlanBadge creditMzn={creditMzn} />

            <span className="text-sm font-semibold text-slate-950">
              {formatStoreCredit(creditMzn)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">
            Saldo
          </p>

          <p className="text-sm font-bold text-slate-950">
            {(creditMzn ?? 0).toLocaleString("pt-PT")} MZN
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        A sua loja é 100% gratuita — sem planos nem
        mensalidades. Os créditos são usados apenas para
        desbloquear funcionalidades no Market.
      </p>
    </div>
  );
}
