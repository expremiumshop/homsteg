import { useState } from "react";
import { Link } from "wouter";

import {
  BadgeCheck,
  Check,
  Copy,
  Gift,
  Percent,
  Sparkles,
  Ticket,
  UserPlus,
  Wallet,
} from "lucide-react";

import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

import { formatCreditAmount } from "@/lib/plans";

import { useStorePlan } from "./useStorePlan";

/**
 * "MINHA CONTA DE CRÉDITOS" — a conta completa de
 * créditos da loja (/app/credits), aberta a partir do
 * botão "Gerenciar crédito →" do painel principal.
 *
 * O painel principal (Visão geral) mostra apenas o
 * Crédito atual; tudo o que se segue vive AQUI:
 *
 *   1. Crédito atual — saldo disponível no Market;
 *   2. Comissão acumulada — histórico de todas as
 *      comissões recebidas (nunca diminui; cada
 *      comissão também entra no crédito atual);
 *   3. Bônus acumulado — créditos extra de campanhas;
 *   4. Convidar outras lojas — área de partilha do
 *      convite (mensagem com o código da loja);
 *   5. Código da loja — exclusivo, com botão Copiar;
 *   6. Exemplos de ganhos por indicação — calculados
 *      a partir das recompensas vigentes devolvidas
 *      pelo servidor (storeCodeRewards);
 *   7. Código promocional — campo para inserir o
 *      código de outra loja enquanto a loja ainda não
 *      utilizou nenhum (uma única vez por loja);
 *      depois do uso fica apenas o registo.
 *
 * Todos os saldos são "créditos" — unidade interna da
 * plataforma. As recompensas exibidas vêm sempre do
 * servidor (storeCodeRewards em stores.usage.current)
 * — nunca constantes no cliente.
 */
