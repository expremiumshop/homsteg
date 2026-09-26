import { Star } from "lucide-react";

import {
  calizaColors,
  calizaHeadingFont,
  calizaBodyFont,
} from "../theme";

const reviews = [
  {
    author: "Sofia M.",
    rating: 5,
    date: "há 2 semanas",
    text: "A peça é ainda mais bonita em pessoa. Textura e acabamento impecáveis.",
  },
  {
    author: "Daniel C.",
    rating: 5,
    date: "há 1 mês",
    text: "Embalagem cuidadosa e entrega rápida. Dá para sentir o cuidado em cada detalhe.",
  },
  {
    author: "Lia F.",
    rating: 4,
    date: "há 1 mês",
    text: "Objetos com carácter, perfeitos para presentes. Voltarei a comprar.",
  },
];

export function ReviewsSection() {
  return (
    <section
      className="border-t pt-10"
      style={{
        borderColor:
          calizaColors.border,
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className="text-2xl"
          style={{
            fontFamily:
              calizaHeadingFont,
            fontWeight: 500,
            color: calizaColors.text,
          }}
        >
          O que dizem
        </h2>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <Star
                  key={star}
                  size={13}
                  className="fill-current"
                  style={{
                    color:
                      calizaColors.primary,
                  }}
                />
              ),
            )}
          </div>

          <span
            className="text-sm font-semibold"
            style={{
              color: calizaColors.text,
            }}
          >
            4.9
          </span>

          <span
            className="text-xs"
            style={{
              color:
                calizaColors.textMuted,
            }}
          >
            · 96 avaliações
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.author}
            className="rounded-2xl border p-6"
            style={{
              background:
                calizaColors.surface,
              borderColor:
                calizaColors.border,
            }}
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    size={12}
                    className={
                      star <=
                      review.rating
                        ? "fill-current"
                        : ""
                    }
                    style={{
                      color:
                        star <=
                        review.rating
                          ? calizaColors.primary
                          : calizaColors.border,
                    }}
                  />
                ),
              )}
            </div>

            <p
              className="mt-3.5 text-sm leading-7"
              style={{
                color:
                  calizaColors.textMuted,
              }}
            >
              “{review.text}”
            </p>

            <div className="mt-4 flex items-center justify-between gap-2 text-[11px]">
              <span
                className="font-semibold uppercase tracking-[0.12em]"
                style={{
                  color:
                    calizaColors.text,
                }}
              >
                {review.author}
              </span>

              <span
                style={{
                  color:
                    calizaColors.textMuted,
                }}
              >
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
