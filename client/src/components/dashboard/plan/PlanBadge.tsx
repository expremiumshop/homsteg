import { getPlanDisplayName } from "@/lib/plans";

const PLAN_BADGE_STYLES: Record<
  string,
  string
> = {
  free: "bg-slate-100 text-slate-700",
  starter: "bg-sky-100 text-sky-700",
  business: "bg-violet-100 text-violet-700",
  professional: "bg-amber-100 text-amber-700",
  enterprise: "bg-emerald-100 text-emerald-700",
};

export default function PlanBadge({
  planKey,
  className = "",
}: {
  planKey: string | null | undefined;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
        PLAN_BADGE_STYLES[
          planKey ?? "free"
        ] ?? PLAN_BADGE_STYLES.free
      } ${className}`}
    >
      {getPlanDisplayName(planKey)}
    </span>
  );
}
