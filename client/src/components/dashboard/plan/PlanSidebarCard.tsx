import { Link } from "wouter";

import { formatCreditAmount } from "@/lib/plans";
import { useStorePlan } from "./useStorePlan";

/**
 * Cartão compacto de créditos da sidebar do dashboard.
 *
 * Mostra apenas o crédito atual e o atalho "Gerenciar
 * crédito →" para a conta completa (/app/credits).
 *
 * Conforme a apresentação definida para o dashboard,
 * NÃO mostra aqui: comissão, bônus, código da loja,
 * código promocional ou exemplos de indicações — tudo
 * isso vive apenas na conta completa.
 */
export default function PlanSidebarCard({
  storeId,
}: {
  storeId: string | null | undefined;
}) {
  const { creditMzn } = useStorePlan(storeId);

  return (
    <div className="rounded-2xl bg-[#111713] p-4 text-white">
      <p className="text-xs font-semibold text-gray-300">
        Créditos
      </p>

      <p className="mt-1 text-sm font-semibold">
        {formatCreditAmount(creditMzn)}
      </p>

      <Link
        href="/app/credits"
        className="mt-2 flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
      >
        Gerenciar crédito
        <span aria-hidden className="text-gray-300">
          →
        </span>
      </Link>

      <p className="mt-2 text-xs leading-5 text-gray-400">
        A loja é gratuita. Os créditos servem
        apenas para o Market.
      </p>
    </div>
  );
}
