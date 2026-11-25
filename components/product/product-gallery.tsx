"use client";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  let [active, setActive] = useState(0);
  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-white">
        <Image src={images[active]} alt={title} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain p-4" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn("relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white", i === active && "border-primary ring-2 ring-primary/30")}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
