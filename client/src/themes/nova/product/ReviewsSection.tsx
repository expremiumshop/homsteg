import {
    Star,
    Image as ImageIcon,
  } from "lucide-react";

  import { useI18n } from "@/lib/i18n-context";

  export default function ReviewsSection() {
    const { t } = useI18n();

    return (
      <section
        className="
          space-y-6
          rounded-xl
          bg-white
          p-6
        "
      >
        {/* TÍTULO */}
        <h2
          className="
            text-2xl
            font-bold
            text-gray-900
          "
        >
          {t("product.reviews")}
        </h2>
  
        {/* RESUMO */}
        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-3
          "
        >
          {/* NOTA */}
          <div
            className="
              rounded-xl
              p-5
              text-center
            "
          >
            <p
              className="
                text-5xl
                font-bold
                text-orange-500
              "
            >
              4.8
            </p>
  
            <div
              className="
                my-3
                flex
                justify-center
                gap-1
              "
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={20}
                  fill="currentColor"
                  className="text-orange-500"
                />
              ))}
            </div>
  
            <p
              className="
                text-sm
                text-gray-500
              "
            >
              {t("product.avgRating")}
            </p>
          </div>
  
          {/* BARRAS */}
          <div
            className="
              space-y-3
              md:col-span-2
            "
          >
            {[5, 4, 3, 2, 1].map((stars, index) => (
              <div
                key={stars}
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    w-20
                    text-sm
                  "
                >
                  {stars === 1
                    ? t("product.star1")
                    : t("product.starsN", { count: stars })}
                </span>
  
                <div
                  className="
                    h-3
                    flex-1
                    overflow-hidden
                    rounded-full
                    bg-gray-200
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-orange-500
                    "
                    style={{
                      width:
                        index === 0
                          ? "85%"
                          : "10%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* COMENTÁRIOS */}
        <div
          className="
            space-y-4
            pt-5
          "
        >          <h3 className="font-bold">
            {t("product.customerComments")}
          </h3>

          <div
            className="
              rounded-lg
              p-4
              text-sm
              text-gray-500
            "
          >
            {t("product.noReviews")}
            <br />
            {t("product.noReviewsHint")}
          </div>
        </div>
  
        {/* FOTOS */}
        <div
          className="
            pt-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              font-semibold
            "
          >            <ImageIcon size={20} />

            {t("product.customerPhotos")}
          </div>
  
          <div
            className="
              mt-4
              grid
              grid-cols-3
              gap-3
              md:grid-cols-6
            "
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="
                  aspect-square
                  rounded-lg
                  bg-gray-100
                "
              />
            ))}
          </div>
        </div>
      </section>
    );
  }