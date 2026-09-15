interface PromotionBannerProps {
    bannerUrl?: string | null;
  }
  
  const demoBanner =
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=85";
  
  export function PromotionBanner({
    bannerUrl = demoBanner,
  }: PromotionBannerProps) {
    const imageUrl = bannerUrl?.trim() || "";
  
    if (!imageUrl) {
      return null;
    }
  
    return (
      <section className="w-full overflow-hidden">
        <div
          className="
            relative
            h-[300px]
            w-full
            sm:h-[400px]
            md:h-[500px]
            lg:h-[560px]
            xl:h-[600px]
          "
        >
          <img
            src={imageUrl}
            alt="Banner da loja"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
            "
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      </section>
    );
  }
  
  export default PromotionBanner;