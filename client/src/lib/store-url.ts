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

  const hostname = window.location.hostname;

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost")
  );
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
