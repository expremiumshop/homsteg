import { useEffect, useState } from "react";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { primeBanners } from "../demoData";

type HeroCarouselProps = {
  onCta: () => void;
};

export function HeroCarousel({
  onCta,
}: HeroCarouselProps) {
  const [bannerIndex, setBannerIndex] =
    useState(0);

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setBannerIndex(
          (current) =>
            (current + 1) %
            primeBanners.length,
        );
      }, 6000);

    return () =>
      window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="relative mx-auto min-h-[480px] max-w-[1600px]">
        {primeBanners.map(
          (banner, index) => (
            <div
              key={banner.title}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === bannerIndex
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <img
                src={banner.image}
                alt=""
                className="h-full min-h-[480px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/10" />

              <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-5 md:px-8">
                <div className="max-w-xl text-white">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                    Coleção Prime
                  </div>

                  <h1 className="text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
                    {banner.title}
                  </h1>

                  <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 md:text-base">
                    {banner.subtitle}
                  </p>

                  <button
                    type="button"
                    onClick={onCta}
                    className="mt-7 inline-flex items-center gap-3 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-black transition hover:bg-orange-600"
                  >
                    {banner.button}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ),
        )}

        <div className="absolute bottom-7 left-0 right-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex gap-2">
            {primeBanners.map(
              (banner, index) => (
                <button
                  key={banner.title}
                  type="button"
                  onClick={() =>
                    setBannerIndex(index)
                  }
                  className={`h-1.5 rounded-full transition-all ${
                    index === bannerIndex
                      ? "w-10 bg-orange-500"
                      : "w-5 bg-white/40"
                  }`}
                />
              ),
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setBannerIndex(
                  (current) =>
                    (current -
                      1 +
                      primeBanners.length) %
                    primeBanners.length,
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() =>
                setBannerIndex(
                  (current) =>
                    (current + 1) %
                    primeBanners.length,
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
