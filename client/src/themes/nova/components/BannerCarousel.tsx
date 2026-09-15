"use client";

import { useEffect, useState } from "react";

export interface NovaBanner {
  id: string;
  image_url: string;
  position: number;
}

interface BannerCarouselProps {
  banners?: NovaBanner[];
}

const demoBanners: NovaBanner[] = [
  {
    id: "nova-banner-1",
    image_url:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",
    position: 1,
  },
  {
    id: "nova-banner-2",
    image_url:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85",
    position: 2,
  },
  {
    id: "nova-banner-3",
    image_url:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85",
    position: 3,
  },
];

export default function BannerCarousel({
  banners = demoBanners,
}: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  const orderedBanners = [...banners].sort(
    (a, b) => a.position - b.position,
  );

  useEffect(() => {
    if (orderedBanners.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrent((value) => (value + 1) % orderedBanners.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [orderedBanners.length]);

  useEffect(() => {
    if (current >= orderedBanners.length) {
      setCurrent(0);
    }
  }, [current, orderedBanners.length]);

  if (orderedBanners.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-3 py-3 md:px-6 md:py-5">
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1440px]
          overflow-hidden
          rounded-2xl
          md:rounded-3xl
          bg-gray-100
        "
      >
        <div
          className="
            relative
            w-full
            aspect-[16/7]
            sm:aspect-[16/7]
            md:aspect-[16/6]
            lg:aspect-[16/5.5]
          "
        >
          {orderedBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`
                absolute
                inset-0
                transition-opacity
                duration-700
                ease-in-out
                ${
                  index === current
                    ? "z-10 opacity-100"
                    : "z-0 opacity-0"
                }
              `}
            >
              <div className="block h-full w-full">
                <img
                  src={banner.image_url}
                  alt={`Banner ${index + 1}`}
                  className="
                    block
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>
            </div>
          ))}
        </div>

        {orderedBanners.length > 1 && (
          <div
            className="
              absolute
              bottom-3
              left-1/2
              z-20
              flex
              -translate-x-1/2
              items-center
              gap-2
              rounded-full
              bg-black/30
              px-3
              py-1.5
              backdrop-blur-sm
              md:bottom-4
            "
          >
            {orderedBanners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Ir para banner ${index + 1}`}
                className={`
                  h-2
                  rounded-full
                  transition-all
                  ${
                    index === current
                      ? "w-6 bg-white"
                      : "w-2 bg-white/60"
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}