import { useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { calizaColors, calizaBodyFont } from "../theme";

type GalleryImage = {
  id: string;
  image_url: string;
};

type ProductGalleryProps = {
  image?: string | null;
  name: string;
  images?: GalleryImage[];
};

export function ProductGallery({
  image,
  name,
  images = [],
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const galleryImages =
    images.length > 0
      ? images
      : image
        ? [{ id: "main", image_url: image }]
        : [];

  if (galleryImages.length === 0) {
    return (
      <div
        className="flex aspect-square w-full items-center justify-center rounded-xl"
        style={{
          background: calizaColors.bg,
          fontFamily: calizaBodyFont,
        }}
      >
        <span
          className="text-sm"
          style={{
            color:
              calizaColors.textMuted,
          }}
        >
          Sem imagem
        </span>
      </div>
    );
  }

  function previous() {
    setActiveIndex((current) =>
      current === 0
        ? galleryImages.length - 1
        : current - 1,
    );
  }

  function next() {
    setActiveIndex(
      (current) =>
        (current + 1) % galleryImages.length,
    );
  }

  const activeImage =
    galleryImages[
      Math.min(
        activeIndex,
        galleryImages.length - 1,
      )
    ];

  return (
    <div
      className="min-w-0"
      style={{
        fontFamily: calizaBodyFont,
      }}
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl border"
        style={{
          background: calizaColors.bg,
          borderColor:
            calizaColors.border,
        }}
      >
        <img
          src={activeImage.image_url}
          alt={name}
          className="h-full w-full object-cover"
        />

        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
              style={{
                color:
                  calizaColors.text,
              }}
            >
              <ArrowLeft size={16} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
              style={{
                color:
                  calizaColors.text,
              }}
            >
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-3 flex items-center gap-2.5 overflow-x-auto scrollbar-hide">
          {galleryImages.map(
            (item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setActiveIndex(index)
                }
                className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg transition ${
                  index === activeIndex
                    ? "ring-2"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  boxShadow:
                    index ===
                    activeIndex
                      ? `0 0 0 2px ${calizaColors.primary}`
                      : undefined,
                }}
              >
                <img
                  src={item.image_url}
                  alt={`${name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
