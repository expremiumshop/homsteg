import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import {
  chazucaDemoBanners,
  type ChazucaBanner,
} from "../demoData";

import {
  chazucaColors,
  chazucaHeadingFont,
  chazucaBodyFont,
} from "../theme";

type HeroCarouselProps = {
  banners?: ChazucaBanner[];
  onCta?: () => void;
};

export function HeroCarousel({
  banners = chazucaDemoBanners,
  onCta,
}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex(
        (current) =>
          (current + 1) % banners.length,
      );
    }, 6000);

    return () =>
      window.clearInterval(timer);
  }, [banners.length]);

  function previous() {
    setIndex(
      (current) =>
        (current - 1 + banners.length) %
        banners.length,
    );
  }

  function next() {
    setIndex(
      (current) =>
        (current + 1) % banners.length,
    );
  }

  const banner =
    banners[index % banners.length];

  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 pt-6 sm:px-8"
      style={{
        fontFamily: chazucaBodyFont,
      }}
    >
      <div className="relative overflow-hidden rounded-3xl">
        <img
          src={banner.image}
          alt={banner.title}
          className="h-[380px] w-full object-cover sm:h-[460px] md:h-[520px]"
        />

        {/* VEUE QUENTE */}

        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/70 via-indigo-950/35 to-transparent" />

        {/* CONTEÚDO */}

        <div className="absolute inset-0 flex items-center px-6 sm:px-12">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm">
              <Sparkles size={13} />
              Chazuca Lab
            </p>

            <h1
              className="mt-5 text-3xl leading-tight text-white sm:text-4xl md:text-5xl"
              style={{
                fontFamily:
                  chazucaHeadingFont,
                fontWeight: 700,
              }}
            >
              {banner.title}
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/85 sm:text-base">
              {banner.subtitle}
            </p>

            <button
              type="button"
              onClick={onCta}
              className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:opacity-90"
              style={{
                background:
                  chazucaColors.accent,
                color:
                  chazucaColors.accentContrast,
              }}
            >
              {banner.cta}

              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* CONTROLES */}

        <button
          type="button"
          onClick={previous}
          aria-label="Banner anterior"
          className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white hover:text-indigo-950 sm:flex"
        >
          <ArrowLeft size={17} />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Próximo banner"
          className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white hover:text-indigo-950 sm:flex"
        >
          <ArrowRight size={17} />
        </button>

        {/* INDICADORES */}

        <div className="absolute bottom-5 left-6 flex items-center gap-2 sm:left-12">
          {banners.map(
            (item, position) => (
              <button
                key={item.title}
                type="button"
                onClick={() =>
                  setIndex(position)
                }
                aria-label={`Ir para banner ${position + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  position ===
                  index % banners.length
                    ? "w-7 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
