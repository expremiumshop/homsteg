/*
 * HOMSTEG — Regras de negócio partilhadas.
 *
 * MODELO DE NEGÓCIO (2026):
 * - A HOMSTEG é uma plataforma de criação de lojas
 *   online 100% GRATUITA.
 * - Não existem planos, mensalidades, subscrições,
 *   upgrades nem períodos de pagamento.
 * - Criar e usar a loja é sempre gratuito.
 * - O único sistema pago é o de CRÉDITOS, usados
 *   apenas para comprar/desbloquear funcionalidades,
 *   modelos e componentes no Market.
 */

export function assertTenantAccess({ role, memberStoreIds, storeId }: { role: "admin" | "merchant"; memberStoreIds: string[]; storeId: string }) {
  if (role === "admin") return true;
  if (!memberStoreIds.includes(storeId)) throw new Error("TENANT_ACCESS_DENIED");
  return true;
}

export function sanitizeStoreId(storeId: unknown) {
  if (typeof storeId !== "string" || storeId.trim().length < 3 || storeId.length > 64) throw new Error("INVALID_STORE_ID");
  return storeId.trim();
}
