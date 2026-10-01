import { formatStoreCredit } from "@/lib/plans";
import { useStorePlan } from "./useStorePlan";

export default function PlanSidebarCard({
  storeId,
}: {
  storeId: string | null | undefined;
}) {
  const {
    creditMzn,
  } = useStorePlan(storeId);

  return (
    <div className="rounded-2xl bg-[#111713] p-4 text-white">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-300">
          Crédito
        </span>
      </div>

      <p className="text-sm font-semibold">
        {formatStoreCredit(creditMzn)}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-400">
        A loja é gratuita. Os créditos servem
        apenas para o Market.
      </p>
    </div>
  );
}
