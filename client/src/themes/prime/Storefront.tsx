import { useMemo } from "react";

import { ArrowDown, Check } from "lucide-react";

import { useState } from "react";

import { TopBar } from "./components/TopBar";
import { Header } from "./components/Header";
import { HeroCarousel } from "./components/HeroCarousel";
import { ServiceBar } from "./components/ServiceBar";
import { CategoryGrid } from "./components/CategoryGrid";
import { ProductSection } from "./components/ProductSection";
import { PromoBanner } from "./components/PromoBanner";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";

import { useCart } from "@/contexts/CartContext";

import {
  image,
  primeDemoProducts,
  type PrimeMode,
  type PrimeProduct,
  type PrimeStore,
} from "./demoData";

type PrimeStorefrontProps = {
  mode?: PrimeMode;
  store?: PrimeStore | null;
  storeSlug?: string;
  products?: {
    id: number | string;
    name: string;
    category?: string | null;
    priceMzn: number;
    compareAtPriceMzn?: number | null;
    imageUrl?: string | null;
    slug?: string | null;
    description?: string | null;
  }[];
};

export default function PrimeStorefront({
  mode = "demo",
  store,
  storeSlug,
  products,
}: PrimeStorefrontProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");

  const { totalItems } = useCart();

  const storeName = store?.name || "Prime";

  /* =========================================================
     PRODUTOS
     ========================================================= */

  const realProducts = useMemo<PrimeProduct[]>(() => {
    if (mode !== "store" || !products?.length) {
      return primeDemoProducts;
    }

    return products.map((product, index) => ({
      id:
        typeof product.id === "number"
          ? product.id
          : Number(product.id) || index + 1000,
      name: product.name,
      category: product.category || "Produtos",
      price: product.priceMzn,
      oldPrice: product.compareAtPriceMzn || undefined,
      rating: 4.8,
      reviews: 0,
      sold: 0,
      image:
        product.imageUrl ||
        image("photo-1441986300917-64674bd600d8"),
      description:
        product.description ||
        "Produto disponível nesta loja Prime.",
      shipping: "Entrega rápida",
      slug: product.slug || undefined,
    }));
  }, [mode, products]);

  /* =========================================================
     NAVEGAÇÃO
     ========================================================= */

  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const showToast = (message: string) => {
    setToast(message);

    window.setTimeout(() => setToast(""), 2600);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-slate-950">
      <TopBar />

      <Header
        storeName={storeName}
        category={category}
        onCategory={setCategory}
        onScrollToProducts={scrollToProducts}
        search={search}
        onSearch={setSearch}
        cartCount={totalItems}
        favoritesCount={0}
        onOpenCart={() => setCartOpen(true)}
        storeSlug={storeSlug}
      />

      <main>
        <HeroCarousel onCta={scrollToProducts} />

        <ServiceBar />

        <CategoryGrid
          category={category}
          onCategory={setCategory}
          onScrollToProducts={scrollToProducts}
        />

        <ProductSection
          products={realProducts}
          category={category}
          onCategory={setCategory}
          search={search}
          onSearch={setSearch}
          storeSlug={storeSlug}
        />

        <PromoBanner onCta={scrollToProducts} />

        <Newsletter />
      </main>

      <Footer storeName={storeName} storeSlug={storeSlug} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        storeSlug={storeSlug}
      />

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[130] flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl">
          <Check className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}

      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="fixed bottom-5 right-5 z-40 hidden h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-xl ring-1 ring-slate-100 md:flex"
      >
        <ArrowDown className="h-4 w-4 rotate-180" />
      </button>
    </div>
  );
}
