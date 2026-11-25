import Link from "next/link";

export function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="border-l-4 border-primary pl-3 text-2xl font-bold text-ink-900">{title}</h2>
      {href && <Link href={href} className="text-sm font-semibold text-primary hover:underline">{linkLabel ?? "View all"}</Link>}
    </div>
  );
}
