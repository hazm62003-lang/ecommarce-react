import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyCodeForm } from "@/components/auth/reset-flow";

export const metadata: Metadata = { title: "Verify Reset Code" };

export default function Page() {
  return (
    <AuthShell title="Check Your Email" subtitle="Enter the code we sent to reset your password">
      <Suspense><VerifyCodeForm /></Suspense>
    </AuthShell>
  );
}
