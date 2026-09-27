import { useRoute } from "wouter";

import NovaStorefront from "@/themes/nova/Storefront";
import LuxeStorefront from "@/themes/luxe/Storefront";
import UrbanStorefront from "@/themes/urban/Storefront";
import PrimeStorefront from "@/themes/prime/Storefront";
import MarketStorefront from "@/themes/market/Storefront";
import EssenzaStorefront from "@/themes/essenza/Storefront";
import CalizaStorefront from "@/themes/caliza/Storefront";
import ChazucaStorefront from "@/themes/chazuca/Storefront";
import { trpc } from "@/lib/trpc";

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
 * mesma arquitetura: slug → stores.bySlug → Neon → themeKey → tema.
 */
export default function Storefront({
  params,
  slugOverride,
}: StorefrontProps) {
  const [, routeParams] = useRoute("/store/:slug");

  const slug =
    slugOverride ?? params?.slug ?? routeParams?.slug;

  // The public storefront is the real store, never a theme preview. Load the
  // store once to select its persisted theme; every theme receives only this
  // store's products.
  const storeQuery = trpc.stores.bySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: Boolean(slug) },
  );

  if (storeQuery.isLoading) {
    return <NovaStorefront storeSlug={slug} />;
  }

  const themeKey = storeQuery.data?.store.themeKey ?? "nova";

  if (themeKey === "luxe" && storeQuery.data) {
    return (
      <LuxeStorefront
        mode="store"
        store={storeQuery.data.store}
        products={storeQuery.data.products}
      />
    );
  }

  if (themeKey === "urban" && storeQuery.data) {
    return (
      <UrbanStorefront
        mode="store"
        store={storeQuery.data.store}
        products={storeQuery.data.products}
      />
    );
  }

  if (themeKey === "prime" && storeQuery.data) {
    return (
      <PrimeStorefront
        mode="store"
        store={storeQuery.data.store}
        products={storeQuery.data.products}
      />
    );
  }

  if (themeKey === "market" && storeQuery.data) {
    return (
      <MarketStorefront
        mode="store"
        storeSlug={slug}
      />
    );
  }

  if (themeKey === "essenza" && storeQuery.data) {
    return (
      <EssenzaStorefront
        mode="store"
        storeSlug={slug}
      />
    );
  }

  if (themeKey === "caliza" && storeQuery.data) {
    return (
      <CalizaStorefront
        mode="store"
        storeSlug={slug}
      />
    );
  }

  if (themeKey === "chazuca" && storeQuery.data) {
    return (
      <ChazucaStorefront
        mode="store"
        storeSlug={slug}
      />
    );
  }

  // NOVA is also the safe fallback for themes whose storefront is not yet
  // implemented. It still loads only the real store and its real products.
  return <NovaStorefront storeSlug={slug} />;
}
