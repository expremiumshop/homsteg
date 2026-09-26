import { Star } from "lucide-react";

type RatingProps = {
  value: number;
};

export function Rating({ value }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-current text-neutral-900" />
      <span className="text-[11px] font-bold text-neutral-600">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