export default function CreditsPage({
  storeId,
}: {
  storeId: string | null | undefined;
}) {
  const {
    usageQuery,
    creditMzn,
  } = useStorePlan(storeId);

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [promoInput, setPromoInput] = useState("");

  const utils = trpc.useUtils();

  const usePromoCode =
    trpc.stores.usage.usePromoCode.useMutation({
      onSuccess: async (result) => {
        toast.success(
          `Código aplicado! A loja recebeu ${formatCreditAmount(result.userRewardCredits)} créditos.`,
        );

        setPromoInput("");

        await utils.stores.usage.current.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  /*
   * Regra: cada loja usa apenas UM código promocional,
   * uma única vez. Depois de usado, o campo desaparece
   * (fica só o registo do código utilizado).
   */
  const promoCode = usageQuery.data?.promoCode ?? null;

  function submitPromoCode() {
    if (!storeId || !promoInput.trim()) {
      return;
    }

    usePromoCode.mutate({
      storeId,
      code: promoInput,
    });
  }

  if (usageQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111713] p-5">
        <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
      </div>
    );
  }

  const store = usageQuery.data?.store;

  const commissionCredit = store?.commissionCredit ?? 0;
  const bonusCredit = store?.bonusCredit ?? 0;
  const storeCode = store?.storeCode ?? null;

  /* Recompensas vigentes — fonte de verdade no servidor. */
  const ownerRewardCredits =
    usageQuery.data?.storeCodeRewards.ownerRewardCredits ?? 0;
  const userRewardCredits =
    usageQuery.data?.storeCodeRewards.userRewardCredits ?? 0;

  async function copyToClipboard(
    value: string,
    successMessage: string,
    onCopied: () => void,
  ) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* Fallback sem permissões de clipboard. */
      const input = document.createElement("textarea");

      input.value = value;
      input.style.position = "fixed";
      input.style.opacity = "0";

      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    toast.success(successMessage);
    onCopied();
  }

  function copyStoreCode() {
    if (!storeCode) {
      return;
    }

    void copyToClipboard(
      storeCode,
      "Código da loja copiado.",
      () => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      },
    );
  }

  function copyInviteMessage() {
    if (!storeCode) {
      return;
    }

    const message = [
      "Cria a tua loja gratuita na HOMSTEG!",
      `Usa o meu código ${storeCode} e ganham créditos os dois.`,
    ].join(" ");

    void copyToClipboard(
      message,
      "Convite copiado.",
      () => {
        setCopiedInvite(true);
        setTimeout(() => setCopiedInvite(false), 2000);
      },
    );
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-[#34483d] bg-[#283b31] p-5 text-white sm:p-6">
      {/* Brilhos de fundo (vermelho = herói, lima = ganhos) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-red-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl"
      />

      {/* ==========================================================
          CABEÇALHO
          ========================================================== */}
      <header className="relative flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
            Gerenciar conta
          </p>

          <h1 className="mt-1 flex items-center gap-2.5 text-xl font-black tracking-tight sm:text-2xl">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
              <Wallet className="h-4 w-4 text-lime-300" />
            </span>
            Minha conta de créditos
          </h1>

          {store?.name && (
            <p className="mt-1 truncate text-sm font-bold text-white/70">
              {store.name}
            </p>
          )}
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-lime-300/20 bg-lime-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-lime-200">
          <BadgeCheck className="h-3 w-3" />
          Conta 100% gratuita
        </span>
      </header>

      {/* ==========================================================
          1. CRÉDITO ATUAL (herói, vermelho)
          ========================================================== */}
      <div className="relative mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-300">
          Crédito atual
        </p>

        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-4xl font-black leading-none tracking-tight text-red-400 drop-shadow-[0_0_24px_rgba(248,113,113,0.35)] sm:text-5xl">
            {formatCreditAmount(creditMzn)}
          </span>

          <span className="text-sm font-bold uppercase tracking-[0.16em] text-red-200/80">
            créditos
          </span>
        </p>

        <p className="mt-2.5 max-w-xl text-xs leading-5 text-white/55">
          Saldo disponível para utilizar no Market.
        </p>
      </div>

      {/* ==========================================================
          2 + 3. COMISSÃO ACUMULADA E BÔNUS ACUMULADO
          ========================================================== */}
      <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
              Comissão acumulada
            </p>

            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-lime-300/15">
              <Percent className="h-3.5 w-3.5 text-lime-300" />
            </span>
          </div>

          <p className="mt-2 text-2xl font-black tracking-tight text-white">
            {formatCreditAmount(commissionCredit)}
          </p>

          <p className="mt-1.5 text-[11px] leading-4 text-white/45">
            Histórico acumulado de todas as comissões
            recebidas — nunca diminui. Cada comissão
            também entra no Crédito atual.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
              Bônus acumulado
            </p>

            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-lime-300/15">
              <Sparkles className="h-3.5 w-3.5 text-lime-300" />
            </span>
          </div>

          <p className="mt-2 text-2xl font-black tracking-tight text-white">
            {formatCreditAmount(bonusCredit)}
          </p>

          <p className="mt-1.5 text-[11px] leading-4 text-white/45">
            Créditos extra atribuídos à sua loja por
            bônus e campanhas da HOMSTEG.
          </p>
        </div>
      </div>

      {/* ==========================================================
          4 + 5. CONVIDAR OUTRAS LOJAS + CÓDIGO DA LOJA
          ========================================================== */}
      <div className="relative mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
          Convidar outras lojas
        </p>

        <p className="mt-1 text-xs leading-5 text-white/45">
          O código da sua loja é o seu convite — quem o
          utilizar rende comissão para a sua loja.
        </p>

        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-300/15">
                <Ticket className="h-4 w-4 text-lime-300" />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                  Código da loja
                </p>

                {storeCode ? (
                  <p className="truncate font-mono text-lg font-black tracking-[0.22em] text-lime-300">
                    {storeCode}
                  </p>
                ) : (
                  <p className="text-xs text-white/40">
                    A gerar…
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={copyStoreCode}
              disabled={!storeCode}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-white transition hover:border-white/30 hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3.5 w-3.5 text-lime-300" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copiar código
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={copyInviteMessage}
            disabled={!storeCode}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-lime-300/20 bg-lime-300/10 px-3.5 py-2.5 text-xs font-bold text-lime-200 transition hover:border-lime-300/40 hover:bg-lime-300/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {copiedInvite ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Convite copiado
              </>
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5" />
                Copiar convite para partilhar
              </>
            )}
          </button>

          <ul className="mt-3.5 space-y-1.5 border-t border-white/10 pt-3 text-[11px] leading-4 text-white/55">
            <li className="flex gap-2">
              <span
                aria-hidden
                className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-lime-300"
              />
              <span>
                Partilhe o código com outras lojas — nunca
                expira e pode ser utilizado por várias.
              </span>
            </li>

            <li className="flex gap-2">
              <span
                aria-hidden
                className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-lime-300"
              />
              <span>
                Ganha{" "}
                <span className="font-bold text-lime-300">
                  +
                  {formatCreditAmount(
                    ownerRewardCredits,
                  )}{" "}
                  créditos de comissão
                </span>{" "}
                por cada loja que utilizar o seu código.
              </span>
            </li>

            <li className="flex gap-2">
              <span
                aria-hidden
                className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-lime-300"
              />
              <span>
                A comissão soma no histórico e também no
                Crédito atual — pronta a gastar no Market.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ==========================================================
          6. EXEMPLOS DE GANHOS POR INDICAÇÃO

          Calculados a partir das recompensas vigentes do
          servidor — nunca constantes no cliente.
          ========================================================== */}
      <div className="relative mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
          Exemplos de ganhos por indicação
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[1, 3, 10].map((count) => (
            <div
              key={count}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                {count}{" "}
                {count === 1
                  ? "loja indicada"
                  : "lojas indicadas"}
              </p>

              <p className="mt-2 text-xl font-black tracking-tight text-lime-300">
                +
                {formatCreditAmount(
                  ownerRewardCredits * count,
                )}
              </p>

              <p className="mt-1.5 text-[11px] leading-4 text-white/45">
                créditos de comissão — somados no
                histórico e no Crédito atual.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ==========================================================
          7. CÓDIGO PROMOCIONAL (usar o código de OUTRA loja)

          Regras: uma loja usa apenas um código, uma única
          vez — depois do uso o campo desaparece e fica o
          registo do código utilizado. Nunca o próprio código.
          ========================================================== */}
      <div className="relative mt-6 border-t border-white/10 pt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
          Código promocional
        </p>

        {promoCode ? (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                  <Gift className="h-4 w-4 text-white/70" />
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                    Código promocional utilizado
                  </p>

                  <p className="truncate font-mono text-lg font-black tracking-[0.22em] text-white">
                    {promoCode.usedStoreCode}
                  </p>
                </div>
              </div>

              <span className="inline-flex shrink-0 items-center rounded-full bg-lime-300/15 px-2.5 py-1 text-xs font-black text-lime-300">
                +
                {formatCreditAmount(
                  promoCode.userRewardCredits,
                )}
              </span>
            </div>

            <p className="mt-2.5 border-t border-white/10 pt-2.5 text-[11px] leading-4 text-white/45">
              Este código já foi aplicado à conta — cada
              loja só pode utilizar um código promocional,
              uma única vez.
            </p>
          </div>
        ) : (
          <div className="mt-1">
            <p className="text-xs leading-5 text-white/45">
              Recebeu o código de outra loja? Insira-o
              para ganhar{" "}
              <span className="font-bold text-lime-300">
                +{formatCreditAmount(userRewardCredits)}{" "}
                créditos de bônus
              </span>{" "}
              no Crédito atual — apenas uma vez por loja.
            </p>

            <form
              className="mt-3 flex flex-wrap items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                submitPromoCode();
              }}
            >
              <input
                type="text"
                value={promoInput}
                onChange={(event) =>
                  setPromoInput(event.target.value.toUpperCase())
                }
                placeholder="Código promocional de outra loja"
                maxLength={32}
                disabled={usePromoCode.isPending || !storeId}
                className="h-10 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-3 font-mono text-sm uppercase tracking-wider text-white placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-white/35 focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={
                  usePromoCode.isPending ||
                  !storeId ||
                  promoInput.trim().length < 4
                }
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 text-xs font-bold text-[#111713] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Gift className="h-3.5 w-3.5" />
                {usePromoCode.isPending
                  ? "A aplicar…"
                  : "Usar código"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ==========================================================
          NOTA DE RODAPÉ
          ========================================================== */}
      <p className="relative mt-5 border-t border-white/10 pt-4 text-[11px] leading-5 text-white/40">
        A sua loja é 100% gratuita — sem planos nem
        mensalidades. Os créditos são usados apenas para
        desbloquear funcionalidades no Market.
      </p>

      <Link
        href="/app"
        className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white/60 transition hover:text-white"
      >
        ← Voltar ao painel
      </Link>
    </section>
  );
}
