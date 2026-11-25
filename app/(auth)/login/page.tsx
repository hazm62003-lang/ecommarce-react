import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome Back!" subtitle="Sign in to continue your fresh shopping experience">
      <Suspense><LoginForm /></Suspense>
    </AuthShell>
  );
}
