import { useState } from "react";

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
  type UrbanStore,
} from "./demoData";

type UrbanStorefrontProps = {
  mode?: UrbanMode;
  store?: UrbanStore | null;
};

export default function UrbanStorefront({
  mode = "demo",
  store,
}: UrbanStorefrontProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const currentStore = store ?? urbanDemoStore;

  const storeName =
    currentStore.name?.trim() || "Urban";

  const storeSlug = currentStore.slug ?? undefined;

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
          products={urbanDemoProducts}
          storeSlug={storeSlug}
        />

        <PromoSection />

        <BenefitsSection />

        <Newsletter />
      </main>

      <Footer storeName={storeName} />
    </div>
  );
}
