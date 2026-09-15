import { Link } from "wouter";

interface RelatedProductsProps {
  products: any[];
}

export default function RelatedProducts({
  products,
}: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div
        className="
          mb-5
          flex
          items-center
          justify-between
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            text-gray-900
          "
        >
          Você também pode gostar
        </h2>

        <Link
          href="/themes/nova"
          className="
            text-sm
            font-semibold
            text-orange-600
            hover:text-orange-700
          "
        >
          Ver todos
        </Link>
      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          lg:grid-cols-6
        "
      >
        {products.map((item) => (
          <Link
            key={item.id}
            href={`/themes/nova/produto/${item.slug}`}
            className="
              overflow-hidden
              rounded-xl
              bg-white
              transition
              hover:shadow-lg
            "
          >
            {/* IMAGEM */}
            <div
              className="
                relative
                aspect-square
                bg-gray-100
              "
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                  loading="lazy"
                />
              ) : (
                <img
                  src="/placeholder.svg"
                  alt={item.name}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-contain
                  "
                  loading="lazy"
                />
              )}
            </div>

            {/* INFORMAÇÕES */}
            <div className="p-3">
              <h3
                className="
                  line-clamp-2
                  min-h-[40px]
                  text-sm
                  font-medium
                "
              >
                {item.name}
              </h3>

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    font-bold
                    text-red-600
                  "
                >
                  {Number(item.price ?? 0).toFixed(2)} MZN
                </span>

                {item.compare_at_price && (
                  <span
                    className="
                      text-xs
                      text-gray-400
                      line-through
                    "
                  >
                    {Number(item.compare_at_price).toFixed(2)} MZN
                  </span>
                )}
              </div>

              {item.compare_at_price && (
                <p
                  className="
                    mt-1
                    text-xs
                    font-semibold
                    text-green-600
                  "
                >
                  Oferta disponível
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}