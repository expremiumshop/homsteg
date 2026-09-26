import { ArrowRight } from "lucide-react";

import {
  essenzaDemoPromotion,
} from "../demoData";

export function PromotionBanner() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-20 sm:px-8">
      <div className="grid items-stretch gap-px bg-neutral-200 md:grid-cols-2">
        {/* TEXTO */}

        <div className="flex flex-col items-start justify-center bg-white px-8 py-14 sm:px-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">
            Permanente
          </p>

          <h2
            className="mt-3 text-2xl leading-snug text-neutral-950 sm:text-3xl"
            style={{
              fontFamily:
                "'Playfair Display', Georgia, serif",
              fontWeight: 500,
            }}
          >
            {essenzaDemoPromotion.title}
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-neutral-500">
            {essenzaDemoPromotion.subtitle}
          </p>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-8 inline-flex items-center gap-3 border border-neutral-950 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
          >
            {essenzaDemoPromotion.cta}
            <ArrowRight size={14} />
          </button>
        </div>

        {/* IMAGEM */}

        <div className="relative min-h-[280px] overflow-hidden bg-neutral-100">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=88"
            alt={essenzaDemoPromotion.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default PromotionBanner;
