import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold text-ink-900">Page not found</h1>
      <p className="text-ink-500">The page you are looking for does not exist or was moved.</p>
      <Button asChild><Link href="/">Back to home</Link></Button>
    </div>
  );
}
