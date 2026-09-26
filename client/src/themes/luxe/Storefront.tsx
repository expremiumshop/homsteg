import { useMemo } from "react";

import { TopBar } from "./components/TopBar";
import { PromoBar } from "./components/PromoBar";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TrustBar } from "./components/TrustBar";
import { FlashDeals } from "./components/FlashDeals";
import { CategorySection } from "./components/CategorySection";
import { PromoBanners } from "./components/PromoBanners";
import { ProductSection } from "./components/ProductSection";
import { BrandsSection } from "./components/BrandsSection";
import { NewArrivals } from "./components/NewArrivals";
import { BenefitsSection } from "./components/BenefitsSection";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { MobileBottomBar } from "./components/MobileBottomBar";

import {
  demoCategories,
  demoFlashProducts,
  demoProducts,
  formatPrice,
  type LuxeFlashProduct,
  type LuxeMode,
  type LuxeProduct,
  type LuxeStore,
  type StoreProduct,
} from "./demoData";

type LuxeStorefrontProps = {
  mode?: LuxeMode;
  store?: LuxeStore | null;
  storeSlug?: string;
  products?: StoreProduct[];
};

export default function LuxeStorefront({
  mode = "demo",
  store,
  storeSlug,
  products: storeProducts = [],
}: LuxeStorefrontProps) {
  const isDemo = mode === "demo";

  const storeName = store?.name || "LUXE";

  const effectiveStoreSlug =
    storeSlug ?? store?.slug ?? undefined;

  /* =========================================================
     PRODUTOS
     ========================================================= */

  const products = useMemo<LuxeProduct[]>(() => {
    if (isDemo) {
      return demoProducts;
    }

    return storeProducts.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category ?? "Geral",
      price: formatPrice(product.priceMzn),
      oldPrice: product.compareAtPriceMzn
        ? formatPrice(product.compareAtPriceMzn)
        : "",
      discount: product.compareAtPriceMzn ? "Oferta" : "",
      rating: "",
      sold: "",
      badge: "",
      image: product.imageUrl ?? "",
      slug: product.slug ?? undefined,
      description: product.description ?? null,
    }));
  }, [isDemo, storeProducts]);

  const categories = isDemo
    ? demoCategories
    : [
        "Todos",
        ...Array.from(
          new Set(products.map((product) => product.category)),
        ),
      ];

  const flashProducts = useMemo<LuxeFlashProduct[]>(() => {
    if (isDemo) {
      return demoFlashProducts;
    }

    return products.slice(0, 5).map((product) => ({
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: "50",
      sold: "50%",
      image: product.image,
    }));
  }, [isDemo, products]);

  /* =========================================================
     STOREFRONT
     ========================================================= */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f7f5] font-sans text-slate-900">
      <TopBar />

      <PromoBar />

      <Header
        storeName={storeName}
        categories={categories}
        storeSlug={effectiveStoreSlug}
      />

      <main>
        <Hero />

        <TrustBar />

        <FlashDeals products={flashProducts} />

        <CategorySection />

        <PromoBanners />

        <ProductSection
          products={products}
          storeSlug={effectiveStoreSlug}
        />

        <BrandsSection />

        <NewArrivals products={products} />

        <BenefitsSection />

        <Newsletter />
      </main>

      <Footer
        storeName={storeName}
        storeSlug={effectiveStoreSlug}
      />

      <MobileBottomBar
        storeSlug={effectiveStoreSlug}
      />
    </div>
  );
}
