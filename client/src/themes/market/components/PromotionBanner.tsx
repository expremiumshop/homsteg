import {
  ArrowRight,
  BadgePercent,
} from "lucide-react";

import {
  marketDemoPromotion,
} from "../demoData";

export function PromotionBanner() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pt-10 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-10 sm:px-10">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-400/20 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-emerald-950">
              <BadgePercent size={26} />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                {marketDemoPromotion.title}
              </h2>

              <p className="mt-1 max-w-lg text-sm leading-6 text-emerald-50/90">
                {marketDemoPromotion.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-emerald-700 transition hover:bg-amber-300 hover:text-emerald-950"
          >
            {marketDemoPromotion.cta}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PromotionBanner;
