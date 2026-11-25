"use client";
import { useRouter, useSearchParams } from "next/navigation";

let options = [
  { value: "", label: "Relevance" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
  { value: "-ratingsAverage", label: "Top rated" },
];

export function SortSelect() {
  let router = useRouter();
  let sp = useSearchParams();
  return (
    <label className="flex items-center gap-2 text-sm text-ink-600">
      Sort by:
      <select
        value={sp.get("sort") ?? ""}
        onChange={(e) => {
          let next = new URLSearchParams(sp.toString());
          if (e.target.value) next.set("sort", e.target.value); else next.delete("sort");
          next.delete("page");
          router.push(`/products?${next}`);
        }}
        className="h-10 rounded-lg border bg-white px-3"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
