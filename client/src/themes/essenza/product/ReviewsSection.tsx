import { Star } from "lucide-react";

const reviews = [
  {
    author: "Sofia M.",
    rating: 5,
    date: "há 2 semanas",
    text: "Qualidade percebida imediatamente. Exatamente como descrito.",
  },
  {
    author: "Daniel C.",
    rating: 5,
    date: "há 1 mês",
    text: "Embalagem impecável e entrega rápida. A peça superou a expectativa.",
  },
  {
    author: "Lia F.",
    rating: 4,
    date: "há 1 mês",
    text: "Elegante e discreto. Voltarei a comprar com certeza.",
  },
];

export function ReviewsSection() {
  return (
    <section className="border-t border-neutral-200 pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className="text-2xl text-neutral-950"
          style={{
            fontFamily:
              "'Playfair Display', Georgia, serif",
            fontWeight: 500,
          }}
        >
          O que dizem
        </h2>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={13}
                className="fill-neutral-950 text-neutral-950"
              />
            ))}
          </div>

          <span className="text-sm font-medium text-neutral-950">
            4.9
          </span>

          <span className="text-xs text-neutral-400">
            · 96 avaliações
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-px bg-neutral-200 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.author}
            className="bg-white p-6"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={
                    star <= review.rating
                      ? "fill-neutral-950 text-neutral-950"
                      : "text-neutral-200"
                  }
                />
              ))}
            </div>

            <p className="mt-3.5 text-sm leading-7 text-neutral-600">
              “{review.text}”
            </p>

            <div className="mt-4 flex items-center justify-between gap-2 text-[11px]">
              <span className="font-medium uppercase tracking-[0.12em] text-neutral-950">
                {review.author}
              </span>

              <span className="text-neutral-400">
                {review.date}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReviewsSection;
