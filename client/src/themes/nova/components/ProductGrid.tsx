import { ProductCard } from "./ProductCard";

export interface NovaProduct {
  id: string | number;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  price: number | string;
  compare_at_price?: number | string | null;
  featured?: boolean;
  active?: boolean;
  created_at?: string;
}

interface ProductGridProps {
  products?: NovaProduct[];
  loading?: boolean;
  error?: string | null;
  storeName?: string;
  storeSlug?: string;
}

export function ProductGrid({
  products = [],
  loading = false,
  error = null,
  storeName = "NOVA STORE",
  storeSlug,
}: ProductGridProps) {
  return (
    <section className="w-full bg-background px-3 py-2 sm:px-4 md:py-3">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-3">
          <h2 className="mb-1 text-2xl font-bold text-foreground md:text-3xl">
            Produtos em destaque
          </h2>

          <p className="text-sm text-muted-foreground">
            Produtos selecionados especialmente para si
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
            Carregando produtos...
          </div>
        )}

        {!loading && error && (
          <div className="mb-4 rounded-2xl border border-border bg-white p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
            Ainda não há produtos na loja.
            <br />
            Adicione produtos no painel de administração.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:gap-3
              md:grid-cols-4
              md:gap-4
              lg:grid-cols-6
              lg:gap-4
              xl:grid-cols-8
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                description={product.description}
                image={product.image}
                price={product.price}
                compare_at_price={product.compare_at_price}
                featured={product.featured}
                storeName={storeName}
                storeSlug={storeSlug}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductGrid;
