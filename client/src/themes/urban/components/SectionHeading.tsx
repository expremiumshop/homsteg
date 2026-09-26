import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  action?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-5">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-neutral-950 md:text-4xl">
          {title}
        </h2>
      </div>

      {action && (
        <button
          type="button"
          className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-neutral-950 sm:flex"
        >
          {action}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
