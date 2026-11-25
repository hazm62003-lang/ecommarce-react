import Link from "next/link";

export function PageHeader({ title, subtitle, crumbs }: { title: string; subtitle?: string; crumbs: { label: string; href?: string }[] }) {
  return (
    <div className="mb-6">
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-ink-500">
        {crumbs.map((c, i) => (
          <span key={c.label}>
            {c.href ? <Link href={c.href} className="hover:text-primary">{c.label}</Link> : <span className="text-ink-900">{c.label}</span>}
            {i < crumbs.length - 1 && " / "}
          </span>
        ))}
      </nav>
      <h1 className="text-3xl font-bold text-ink-900">{title}</h1>
      {subtitle && <p className="mt-1 text-ink-500">{subtitle}</p>}
    </div>
  );
}
