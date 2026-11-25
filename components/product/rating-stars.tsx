import { Star } from "lucide-react";

export function RatingStars({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(value) ? "fill-accent-yellow text-accent-yellow" : "text-ink-400/50"}`} />
        ))}
      </div>
      <span className="text-xs text-ink-500">{value}{count !== undefined && ` (${count})`}</span>
    </div>
  );
}
