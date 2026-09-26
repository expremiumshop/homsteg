import { Star } from "lucide-react";

import {
  chazucaColors,
  chazucaHeadingFont,
  chazucaBodyFont,
} from "../theme";

const reviews = [
  {
    author: "Nia T.",
    rating: 5,
    date: "há 1 semana",
    text: "O hoodie é incrível, a qualidade do algodão surpreendeu-me. Chegou rapidinho.",
  },
  {
    author: "Kelson M.",
    rating: 5,
    date: "há 2 semanas",
    text: "Peças com atitude. O drop esgotou em dois dias, mas valeu a espera.",
  },
  {
    author: "Amina S.",
    rating: 4,
    date: "há 1 mês",
    text: "Adorei a colaboração com os artistas locais. Embalagem top, atendimento rápido.",
  },
];

export function ReviewsSection() {
  return (
    <section
      className="border-t pt-10"
      style={{
        borderColor:
          chazucaColors.border,
        fontFamily: chazucaBodyFont,
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className="text-2xl"
          style={{
            fontFamily:
              chazucaHeadingFont,
            fontWeight: 700,
            color: chazucaColors.text,
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
                      chazucaColors.accent,
                  }}
                />
              ),
            )}
          </div>

          <span
            className="text-sm font-semibold"
            style={{
              color: chazucaColors.text,
            }}
          >
            4.9
          </span>

          <span
            className="text-xs"
            style={{
              color:
                chazucaColors.textMuted,
            }}
          >
            · 128 avaliações
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.author}
            className="rounded-3xl border p-6"
            style={{
              background:
                chazucaColors.surface,
              borderColor:
                chazucaColors.border,
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
                          ? chazucaColors.accent
                          : chazucaColors.border,
                    }}
                  />
                ),
              )}
            </div>

            <p
              className="mt-3.5 text-sm leading-7"
              style={{
                color:
                  chazucaColors.textMuted,
              }}
            >
              “{review.text}”
            </p>

            <div className="mt-4 flex items-center justify-between gap-2 text-[11px]">
              <span
                className="font-semibold uppercase tracking-[0.12em]"
                style={{
                  color:
                    chazucaColors.text,
                }}
              >
                {review.author}
              </span>

              <span
                style={{
                  color:
                    chazucaColors.textMuted,
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
