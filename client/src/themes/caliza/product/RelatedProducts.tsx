import { ProductCard } from "../components/ProductCard";

import {
  calizaColors,
  calizaHeadingFont,
  calizaBodyFont,
} from "../theme";

type RelatedProduct = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string | null;
};

type RelatedProductsProps = {
  products: RelatedProduct[];
  storeSlug?: string;
};

export function RelatedProducts({
  products,
  storeSlug,
}: RelatedProductsProps) {
  return (
    <section
      className="border-t pt-10"
      style={{
        borderColor:
          calizaColors.border,
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="mb-8">
        <p
          className="text-[11px] uppercase tracking-[0.28em]"
          style={{
            color:
              calizaColors.textMuted,
          }}
        >
          Continuar a descobrir
        </p>

        <h2
          className="mt-2 text-2xl"
          style={{
            fontFamily:
              calizaHeadingFont,
            fontWeight: 500,
            color: calizaColors.text,
          }}
        >
          Também pode gostar
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-5">
        {products.map((product) => (
          <ProductCard
            key={String(product.id)}
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              category: "Coleção",
              price: product.price,
              oldPrice:
                product.oldPrice ??
                null,
              stock: 10,
              image:
                product.image ||
                "/placeholder.svg",
              description: "",
            }}
            storeSlug={storeSlug}
          />
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
