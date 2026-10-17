/**
 * Matriz de variantes — lógica pura partilhada pelos modais
 * de criar/editar produto.
 *
 * Cada variante é uma combinação COMPLETA das opções do
 * produto (ex.: Tamanho=M · Cor=Preto) com preço, stock e
 * SKU opcionais. Campos vazios herdam os valores do produto
 * e a linha não é sequer enviada ao servidor.
 *
 * O payload tem a mesma forma de `productVariantInput`
 * (server/routers.ts), que valida e alinha as linhas às
 * opções do produto antes de persistir.
 */

export type ProductVariantPayload = {
  values: Record<string, string>;
  priceMzn?: number | null;
  stock?: number | null;
  sku?: string | null;
};

/** Variante tal como vem da base de dados (products.variants). */
export type StoredProductVariant = {
  values?: Record<string, string>;
  priceMzn?: number | null;
  stock?: number | null;
  sku?: string | null;
};

/** Textos crus dos três inputs de uma variante. */
export type VariantDetail = {
  price: string;
  stock: string;
  sku: string;
};

export type VariantRow = {
  /** Chave estável da combinação (independente da ordem). */
  signature: string;
  /** Texto apresentado ao merchant (Tamanho: M · Cor: Preto). */
  label: string;
  values: Record<string, string>;
};

/** Limite alinhado com PRODUCT_VARIANTS_MAX (server/routers.ts). */
export const MAX_VARIANT_ROWS = 200;

function sortEntries(values: Record<string, string>) {
  return Object.entries(values).sort(([left], [right]) =>
    left.localeCompare(right),
  );
}

export function variantSignature(values: Record<string, string>) {
  return sortEntries(values)
    .map(([name, value]) => `${name}=${value}`)
    .join("|");
}

/**
 * Combinações (produto cartesiano) das opções válidas —
 * opções sem nome ou sem valores são ignoradas, tal como no
 * envio de `options`. Limitada a MAX_VARIANT_ROWS para não
 * travar a edição de produtos com muitas combinações.
 */
export function buildVariantRows(options: {
  name: string;
  values: string[];
}[]): { rows: VariantRow[]; truncated: boolean } {
  const validOptions = options
    .map(option => ({
      name: option.name.trim(),
      values: option.values.map(value => value.trim()).filter(Boolean),
    }))
    .filter(option => option.name && option.values.length > 0);

  if (validOptions.length === 0) {
    return { rows: [], truncated: false };
  }

  let rows: VariantRow[] = [{ signature: "", label: "", values: {} }];

  for (const option of validOptions) {
    const next: VariantRow[] = [];

    for (const row of rows) {
      for (const value of option.values) {
        const values = { ...row.values, [option.name]: value };

        next.push({
          signature: variantSignature(values),
          label: Object.entries(values)
            .map(([name, item]) => `${name}: ${item}`)
            .join(" · "),
          values,
        });
      }
    }

    rows = next;

    if (rows.length > MAX_VARIANT_ROWS) {
      return { rows: rows.slice(0, MAX_VARIANT_ROWS), truncated: true };
    }
  }

  return { rows, truncated: false };
}

/**
 * Recupera os detalhes guardados (price/stock/sku) para as
 * assinaturas das combinações atuais.
 */
export function variantDetailsFromStored(
  stored?: StoredProductVariant[] | null,
): Record<string, VariantDetail> {
  const details: Record<string, VariantDetail> = {};

  for (const variant of stored ?? []) {
    const signature = variantSignature(variant.values ?? {});

    if (!signature) {
      continue;
    }

    details[signature] = {
      price: variant.priceMzn == null ? "" : String(variant.priceMzn),
      stock: variant.stock == null ? "" : String(variant.stock),
      sku: variant.sku ?? "",
    };
  }

  return details;
}

/** Mensagem de erro primeiro inválida, ou null. */
export function validateVariantDetails(
  rows: VariantRow[],
  details: Record<string, VariantDetail>,
): string | null {
  for (const row of rows) {
    const detail = details[row.signature];

    if (!detail) {
      continue;
    }

    const price = detail.price.trim();
    const stock = detail.stock.trim();

    if (price && (!Number.isFinite(Number(price)) || Number(price) < 0)) {
      return `Preço inválido na variante "${row.label}".`;
    }

    if (stock && (!Number.isFinite(Number(stock)) || Number(stock) < 0)) {
      return `Stock inválido na variante "${row.label}".`;
    }

    if (detail.sku.trim().length > 80) {
      return `SKU demasiado longo na variante "${row.label}" (máx. 80).`;
    }
  }

  return null;
}

/**
 * Payload enviado em products.create/products.update — apenas
 * as combinações com pelo menos um valor próprio. O resto
 * herda preço/stock do produto.
 */
export function buildVariantPayload(
  rows: VariantRow[],
  details: Record<string, VariantDetail>,
): ProductVariantPayload[] {
  const payload: ProductVariantPayload[] = [];

  for (const row of rows) {
    const detail = details[row.signature];

    if (!detail) {
      continue;
    }

    const price = detail.price.trim();
    const stock = detail.stock.trim();
    const sku = detail.sku.trim();

    if (!price && !stock && !sku) {
      continue;
    }

    payload.push({
      values: row.values,
      priceMzn: price ? Math.round(Number(price)) : null,
      stock: stock ? Math.round(Number(stock)) : null,
      sku: sku || null,
    });
  }

  return payload;
}
