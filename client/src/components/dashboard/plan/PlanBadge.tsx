import { formatStoreCredit } from "@/lib/plans";

/**
 * Mostra o saldo de crédito da loja.
 * O crédito é usado apenas para comprar
 * funcionalidades no Market — a loja em si
 * é sempre gratuita.
 * Sem dados → "Créditos: 0".
 */
export default function PlanBadge({
  creditMzn,
  className = "",
}: {
  creditMzn: number | null | undefined;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold bg-lime-100 text-[#111713] ${className}`}
    >
      {formatStoreCredit(creditMzn)}
    </span>
  );
}
