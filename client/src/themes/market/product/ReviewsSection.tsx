import { Star } from "lucide-react";

const reviews = [
  {
    author: "Ana Muchanga",
    rating: 5,
    date: "há 2 semanas",
    text: "Excelente produto e entrega muito rápida. Recomendo!",
  },
  {
    author: "Carlos Tembe",
    rating: 4,
    date: "há 1 mês",
    text: "Boa qualidade pelo preço. A embalagem veio muito bem protegida.",
  },
  {
    author: "Rita Sitoe",
    rating: 5,
    date: "há 1 mês",
    text: "Atendimento fantástico pelo WhatsApp. Compra sem complicações.",
  },
];

export function ReviewsSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-black tracking-tight text-slate-900">
          Avaliações de clientes
        </h2>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-4 w-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          <span className="text-sm font-bold text-slate-900">
            4.8
          </span>

          <span className="text-xs text-slate-400">
            · 128 avaliações
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.author}
            className="rounded-2xl bg-slate-50 p-5"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              “{review.text}”
            </p>

            <div className="mt-3.5 flex items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-900">
                {review.author}
              </span>

              <span className="text-slate-400">
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
