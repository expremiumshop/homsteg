import { useEffect, useState } from "react";

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
  const galleryImages = [
    ...(image
      ? [{ id: "main-image", image_url: image }]
      : []),
    ...images,
  ];

  const uniqueImages = Array.from(
    new Map(
      galleryImages
        .filter((item) => item?.image_url)
        .map((item) => [item.image_url, item]),
    ).values(),
  );

  const [activeImage, setActiveImage] = useState(
    uniqueImages[0]?.image_url || "/placeholder.svg",
  );

  useEffect(() => {
    if (uniqueImages.length > 0) {
      setActiveImage(uniqueImages[0].image_url);
    } else {
      setActiveImage("/placeholder.svg");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, images]);

  if (uniqueImages.length === 0) {
    return (
      <div className="w-full">
        <div className="relative aspect-square w-full overflow-hidden rounded-[28px] bg-neutral-100">
          <img
            src="/placeholder.svg"
            alt={name}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* IMAGEM PRINCIPAL */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[28px] bg-neutral-100">
        <img
          src={activeImage}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition duration-700"
        />
      </div>

      {/* MINIATURAS */}
      {uniqueImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {uniqueImages.map((item, index) => {
            const selected =
              activeImage === item.image_url;

            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() =>
                  setActiveImage(item.image_url)
                }
                aria-label={`Selecionar imagem ${index + 1}`}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl transition ${
                  selected
                    ? "ring-2 ring-neutral-950"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={item.image_url}
                  alt={`${name} - imagem ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
