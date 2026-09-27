import { useMemo, useState } from "react";

import { Header } from "./components/Header";
import { MobileMenu } from "./components/MobileMenu";
import { SearchPanel } from "./components/SearchPanel";
import { PromoBar } from "./components/PromoBar";
import { Hero } from "./components/Hero";
import { CategorySection } from "./components/CategorySection";
import { ProductSection } from "./components/ProductSection";
import { PromoSection } from "./components/PromoSection";
import { BenefitsSection } from "./components/BenefitsSection";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import {
  urbanDemoStore,
  urbanDemoProducts,
  type UrbanMode,
  type UrbanProduct,
  type UrbanStore,
} from "./demoData";

type UrbanStorefrontProps = {
  mode?: UrbanMode;
  store?: UrbanStore | null;
  /*
   * Produtos reais da loja (modo "store").
   * Em modo demo são ignorados — o preview usa
   * sempre os produtos fictícios do tema.
   */
  products?: UrbanStoreProduct[];
};

/*
 * Shape mínimo dos produtos vindos do backend
 * (products.list / stores.bySlug).
 */
export type UrbanStoreProduct = {
  id: number | string;
  name: string;
  slug?: string | null;
  description?: string | null;
  priceMzn: number;
  compareAtPriceMzn?: number | null;
  stock?: number | null;
  category?: string | null;
  status?: string | null;
  imageUrl?: string | null;
};

export default function UrbanStorefront({
  mode = "demo",
  store,
  products: storeProducts = [],
}: UrbanStorefrontProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const isDemo = mode === "demo";

  const currentStore = store ?? urbanDemoStore;

  const storeName =
    currentStore.name?.trim() || "Urban";

  const storeSlug = currentStore.slug ?? undefined;

  /* =========================================================
     PRODUTOS

     Demo → produtos fictícios do tema (identidade
     visual do preview). Loja real → apenas os
     produtos reais desta loja, sem fallback demo.
     Sem produtos → estado vazio dedicado.
     ========================================================= */

  const products = useMemo<UrbanProduct[]>(() => {
    if (isDemo) {
      return urbanDemoProducts;
    }

    return storeProducts
      .filter(
        (product) =>
          product.status !== "archived",
      )
      .map((product, index) => ({
        id: String(product.id ?? index + 1),
        name: product.name,
        category: product.category || "Produtos",
        price: Number(product.priceMzn ?? 0),
        oldPrice:
          product.compareAtPriceMzn == null
            ? undefined
            : Number(product.compareAtPriceMzn),
        image:
          product.imageUrl ||
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=88",
        rating: 4.8,
        badge: undefined,
        slug: product.slug || undefined,
        description:
          product.description ?? null,
        stock: Number(product.stock ?? 0),
      }));
  }, [isDemo, storeProducts]);

  return (
    <div
      data-theme="urban"
      data-mode={mode}
      className="min-h-screen bg-white font-sans text-neutral-950"
    >
      <PromoBar />

      <Header
        storeName={storeName}
        onMenu={() => setMobileMenuOpen(true)}
        onSearch={() => setSearchOpen(true)}
        storeSlug={storeSlug}
      />

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <SearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <main>
        <Hero store={currentStore} />

        <CategorySection />

        <ProductSection
          products={products}
          storeSlug={storeSlug}
          showEmptyState={!isDemo}
        />

        <PromoSection />

        <BenefitsSection />

        <Newsletter />
      </main>

      <Footer storeName={storeName} />
    </div>
  );
}
