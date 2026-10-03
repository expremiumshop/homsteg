/*
 * Helpers de CRÉDITOS da loja.
 *
 * A HOMSTEG é 100% gratuita: não existem planos,
 * mensalidades, subscrições nem upgrades. Os
 * créditos são a unidade interna da plataforma
 * (NÃO são dinheiro nem moeda) e servem APENAS
 * para comprar/desbloquear funcionalidades,
 * modelos e componentes no Market.
 *
 * Toda loja começa automaticamente com 100.000
 * créditos gratuitos.
 */

/**
 * Agrupa milhares com ponto, ex.: 100000 → "100.000".
 *
 * Formatação determinística (sem Intl/locale): o
 * separador de milhar é sempre "." — igual no
 * servidor, no browser e em qualquer ambiente.
 * Créditos nunca usam símbolo monetário.
 */
function groupThousands(credits: number): string {
  const truncated = Math.trunc(credits ?? 0);

  const sign = truncated < 0 ? "-" : "";

  const digits = Math.abs(truncated).toString();

  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Montante de créditos, ex.: "100.000".
 *
 * Para usar sob um rótulo "Créditos" já existente
 * (tabelas do Admin, etc.) sem duplicar a palavra.
 */
export function formatCreditAmount(
  credits: number | null | undefined,
) {
  return groupThousands(credits ?? 0);
}

/**
 * Formata um número de créditos, ex.: "100.000 créditos".
 *
 * Regra de exibição: nunca usar MZN, MT, MZM, símbolos
 * monetários nem a palavra "moeda" — créditos são
 * uma unidade interna da HOMSTEG.
 */
export function formatCredits(
  credits: number | null | undefined,
) {
  return `${formatCreditAmount(credits)} créditos`;
}

/**
 * Crédito da loja, exibido no dashboard.
 * Sempre "Créditos: 100.000"; sem dados conta como 0.
 */
export function formatStoreCredit(
  creditMzn: number | null | undefined,
) {
  return `Créditos: ${formatCreditAmount(creditMzn)}`;
}
