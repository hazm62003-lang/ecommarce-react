"use client";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold text-ink-900">We couldn&apos;t load this page</h2>
      <p className="max-w-md text-ink-500">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
