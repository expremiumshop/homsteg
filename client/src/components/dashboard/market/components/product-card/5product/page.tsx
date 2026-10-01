import { Link } from "wouter";

/* =========================================================
   MARKET — PRODUCT CARD 5 (Imagem)
   Extraído do modelo 2 do tema Nova ("Imagem") e
   isolado como funcionalidade do Market. Sem dependências
   do tema: dados de demonstração locais.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Imagem" na Personalização
   (stores.productCardModel = "2").
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

export default function Product5({
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
    </Link>
  );
}
