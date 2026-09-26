/**
 * ============================================================
 * HELPERS PARTILHADOS DA _kit
 * ============================================================
 */

export function formatMzn(value: number | string): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("pt-MZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatPrice(value: number | string): string {
  return `${formatMzn(value)} MZN`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function discountPercent(
  price: number,
  compareAt: number | null | undefined,
): number | null {
  if (compareAt == null || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** querystring de contexto da loja (storeSlug) */
export function storeQuery(storeSlug?: string): string {
  return storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";
}
