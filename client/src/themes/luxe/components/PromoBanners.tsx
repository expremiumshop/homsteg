import { ArrowRight } from "lucide-react";

import { promoCards } from "../demoData";

export function PromoBanners() {
  return (
    <section className="bg-[#f7f7f5] py-12">
      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {promoCards.map((promo) => (
          <article
            key={promo.title}
            className="relative min-h-[330px] overflow-hidden rounded-3xl bg-slate-950"
          >
            <img
              src={promo.image}
              alt={promo.title}
              className="absolute inset-0 h-full w-full object-cover opacity-55"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

            <div className="relative z-10 flex min-h-[330px] max-w-lg flex-col justify-center p-7 sm:p-10">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
                {promo.eyebrow}
              </span>

              <h2 className="mt-3 text-3xl font-black leading-tight text-white">
                {promo.title}
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
                {promo.text}
              </p>

              <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-black text-slate-950">
                {promo.button}
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PromoBanners;
