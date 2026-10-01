/*
 * Helpers de CRÉDITO da loja.
 *
 * A HOMSTEG é 100% gratuita: não existem planos,
 * mensalidades, subscrições nem upgrades. O crédito
 * (MZN) é o único sistema pago e é usado APENAS para
 * comprar/desbloquear funcionalidades, modelos e
 * componentes no Market.
 */

/**
 * Crédito da loja, exibido no dashboard.
 * Sempre "Crédito: N"; sem crédito definido conta como 0.
 */
export function formatStoreCredit(
  creditMzn: number | null | undefined,
) {
  return `Crédito: ${(creditMzn ?? 0).toLocaleString("pt-PT")}`;
}
