import { ArrowRight, Wallet } from "lucide-react";
import { Link } from "wouter";
import { formatCreditAmount } from "@/lib/plans";
import { useStorePlan } from "./useStorePlan";

/**
 * "CRÉDITO ATUAL" — cartão de créditos do painel
 *
 * principal (Visão geral).
 *
 * Apresentação mínima, conforme definido para o
 * dashboard: apenas o saldo disponível e o atalho
 * para gerir a conta.
 *
 * 1. Crédito atual — o número principal;
 * 2. Texto — "Saldo disponível para utilizar no
 *    Market.";
 * 3. Botão "Gerenciar crédito →" — navega para a
 *    área completa de créditos (/app/credits), onde
 *    ficam comissão, bônus, indicações, código da
 *    loja e código promocional.
 *
 * Nada mais é mostrado aqui: comissão, bônus, código
 * da loja, código promocional e exemplos de ganhos
 * vivem apenas na conta completa.
 */
export default function PlanUsageCard({
  storeId,
}: {
  storeId: string | null | undefined;
}) {
  const { usageQuery, creditMzn } = useStorePlan(storeId);

  if (usageQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111713] p-5">
        <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#16221a] via-[#111713] to-[#0b100c] p-5 text-white shadow-xl sm:p-6">
      {/* Brilho de fundo (vermelho = herói) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-red-500/20 blur-3xl"
      />

      {/* ==========================================================
          CRÉDITO ATUAL
          ========================================================== */}
      <header className="relative flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
          <Wallet className="h-4 w-4 text-lime-300" />
        </span>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
          Crédito atual
        </p>
      </header>

      <p className="relative mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-4xl font-black leading-none tracking-tight text-red-400 drop-shadow-[0_0_24px_rgba(248,113,113,0.35)] sm:text-5xl">
          {formatCreditAmount(creditMzn)}
        </span>

        <span className="text-sm font-bold uppercase tracking-[0.16em] text-red-200/80">
          créditos
        </span>
      </p>

      <p className="relative mt-2.5 text-xs leading-5 text-white/55">
        Saldo disponível para utilizar no Market.
      </p>

      {/* ==========================================================
          GERENCIAR CRÉDITO → conta completa (/app/credits)
          ========================================================== */}
      <Link
        href="/app/credits"
        className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-black/90"
      >
        Gerenciar crédito
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}