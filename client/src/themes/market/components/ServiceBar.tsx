import {
  Headphones,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  marketDemoTopBenefits,
} from "../demoData";

const icons = {
  truck: Truck,
  shield: ShieldCheck,
  refresh: RefreshCw,
  headphones: Headphones,
};

export function ServiceBar() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pt-4 sm:px-6">
      <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:grid-cols-4">
        {marketDemoTopBenefits.map((benefit) => {
          const Icon =
            icons[benefit.icon as keyof typeof icons] ??
            Truck;

          return (
            <div
              key={benefit.title}
              className="flex min-w-0 items-center gap-3 rounded-xl px-2 py-1.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {benefit.title}
                </p>

                <p className="truncate text-xs text-slate-400">
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
