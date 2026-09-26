import {
  Headphones,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  essenzaDemoTopBenefits,
} from "../demoData";

const icons = {
  truck: Truck,
  shield: ShieldCheck,
  refresh: RefreshCw,
  headphones: Headphones,
};

export function ServiceBar() {
  return (
    <section className="border-b border-neutral-100">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 lg:grid-cols-4">
        {essenzaDemoTopBenefits.map((benefit, index) => {
          const Icon =
            icons[benefit.icon as keyof typeof icons] ??
            Truck;

          return (
            <div
              key={benefit.title}
              className={`flex min-w-0 items-center justify-center gap-3 px-4 py-6 ${
                index > 0
                  ? "border-l border-neutral-100"
                  : ""
              }`}
            >
              <Icon
                size={19}
                strokeWidth={1.5}
                className="shrink-0 text-neutral-950"
              />

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-950">
                  {benefit.title}
                </p>

                <p className="truncate text-[11px] text-neutral-400">
                  {benefit.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ServiceBar;
