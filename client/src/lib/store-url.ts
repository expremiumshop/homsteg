/**
 * Domínio base das lojas HOMSTEG.
 *
 * Em produção cada loja é publicada como subdomínio do seu
 * slug único:
 *   moda.homsteg.com
 *   modernfashion.homsteg.com
 *   fashionatefashion.homsteg.com
 *
 * Em desenvolvimento (localhost) as lojas abrem pela rota
 * interna `/store/:slug`, porque os subdomínios não
 * resolvem no ambiente local.
 */
export const STORE_BASE_DOMAIN = "homsteg.com";

function normalizeSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Deteta se a aplicação está a correr em desenvolvimento
 * (browser em localhost). Em builds de produção o hostname
 * nunca é localhost, pelo que a deteção funciona em Vercel
 * e em qualquer domínio real.
 */
export function isDevEnvironment() {
  if (typeof window === "undefined") {
    // Fora do browser (SSR/build): comportamento de produção.
    return false;
  }

  return isDevHostname(window.location.hostname);
}

/**
 * Hostname público da loja no formato `<slug>.homsteg.com`.
 */
export function getStoreHostname(slug: string) {
  return `${normalizeSlug(slug)}.${STORE_BASE_DOMAIN}`;
}

/**
 * Rota interna (path-based) da loja, usada em desenvolvimento
 * e pela navegação da aplicação. As rotas existentes
 * continuam inalteradas.
 */
export function getStorePath(slug: string) {
  return `/store/${encodeURIComponent(normalizeSlug(slug))}`;
}

/**
 * Extrai o slug da loja a partir de um hostname de subdomínio.
 *
 * Regras:
 * - `fresh1.homsteg.com`        → "fresh1"
 * - `anotherstore.homsteg.com`  → "anotherstore"
 * - `www.homsteg.com`           → null (site principal)
 * - `homsteg.com` (apex)        → null (site principal)
 * - `localhost` / `127.0.0.1`   → null (desenvolvimento)
 * - `*.vercel.app`              → null (URLs do projeto Vercel:
 *                                  o primeiro label é o projeto,
 *                                  nunca um slug de loja)
 * - subdomínios profundos
 *   (`a.b.homsteg.com`)         → null (não identificam loja)
 *
 * Devolve null sempre que o hostname NÃO identifica uma loja,
 * para que o site principal continue a ser servido.
 */
export function getStoreSlugFromHostname(
  hostname: string,
): string | null {
  const normalized = hostname.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  /*
   * Desenvolvimento: subdomínios não resolvem em localhost.
   * As lojas continuam a abrir pela rota /store/:slug.
   */
  if (isDevHostname(normalized)) {
    return null;
  }

  /*
   * URLs do projeto na Vercel (produção e previews):
   * o primeiro label é o nome do projeto, não um slug.
   */
  if (
    normalized === "vercel.app" ||
    normalized.endsWith(".vercel.app")
  ) {
    return null;
  }

  const baseSuffix = `.${STORE_BASE_DOMAIN}`;

  /*
   * Apenas hostnames do próprio domínio HOMSTEG
   * publicam lojas por subdomínio.
   */
  if (!normalized.endsWith(baseSuffix)) {
    return null;
  }

  /*
   * `homsteg.com` (apex) não tem sufixo ".homsteg.com",
   * pelo que aqui só chegam subdomínios.
   */
  const withoutBase = normalized.slice(
    0,
    normalized.length - baseSuffix.length,
  );

  if (!withoutBase) {
    return null;
  }

  /*
   * `www.homsteg.com` e `www.fresh1.homsteg.com`:
   * o prefixo "www" nunca faz parte do slug.
   */
  const withoutWww =
    withoutBase === "www"
      ? ""
      : withoutBase.startsWith("www.")
        ? withoutBase.slice(4)
        : withoutBase;

  if (!withoutWww) {
    return null;
  }

  /*
   * Subdomínios profundos (ex.: "a.b") não identificam
   * uma loja — o slug é um único label.
   */
  if (withoutWww.includes(".")) {
    return null;
  }

  const slug = normalizeSlug(withoutWww);

  return slug || null;
}

function isDevHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost")
  );
}

/**
 * URL pública completa da loja:
 * - desenvolvimento → `/store/:slug` (funciona em localhost)
 * - produção → `https://<slug>.homsteg.com`
 */
export function getPublicStoreUrl(slug: string) {
  if (isDevEnvironment()) {
    return getStorePath(slug);
  }

  return `https://${getStoreHostname(slug)}`;
}

/**
 * Texto de apresentação do endereço da loja, coerente com
 * `getPublicStoreUrl` no ambiente atual:
 * - desenvolvimento → `/store/:slug`
 * - produção → `<slug>.homsteg.com`
 */
export function getStoreUrlLabel(slug: string) {
  if (isDevEnvironment()) {
    return getStorePath(slug);
  }

  return getStoreHostname(slug);
}
