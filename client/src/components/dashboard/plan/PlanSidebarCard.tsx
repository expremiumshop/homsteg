import { useState } from "react";

import {
  getPlanDisplayName,
  getPlanProductLimit,
} from "@/lib/plans";
import { useStorePlan } from "./useStorePlan";
import UpgradePlanModal from "./UpgradePlanModal";

export default function PlanSidebarCard({
  storeId,
}: {
  storeId: string | null | undefined;
}) {
  const [upgradeOpen, setUpgradeOpen] =
    useState(false);

  const {
    planKey,
    productsUsed,
    planQuery,
  } = useStorePlan(storeId);

  const limit =
    getPlanProductLimit(planKey);

  const usageLabel =
    limit === null
      ? `${productsUsed} produtos`
      : `${productsUsed} / ${limit}`;

  const paidUntil =
    planQuery.data?.store
      .subscriptionPaidUntil;

  const paidUntilLabel = paidUntil
    ? new Date(paidUntil).toLocaleDateString(
        "pt-PT",
        {
          dateStyle: "short",
        },
      )
    : null;

  return (
    <>
      <div className="rounded-2xl bg-[#111713] p-4 text-white">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-300">
            Plano atual
          </span>

          <span className="rounded-full bg-lime-300 px-2 py-0.5 text-[10px] font-bold text-[#111713]">
            {planKey.toUpperCase()}
          </span>
        </div>

        <p className="text-sm font-semibold">
          {getPlanDisplayName(planKey)}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-400">
          {usageLabel} produtos
        </p>

        {paidUntilLabel && (
          <p className="text-xs leading-5 text-gray-400">
            Renova a {paidUntilLabel}
          </p>
        )}

        <button
          type="button"
          onClick={() => setUpgradeOpen(true)}
          disabled={!storeId}
          className="mt-3 w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#111713] transition hover:bg-gray-100 disabled:opacity-50"
        >
          Pedir upgrade
        </button>
      </div>

      {upgradeOpen && storeId && (
        <UpgradePlanModal
          storeId={storeId}
          currentPlanKey={planKey}
          onClose={() => setUpgradeOpen(false)}
        />
      )}
    </>
  );
}
