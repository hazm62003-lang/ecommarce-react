import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container grid grid-cols-2 gap-4 py-10 md:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
    </div>
  );
}
