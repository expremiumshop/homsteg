import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  marketDemoBanners,
} from "../demoData";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const banners = marketDemoBanners;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % banners.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  function previous() {
    setIndex(
      (current) =>
        (current - 1 + banners.length) % banners.length,
    );
  }

  function next() {
    setIndex((current) => (current + 1) % banners.length);
  }

  const banner = banners[index];

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pt-5 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-emerald-900">
        <img
          src={banner.image}
          alt={banner.title}
          className="h-[240px] w-full object-cover sm:h-[320px] md:h-[380px]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-950/45 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <div className="max-w-lg">
            <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-950">
              Market Ofertas
            </span>

            <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
              {banner.title}
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-emerald-50/90 sm:text-base">
              {banner.subtitle}
            </p>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-5 inline-flex w-fit items-center justify-center rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-emerald-600"
            >
              {banner.button}
            </button>
          </div>
        </div>

        {/* CONTROLES */}

        <button
          type="button"
          onClick={previous}
          aria-label="Banner anterior"
          className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:flex"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Próximo banner"
          className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:flex"
        >
          <ChevronRight size={20} />
        </button>

        {/* INDICADORES */}

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {banners.map((item, position) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setIndex(position)}
              aria-label={`Ir para banner ${position + 1}`}
              className={`h-2 rounded-full transition-all ${
                position === index
                  ? "w-7 bg-amber-400"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
