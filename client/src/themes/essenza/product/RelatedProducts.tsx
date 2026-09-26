import { ProductCard } from "../components/ProductCard";

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
    <section className="border-t border-neutral-200 pt-10">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
          Continuar a descobrir
        </p>

        <h2
          className="mt-2 text-2xl text-neutral-950"
          style={{
            fontFamily:
              "'Playfair Display', Georgia, serif",
            fontWeight: 500,
          }}
        >
          Também pode gostar
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 lg:grid-cols-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: Number(product.id),
              name: product.name,
              category: "Coleção",
              price: product.price,
              oldPrice:
                product.oldPrice ??
                undefined,
              rating: 4.8,
              reviews: 0,
              sold: 0,
              image:
                product.image ||
                "/placeholder.svg",
              description: "",
              slug: product.slug,
            }}
            storeSlug={storeSlug}
          />
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
