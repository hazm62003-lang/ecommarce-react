"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginValues } from "@/lib/validators";

export function LoginForm() {
  let router = useRouter();
  let callbackUrl = useSearchParams().get("callbackUrl") ?? "/";
  let [serverError, setServerError] = useState<string>();
  let { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setServerError(undefined);
    let res = await signIn("credentials", { ...values, redirect: false });
    if (res?.error) return setServerError(res.error);
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="Enter your email" aria-invalid={!!errors.email} {...register("email")} />
      </FormField>
      <FormField label="Password" htmlFor="password" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" aria-invalid={!!errors.password} {...register("password")} />
      </FormField>
      <div className="text-right text-sm"><Link href="/forgot-password" className="font-medium text-primary hover:underline">Forgot Password?</Link></div>
      {serverError && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}Sign In
      </Button>
      <p className="text-center text-sm text-ink-500">New to FreshCart? <Link href="/signup" className="font-semibold text-primary hover:underline">Create an account</Link></p>
    </form>
  );
}
