import { MessageCircle } from "lucide-react";

import { Link } from "wouter";

/* =========================================================
   MARKET — PRODUCT CARD 8 (Completo)
   Extraído do modelo 5 do tema Nova ("Completo") e
   isolado como funcionalidade do Market. Sem dependências
   do tema: dados de demonstração locais.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Completo" na Personalização
   (stores.productCardModel = "5").
   ========================================================= */

type DemoProduct = {
  slug: string;
  name: string;
  image?: string | null;
  price: number;
};

const demoProduct: DemoProduct = {
  slug: "produto-demo",
  name: "Nome do produto",
  image: null,
  price: 1250,
};

export default function Product8({
  product = demoProduct,
  whatsappNumber,
}: {
  product?: DemoProduct;
  whatsappNumber?: string;
}) {
  const currentPrice = Number(product.price);

  const productHref = `/themes/nova/produto/${encodeURIComponent(
    product.slug,
  )}`;

  function openWhatsApp() {
    if (!whatsappNumber) {
      return;
    }

    const phone = whatsappNumber.replace(/\D/g, "");

    if (!phone) {
      return;
    }

    const message = encodeURIComponent(
      `Olá! Tenho interesse no produto: ${product.name}`,
    );

    window.open(
      `https://wa.me/${phone}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div
      className="
        group
        flex
        flex-col
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <Link href={productHref}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image?.trim() || "/placeholder.svg"}
            alt={product.name}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              transition-transform
              duration-300
              group-hover:scale-[1.03]
            "
            loading="lazy"
          />
        </div>
      </Link>

      <div
        className="
          flex
          flex-1
          flex-col
          bg-white
          px-2
          py-1.5
          sm:px-2.5
          sm:py-2
        "
      >
        <Link href={productHref}>
          <h3
            className="
              line-clamp-2
              text-[11px]
              font-medium
              leading-[14px]
              text-foreground
              hover:text-emerald-600
              sm:text-xs
            "
          >
            {product.name}
          </h3>
        </Link>

        <span className="mt-0.5 text-sm font-bold text-foreground sm:text-base">
          {currentPrice.toFixed(2)} MZN
        </span>

        <button
          type="button"
          onClick={openWhatsApp}
          className="
            mt-1.5
            flex
            h-8
            w-full
            items-center
            justify-center
            gap-1.5
            rounded-lg
            bg-emerald-600
            text-[11px]
            font-bold
            text-white
            transition
            hover:bg-emerald-700
            disabled:opacity-50
          "
          disabled={!whatsappNumber}
        >
          <MessageCircle size={14} />
          Comprar
        </button>
      </div>
    </div>
  );
}
