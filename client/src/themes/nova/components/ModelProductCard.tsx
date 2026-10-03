import {
  ChevronRight,
  MessageCircle,
  Plus,
} from "lucide-react";

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
 * 8 modelos escolhíveis na Personalização da loja
 * (secção Product Cards):
 *
 * 1 — Clássico (estilo atual, inalterado);
 * 2 — Imagem (minimalista, abre a página do produto);
 * 3 — Imagem + preço;
 * 4 — Imagem + nome;
 * 5 — Imagem + nome + preço + botão Comprar (WhatsApp);
 * 6 — Elevado (Market 1product): sombra suave, categoria,
 *     nome, preço e botão de compra circular;
 * 7 — Compacto (Market 2product): quadrado, nome e preço;
 * 8 — Horizontal (Market 3product): linha com imagem à
 *     esquerda, categoria, nome, preço e seta.
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
  const formattedMarketPrice = `${currentPrice.toLocaleString("pt-MZ")} MT`;

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
     MODELO 6 — ELEVADO (do Market 1product): sombra suave,
     categoria, nome, preço e botão de compra circular.
     ========================================================= */

  if (cardModel === "6") {
    return (
      <div
        className="
          group
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          transition
          hover:shadow-md
        "
      >
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted">
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

          <span className="absolute left-2 top-2 rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold text-[#111713]">
            Novo
          </span>
        </div>

        <div className="flex flex-1 flex-col p-3">
          {description?.trim() && (
            <span className="truncate text-[11px] text-gray-400">
              {description}
            </span>
          )}

          <Link href={productHref}>
            <h3
              className="
                mt-0.5
                line-clamp-2
                text-sm
                font-bold
                text-[#111713]
                hover:text-emerald-600
              "
            >
              {name}
            </h3>
          </Link>

          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-sm font-black text-emerald-700">
              {formattedMarketPrice}
            </span>

            <button
              type="button"
              onClick={openWhatsApp}
              aria-label="Adicionar ao carrinho"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-[#111713]
                text-white
                transition
                hover:bg-emerald-700
                disabled:opacity-50
              "
              disabled={!whatsappNumber}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MODELO 7 — COMPACTO (do Market 2product): quadrado,
     nome e preço em destaque.
     ========================================================= */

  if (cardModel === "7") {
    return (
      <Link
        href={productHref}
        className="
          group
          block
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          transition
          hover:border-emerald-600
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

        <div className="p-3">
          <h3 className="truncate text-sm font-bold text-[#111713]">
            {name}
          </h3>

          <span className="mt-1 block text-base font-black text-[#111713]">
            {formattedMarketPrice}
          </span>
        </div>
      </Link>
    );
  }

  /* =========================================================
     MODELO 8 — HORIZONTAL (do Market 3product): linha com
     imagem à esquerda, categoria, nome, preço e seta.
     ========================================================= */

  if (cardModel === "8") {
    return (
      <Link
        href={productHref}
        className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-gray-200
          bg-white
          p-3
          transition
          hover:border-emerald-600
        "
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
          <img
            src={image?.trim() || "/placeholder.svg"}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          {description?.trim() && (
            <span className="truncate text-[11px] text-gray-400">
              {description}
            </span>
          )}

          <h3 className="truncate text-sm font-bold text-[#111713]">
            {name}
          </h3>

          <span className="text-sm font-black text-emerald-700">
            {formattedMarketPrice}
          </span>
        </div>

        <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
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
