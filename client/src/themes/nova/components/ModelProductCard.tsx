import { MessageCircle } from "lucide-react";

import { Link } from "wouter";

import {
  normalizeProductCardModel,
  type ProductCardModel,
} from "../productCardModels";

import { ProductCard as ClassicCard } from "./ProductCard";

interface ModelCardProps {
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  price: number | string;
  compare_at_price?: number | string | null;
  featured?: boolean;
  model?: string | null;
  storeName?: string;
  storeSlug?: string;
  whatsappNumber?: string;
}

/**
 * Cartão de produto do tema Nova com suporte aos
 * 5 modelos escolhíveis na Personalização da loja
 * (secção Product Cards):
 *
 * 1 — Clássico (estilo atual, inalterado);
 * 2 — Imagem (minimalista, abre a página do produto);
 * 3 — Imagem + preço;
 * 4 — Imagem + nome;
 * 5 — Imagem + nome + preço + botão Comprar (WhatsApp).
 *
 * O modelo 1 delega no ProductCard original, garantindo
 * que o estilo atual da loja permanece intacto.
 */
export function ModelProductCard({
  slug,
  name,
  description,
  image,
  price,
  compare_at_price,
  featured,
  model,
  storeName = "NOVA STORE",
  storeSlug,
  whatsappNumber,
}: ModelCardProps) {
  const cardModel: ProductCardModel =
    normalizeProductCardModel(model);

  const productHref = storeSlug
    ? `/themes/nova/produto/${encodeURIComponent(slug)}?storeSlug=${encodeURIComponent(storeSlug)}`
    : `/themes/nova/produto/${encodeURIComponent(slug)}`;

  /* =========================================================
     MODELO 1 — CLÁSSICO (estilo atual, intacto)
     ========================================================= */

  if (cardModel === "1") {
    return (
      <ClassicCard
        slug={slug}
        name={name}
        description={description}
        image={image}
        price={price}
        compare_at_price={compare_at_price}
        featured={featured}
        storeName={storeName}
        storeSlug={storeSlug}
      />
    );
  }

  const currentPrice = Number(price);
  const formattedPrice = `${currentPrice.toFixed(2)} MZN`;

  /* =========================================================
     MODELO 2 — IMAGEM (minimalista)
     ========================================================= */

  if (cardModel === "2") {
    return (
      <Link
        href={productHref}
        className="
          group
          block
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
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image?.trim() || "/placeholder.svg"}
            alt={name}
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
    );
  }

  /* =========================================================
     MODELO 3 — PREÇO
     ========================================================= */

  if (cardModel === "3") {
    return (
      <Link
        href={productHref}
        className="
          group
          block
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
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image?.trim() || "/placeholder.svg"}
            alt={name}
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

        <div className="bg-white px-2 py-1.5 sm:px-2.5 sm:py-2">
          <span className="text-sm font-bold text-foreground sm:text-base">
            {formattedPrice}
          </span>
        </div>
      </Link>
    );
  }

  /* =========================================================
     MODELO 4 — NOME
     ========================================================= */

  if (cardModel === "4") {
    return (
      <Link
        href={productHref}
        className="
          group
          block
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
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image?.trim() || "/placeholder.svg"}
            alt={name}
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

        <div className="bg-white px-2 py-1.5 sm:px-2.5 sm:py-2">
          <h3
            className="
              line-clamp-2
              text-[11px]
              font-medium
              leading-[14px]
              text-foreground
              sm:text-xs
            "
          >
            {name}
          </h3>
        </div>
      </Link>
    );
  }

  /* =========================================================
     MODELO 5 — COMPLETO (nome + preço + botão Comprar)
     ========================================================= */

  function openWhatsApp() {
    if (!whatsappNumber) {
      return;
    }

    const phone = whatsappNumber.replace(/\D/g, "");

    if (!phone) {
      return;
    }

    const message = encodeURIComponent(
      `Olá, ${storeName}! Tenho interesse no produto: ${name}`,
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
            src={image?.trim() || "/placeholder.svg"}
            alt={name}
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
            {name}
          </h3>
        </Link>

        <span className="mt-0.5 text-sm font-bold text-foreground sm:text-base">
          {formattedPrice}
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

export default ModelProductCard;
