import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  essenzaDemoBanners,
} from "../demoData";

export function HeroEditorial() {
  const [index, setIndex] = useState(0);
  const banners = essenzaDemoBanners;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % banners.length);
    }, 7000);

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
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-6 sm:px-8">
      <div className="relative overflow-hidden">
        <img
          src={banner.image}
          alt={banner.title}
          className="h-[420px] w-full object-cover sm:h-[500px] md:h-[560px]"
        />

        {/* VEUE NEUTRA */}

        <div className="absolute inset-0 bg-neutral-950/35" />

        {/* CONTEÚDO EDITORIAL */}

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-2xl text-center">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/80">
              Essenza
            </p>

            <h1
              className="mt-4 text-3xl leading-tight text-white sm:text-4xl md:text-5xl"
              style={{
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                fontWeight: 500,
              }}
            >
              {banner.title}
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/85 sm:text-base">
              {banner.subtitle}
            </p>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-7 inline-flex items-center gap-3 border border-white px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-neutral-950"
            >
              {banner.button}
            </button>
          </div>
        </div>

        {/* CONTROLES */}

        <button
          type="button"
          onClick={previous}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/40 text-white transition hover:bg-white hover:text-neutral-950 sm:flex"
        >
          <ArrowLeft size={17} />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Próximo"
          className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/40 text-white transition hover:bg-white hover:text-neutral-950 sm:flex"
        >
          <ArrowRight size={17} />
        </button>

        {/* INDICADORES — LINHAS FINAS */}

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {banners.map((item, position) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setIndex(position)}
              aria-label={`Ir para banner ${position + 1}`}
              className={`h-px transition-all ${
                position === index
                  ? "w-10 bg-white"
                  : "w-5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroEditorial;
