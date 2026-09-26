import { Star } from "lucide-react";

type RatingProps = {
  value: number;
  reviews?: number;
};

export function Rating({
  value,
  reviews,
}: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <Star
              key={index}
              className={`h-3.5 w-3.5 ${
                index <
                Math.round(value)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }`}
            />
          ),
        )}
      </div>

      <span className="text-xs font-semibold text-slate-700">
        {value.toFixed(1)}
      </span>

      {reviews !== undefined && (
        <span className="text-xs text-slate-400">
          ({reviews})
        </span>
      )}
    </div>
  );
}

export default Rating;
