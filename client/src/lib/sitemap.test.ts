/**
 * Guarda do sitemap/robots públicos da HOMSTEG.
 *
 * O sitemap é um ficheiro estático em client/public/sitemap.xml,
 * servido em produção em https://www.homsteg.com/sitemap.xml
 * (filesystem da Vercel antes das rewrites do vercel.json — o mesmo
 * mecanismo que serve /favicon.png).
 *
 * Estes testes garantem que:
 *  - o XML é estruturalmente válido (declaração, urlset, tags fechadas);
 *  - TODAS as URLs são do domínio canónico https://www.homsteg.com;
 *  - NENHUMA URL privada/transacional entra (admin, app, callback,
 *    onboarding, carrinho, checkout, conta, mensagens, produto, lojas
 *    dinâmicas);
 *  - o robots.txt aponta para o sitemap canónico.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const publicDir = path.resolve(import.meta.dirname, "..", "..", "public");

const sitemapXml = readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");

const robotsTxt = readFileSync(path.join(publicDir, "robots.txt"), "utf8");

const CANONICAL_ORIGIN = "https://www.homsteg.com";

/** Segmentos de caminho que NUNCA podem aparecer no sitemap. */
const FORBIDDEN_SEGMENTS = new Set([
  "admin",
  "app",
  "api",
  "social",
  "callback",
  "criar-loja",
  "carrinho",
  "checkout",
  "mensagens",
  "conta",
  "produto",
  "store",
  "404",
]);

function extractLocs(xml: string): string[] {
  return Array.from(xml.matchAll(/<loc>([^<]*)<\/loc>/g), match => match[1]);
}

describe("client/public/sitemap.xml", () => {
  it("é XML de sitemap estruturalmente válido", () => {
    expect(sitemapXml.startsWith("<?xml ")).toBe(true);
    expect(sitemapXml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    );
    expect(sitemapXml.trimEnd().endsWith("</urlset>")).toBe(true);

    const openTags = sitemapXml.match(/<url>/g)?.length ?? 0;
    const closeTags = sitemapXml.match(/<\/url>/g)?.length ?? 0;

    expect(openTags).toBeGreaterThan(0);
    expect(openTags).toBe(closeTags);
  });

  it("contém apenas URLs públicas no domínio canónico", () => {
    const locs = extractLocs(sitemapXml);

    expect(locs.length).toBeGreaterThan(0);
    expect(new Set(locs).size).toBe(locs.length);

    for (const loc of locs) {
      expect(loc.startsWith(`${CANONICAL_ORIGIN}/`)).toBe(true);
      expect(loc).not.toMatch(/[?#]/);

      const segments = loc
        .slice(CANONICAL_ORIGIN.length + 1)
        .split("/")
        .filter(Boolean);

      for (const segment of segments) {
        expect(FORBIDDEN_SEGMENTS.has(segment)).toBe(false);
      }
    }
  });

  it("inclui as páginas públicas essenciais", () => {
    const locs = extractLocs(sitemapXml);

    expect(locs).toContain(`${CANONICAL_ORIGIN}/`);
    expect(locs).toContain(`${CANONICAL_ORIGIN}/login`);
    expect(locs).toContain(`${CANONICAL_ORIGIN}/criar-conta`);
    expect(locs).toContain(`${CANONICAL_ORIGIN}/recuperar-palavra-passe`);
  });
});

describe("client/public/robots.txt", () => {
  it("aponta para o sitemap canónico e bloqueia áreas privadas", () => {
    expect(robotsTxt).toContain(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`);
    expect(robotsTxt).toMatch(/^Disallow: \/app$/m);
    expect(robotsTxt).toMatch(/^Disallow: \/admin$/m);
  });
});
