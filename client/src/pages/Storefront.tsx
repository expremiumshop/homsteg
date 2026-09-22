import { useRoute } from "wouter";

import NovaStorefront from "@/themes/nova/Storefront";
import LuxeStorefront from "@/themes/luxe/Storefront";
import { trpc } from "@/lib/trpc";

export default function Storefront({
  storeSlug,
}: {
  storeSlug?: string;
}) {
  const [, params] = useRoute("/store/:slug");

  const slug = storeSlug ?? params?.slug;

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

  // NOVA is also the safe fallback for themes whose storefront is not yet
  // implemented. It still loads only the real store and its real products.
  return <NovaStorefront storeSlug={slug} />;
}
