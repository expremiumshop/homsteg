import { urbanBenefits } from "../demoData";

export function BenefitsSection() {
  return (
    <section className="border-y border-neutral-100 bg-neutral-50">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {urbanBenefits.map((benefit) => (
          <div key={benefit.title} className="px-6 py-10 lg:px-8">
            <div className="h-2 w-2 rounded-full bg-neutral-950" />

            <h3 className="mt-5 text-sm font-black text-neutral-950">
              {benefit.title}
            </h3>

            <p className="mt-2 max-w-[230px] text-sm leading-6 text-neutral-500">
              {benefit.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
