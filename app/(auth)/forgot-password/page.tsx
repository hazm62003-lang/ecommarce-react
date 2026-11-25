import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/reset-flow";

export const metadata: Metadata = { title: "Forgot Password" };

export default function Page() {
  return (
    <AuthShell title="Forgot Password?" subtitle="No worries, we'll send you a reset code">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
