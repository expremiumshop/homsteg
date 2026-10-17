import { useRoute } from "wouter";

import NovaStorefront from "@/themes/nova/Storefront";
import { trpc } from "@/lib/trpc";
import { isCustomDomainHostname } from "@/lib/store-url";

type StorefrontProps = {
  /** Route params do wouter (/store/:slug). */
  params?: { slug?: string };

  /**
   * Slug explícito, usado quando a loja é aberta por subdomínio
   * (ex.: fresh1.homsteg.com). Tem prioridade sobre params.slug.
   */
  slugOverride?: string;
};

/**
 * Componente de rota "/store/:slug". Wouter passa os params
 * (params.slug); nenhum outro prop é fornecido ou necessário.
 *
 * Também é montado diretamente pela raiz quando o hostname é um
 * subdomínio de loja (slugOverride), reutilizando exatamente a
 * mesma arquitetura: slug ? stores.bySlug ? Neon ? Tema Nova.
 */
export default function Storefront({ params, slugOverride }: StorefrontProps) {
  const [, routeParams] = useRoute("/store/:slug");
  const customDomainStoreSlug =
    typeof window !== "undefined" &&
    isCustomDomainHostname(window.location.hostname)
      ? new URLSearchParams(window.location.search).get("storeSlug")
      : null;

  const slug =
    customDomainStoreSlug ?? slugOverride ?? params?.slug ?? routeParams?.slug;

  // Load this store before rendering its public storefront.
  // The store query validates the slug and preserves the existing data flow.
  // Every storefront request remains scoped to this store.
  const storeQuery = trpc.stores.bySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: Boolean(slug) }
  );

  /*
   * Carregamento inicial: enquanto stores.bySlug carrega a loja
   * , mostramos apenas um spinner neutro, SEM nenhum
   * texto de carregamento. Montar o storefront Nova aqui faria
   * o visitante ver primeiro um tema/branding errado e depois
   * um flash quando o tema real monta. Nenhum storefront é
   * renderizado nesta fase.
   */
  if (storeQuery.isLoading) {
    return (
      <div
        aria-busy="true"
        className="flex min-h-screen items-center justify-center bg-white"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500" />
      </div>
    );
  }

  // Nova is the only storefront theme; legacy stored themeKey values are ignored.
  return <NovaStorefront storeSlug={slug} />;
}
