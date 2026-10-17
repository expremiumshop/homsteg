import { useMemo, type FormEvent } from "react";
import { Search, Store } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { ProductGrid, type NovaProduct } from "./components/ProductGrid";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n-context";
import StoreI18nBoundary from "./StoreI18nBoundary";

type PublicProduct = {
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;
  priceMzn: number;
  compareAtPriceMzn?: number | null;
  category?: string | null;
  status?: string;
  imageUrl?: string | null;
};

function getStoreSlug(search: string) {
  return new URLSearchParams(search).get("storeSlug")?.trim() ?? "";
}

export default function NovaInfoPage() {
  const search = useSearch();
  const storeSlug = getStoreSlug(search);

  return (
    <StoreI18nBoundary storeSlug={storeSlug}>
      <NovaInfoContent storeSlug={storeSlug} />
    </StoreI18nBoundary>
  );
}

function NovaInfoContent({ storeSlug }: { storeSlug: string }) {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const { t } = useI18n();
  const { totalItems: cartCount } = useCart();
  const isSearch = location.split("?")[0] === "/themes/nova/pesquisa";
  const query = new URLSearchParams(search).get("q")?.trim() ?? "";

  const storeQuery = trpc.stores.bySlug.useQuery(
    { slug: storeSlug },
    { enabled: Boolean(storeSlug), retry: false },
  );

  const store = storeQuery.data?.store;
  const publicProducts = (storeQuery.data?.products ?? []) as PublicProduct[];
  const visibleProducts = useMemo<NovaProduct[]>(() => {
    const term = query.toLocaleLowerCase();
    return publicProducts
      .filter((product) => product.status === "active")
      .filter((product) => {
        if (!term) return true;
        return [product.name, product.description, product.category]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase().includes(term));
      })
      .map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        image: product.imageUrl,
        price: product.priceMzn,
        compare_at_price: product.compareAtPriceMzn,
        active: true,
      }));
  }, [publicProducts, query]);

  const page = location.split("?")[0].split("/").pop();
  const titles: Record<string, string> = {
    ajuda: t("info.help"),
    contacto: t("info.contact"),
    sobre: t("info.about"),
    termos: t("info.terms"),
    pesquisa: t("info.search"),
  };
  const title = titles[page ?? ""] ?? "Loja";

  if (storeSlug && storeQuery.isLoading) {
    return (
      <div aria-busy="true" className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  if (storeSlug && (storeQuery.isError || !store)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <Store className="mx-auto mb-4 h-8 w-8 text-slate-500" />
          <h1 className="text-xl font-semibold text-slate-950">{t("info.storeNotFound")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("info.storeNotFoundHint")}</p>
          <Link href="/themes/nova" className="mt-5 inline-block text-sm font-semibold text-emerald-700">{t("info.back")}</Link>
        </div>
      </main>
    );
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = String(formData.get("q") ?? "").trim();
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    if (storeSlug) params.set("storeSlug", storeSlug);
    setLocation(`/themes/nova/pesquisa${params.size ? `?${params}` : ""}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header
        storeName={store?.name ?? "NOVA STORE"}
        storeSlug={storeSlug || undefined}
        cartCount={cartCount}
        whatsappNumber={store?.whatsapp ?? ""}
        basePath="/themes/nova"
        currency={store?.currency ?? "MZN"}
        logoUrl={storeQuery.data?.branding?.logoUrl ?? null}
      />
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="mb-5 text-2xl font-bold">{title}</h1>
        {isSearch ? (
          <>
            {storeSlug ? (
              <>
                <form onSubmit={submitSearch} className="mb-6 flex max-w-xl items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Search size={17} className="text-slate-400" />
                  <input name="q" defaultValue={query} placeholder={t("search.placeholder")} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
                  <button type="submit" className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">{t("info.submitSearch")}</button>
                </form>
                <ProductGrid
                  products={visibleProducts}
                  title={query ? t("info.resultsFor", { query }) : t("info.allProducts")}
                  loading={storeQuery.isLoading}
                  error={storeQuery.isError ? t("store.productsError") : null}
                  storeName={store?.name}
                  storeSlug={storeSlug}
                  whatsappNumber={store?.whatsapp ?? ""}
                  productCardModel={store?.productCardModel}
                />
              </>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{t("info.searchStoreRequired")}</p>
            )}
          </>
        ) : page === "contacto" ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            {store?.whatsapp ? (
              <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`} className="font-semibold text-emerald-700">{t("info.contactWhatsapp", { store: store.name })}</a>
            ) : (
              <p>{t("info.noContact")}</p>
            )}
          </div>
        ) : page === "sobre" ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            {store ? <p>{store.name}{store.category ? ` · ${store.category}` : ""}</p> : <p>{t("info.storeFallback")}</p>}
          </div>
        ) : page === "ajuda" ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            <p>{t("info.helpText")}</p>
            {store?.whatsapp && <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`} className="mt-3 inline-block font-semibold text-emerald-700">{t("info.contactStore")}</a>}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            <p>{t("info.policiesUnavailable")}</p>
          </div>
        )}
      </main>
      <Footer
        storeName={store?.name ?? "NOVA STORE"}
        whatsappNumber={store?.whatsapp ?? ""}
        basePath="/themes/nova"
        storeSlug={storeSlug}
      />
    </div>
  );
}
