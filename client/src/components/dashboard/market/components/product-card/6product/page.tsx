import { Link } from "wouter";

/* =========================================================
   MARKET — PRODUCT CARD 6 (Preço)
   Extraído do modelo 3 do tema Nova ("Preço") e isolado
   como funcionalidade do Market. Sem dependências do
   tema: dados de demonstração locais.

   Ao comprar esta funcionalidade, a loja desbloqueia o
   modelo "Preço" na Personalização
   (stores.productCardModel = "3").
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

export default function Product6({
  product = demoProduct,
}: {
  product?: DemoProduct;
}) {
  const currentPrice = Number(product.price);

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
        <span className="text-sm font-bold text-foreground sm:text-base">
          {currentPrice.toFixed(2)} MZN
        </span>
      </div>
    </Link>
  );
}
