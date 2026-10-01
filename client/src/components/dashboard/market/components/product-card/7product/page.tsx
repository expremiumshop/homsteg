import { Link } from "wouter";

/* =========================================================
   MARKET — PRODUCT CARD 7 (Nome)
   Extraído do modelo 4 do tema Nova ("Nome") e isolado
   como funcionalidade do Market. Sem dependências do
   tema: dados de demonstração locais.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Nome" na Personalização
   (stores.productCardModel = "4").
   ========================================================= */

type DemoProduct = {
  slug: string;
  name: string;
  image?: string | null;
};

const demoProduct: DemoProduct = {
  slug: "produto-demo",
  name: "Nome do produto",
  image: null,
};

export default function Product7({
  product = demoProduct,
}: {
  product?: DemoProduct;
}) {
  const productHref = `/themes/nova/produto/${encodeURIComponent(
    product.slug,
  )}`;

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
          {product.name}
        </h3>
      </div>
    </Link>
  );
}
