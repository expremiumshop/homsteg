import { ArrowRight } from "lucide-react";

import {
  chazucaDemoPromotion,
} from "../demoData";

import {
  chazucaColors,
  chazucaHeadingFont,
  chazucaBodyFont,
} from "../theme";

type PromotionBannerProps = {
  promotion?: {
    title: string;
    subtitle: string;
    cta: string;
  };
  onCta?: () => void;
};

export function PromotionBanner({
  promotion = chazucaDemoPromotion,
  onCta,
}: PromotionBannerProps) {
  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 pt-16 sm:px-8"
      style={{
        fontFamily: chazucaBodyFont,
      }}
    >
      <div className="grid items-stretch gap-px overflow-hidden rounded-3xl border md:grid-cols-2"
        style={{
          borderColor: chazucaColors.border,
        }}
      >
        {/* TEXTO */}

        <div
          className="flex flex-col items-start justify-center px-8 py-14 sm:px-14"
          style={{
            background: chazucaColors.surface,
          }}
        >
          <p
            className="text-[11px] uppercase tracking-[0.28em]"
            style={{
              color: chazucaColors.accent,
            }}
          >
            Edição limitada
          </p>

          <h2
            className="mt-3 text-2xl leading-snug sm:text-3xl"
            style={{
              fontFamily:
                chazucaHeadingFont,
              fontWeight: 700,
              color: chazucaColors.text,
            }}
          >
            {promotion.title}
          </h2>

          <p
            className="mt-4 max-w-md text-sm leading-7"
            style={{
              color:
                chazucaColors.textMuted,
            }}
          >
            {promotion.subtitle}
          </p>

          <button
            type="button"
            onClick={onCta}
            className="mt-8 inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90"
            style={{
              background:
                chazucaColors.primary,
              color:
                chazucaColors.primaryContrast,
            }}
          >
            {promotion.cta}

            <ArrowRight size={14} />
          </button>
        </div>

        {/* IMAGEM */}

        <div
          className="relative min-h-[280px] overflow-hidden"
          style={{
            background: chazucaColors.bg,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80"
            alt={promotion.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default PromotionBanner;
