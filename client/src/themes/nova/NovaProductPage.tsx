import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

import ProductGallery from "./product/ProductGallery";
import ProductTop from "./product/ProductTop";
import ProductInfo from "./product/ProductInfo";
import ProductPurchaseSection from "./product/ProductPurchaseSection";
import ShippingCard from "./product/ShippingCard";
import GuaranteeCard from "./product/GuaranteeCard";
import PromotionBar from "./product/PromotionBar";
import ProductTabs from "./product/ProductTabs";
import ReviewsSection from "./product/ReviewsSection";
import RelatedProducts from "./product/RelatedProducts";

const demoProduct = {
  id: "nova-demo-001",
  slug: "smartwatch-ultra-series-9",
  name: "Smartwatch Ultra Series 9",
  price: 2499,
  compare_at_price: 3499,
  stock: 18,
  description:
    "Smartwatch moderno com monitorização de saúde, notificações inteligentes e bateria de longa duração.",
  category: "Eletrónicos",
  storeName: "NOVA STORE",
  image:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
  images: [
    {
      id: "image-1",
      image_url:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      position: 0,
    },
    {
      id: "image-2",
      image_url:
        "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=1000&q=80",
      position: 1,
    },
    {
      id: "image-3",
      image_url:
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80",
      position: 2,
    },
  ],
};

const demoOptions = [
  {
    id: "color",
    name: "Cor",
    values: ["Preto", "Prata", "Azul"],
    position: 0,
  },
  {
    id: "size",
    name: "Tamanho",
    values: ["40mm", "44mm"],
    position: 1,
  },
];

const demoRelatedProducts = [
  {
    id: "related-1",
    slug: "auriculares-bluetooth-pro",
    name: "Auriculares Bluetooth Pro",
    price: 899,
    compare_at_price: 1199,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "related-2",
    slug: "relogio-smart-classic",
    name: "Relógio Smart Classic",
    price: 1499,
    compare_at_price: 1899,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "related-3",
    slug: "headphones-wireless",
    name: "Headphones Wireless",
    price: 1299,
    compare_at_price: 1599,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "related-4",
    slug: "smartphone-pro-max",
    name: "Smartphone Pro Max",
    price: 12999,
    compare_at_price: 14999,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "related-5",
    slug: "power-bank-20000mah",
    name: "Power Bank 20.000mAh",
    price: 999,
    compare_at_price: 1299,
    image:
      "https://images.unsplash.com/photo-1609592424987-1f6c9c7a9b9a?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "related-6",
    slug: "camara-digital",
    name: "Câmara Digital",
    price: 5499,
    compare_at_price: 6499,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80",
  },
];

export default function NovaProductPage() {
  const [product] = useState(demoProduct);

  return (
    <main className="min-h-screen bg-[#f5f5f5] pb-24">
      <div
        className="
          mx-auto
          max-w-[1440px]
          px-3
          py-4
          md:px-4
          md:py-8
        "
      >
        {/* VOLTAR */}
        <div className="mb-4">
          <Link
            href="/themes/nova"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-gray-500
              transition
              hover:text-emerald-600
            "
          >
            <ArrowLeft size={18} />
            Voltar à loja
          </Link>
        </div>

        {/* PRODUTO */}
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-6
              p-4
              md:p-6
              xl:grid-cols-[620px_1fr]
              xl:gap-10
            "
          >
            {/* GALERIA */}
            <div className="min-w-0">
              <ProductGallery
                image={product.image}
                name={product.name}
                images={product.images}
              />
            </div>

            {/* INFORMAÇÕES DO PRODUTO */}
            <div className="min-w-0 space-y-5">
              {/* TÍTULO */}
              <ProductTop product={product} />

              {/* PREÇO / DESCONTO / CUPÃO / STOCK */}
              <ProductInfo product={product} />

              {/* PROMOÇÃO */}
              <PromotionBar product={product} />

              {/* VARIANTES + ACÇÕES */}
              <ProductPurchaseSection
                product={product}
                options={demoOptions}
                variants={[]}
              />

              {/* ENTREGA */}
              <ShippingCard />

              {/* GARANTIA */}
              <GuaranteeCard />
            </div>
          </div>

          {/* TABS */}
          <div className="border-t border-gray-200">
            <ProductTabs product={product} />
          </div>
        </div>

        {/* AVALIAÇÕES */}
        <div className="mt-8">
          <ReviewsSection />
        </div>

        {/* PRODUTOS RELACIONADOS */}
        <RelatedProducts products={demoRelatedProducts} />
      </div>
    </main>
  );
}