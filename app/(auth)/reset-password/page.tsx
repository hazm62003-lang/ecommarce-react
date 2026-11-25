import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-flow";

export const metadata: Metadata = { title: "Reset Password" };

export default function Page() {
  return (
    <AuthShell title="Create New Password" subtitle="Your new password must be different from previous passwords">
      <Suspense><ResetPasswordForm /></Suspense>
    </AuthShell>
  );
}
