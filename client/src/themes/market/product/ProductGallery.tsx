import { useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-slate-100">
        <span className="text-sm text-slate-400">
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
      Math.min(activeIndex, galleryImages.length - 1)
    ];

  return (
    <div className="min-w-0">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
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
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {galleryImages.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                index === activeIndex
                  ? "border-emerald-600"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={item.image_url}
                alt={`${name} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
