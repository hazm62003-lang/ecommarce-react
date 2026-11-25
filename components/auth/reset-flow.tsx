"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { api, apiError } from "@/lib/api/client";
import { codeSchema, emailSchema, newPasswordSchema } from "@/lib/validators";

export function ForgotPasswordForm() {
  let router = useRouter();
  let { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });
  let send = useMutation({
    mutationFn: (v: z.infer<typeof emailSchema>) => api.post("/v1/auth/forgotPasswords", v),
    onSuccess: (_r, v) => { toast.success("Reset code sent. Check your email."); router.push(`/verify-code?email=${encodeURIComponent(v.email)}`); },
    onError: (e) => toast.error(apiError(e, "Could not send the reset code")),
  });
  return (
    <form onSubmit={handleSubmit((v) => send.mutate(v))} className="space-y-4" noValidate>
      <FormField label="Email Address" htmlFor="email" error={errors.email?.message}><Input id="email" type="email" autoComplete="email" placeholder="Enter your email address" {...register("email")} /></FormField>
      <Button type="submit" size="lg" className="w-full" disabled={send.isPending}>{send.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Send Reset Code</Button>
      <p className="text-center text-sm text-ink-500">Remember your password? <Link href="/login" className="font-semibold text-primary hover:underline">Sign In</Link></p>
    </form>
  );
}

export function VerifyCodeForm() {
  let router = useRouter();
  let email = useSearchParams().get("email") ?? "";
  let { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof codeSchema>>({ resolver: zodResolver(codeSchema) });
  let verify = useMutation({
    mutationFn: (v: z.infer<typeof codeSchema>) => api.post("/v1/auth/verifyResetCode", v),
    onSuccess: () => router.push(`/reset-password?email=${encodeURIComponent(email)}`),
    onError: (e) => toast.error(apiError(e, "Invalid or expired code")),
  });
  let resend = useMutation({
    mutationFn: () => api.post("/v1/auth/forgotPasswords", { email }),
    onSuccess: () => toast.success("A new code was sent"),
    onError: (e) => toast.error(apiError(e, "Could not resend the code")),
  });
  return (
    <form onSubmit={handleSubmit((v) => verify.mutate(v))} className="space-y-4" noValidate>
      <p className="text-sm text-ink-500">Enter the 6-digit code sent to <span className="font-medium text-ink-900">{email}</span></p>
      <FormField label="Verification Code" htmlFor="resetCode" error={errors.resetCode?.message}>
        <Input id="resetCode" inputMode="numeric" maxLength={6} autoComplete="one-time-code" className="text-center text-xl tracking-[0.5em]" {...register("resetCode")} />
      </FormField>
      <Button type="submit" size="lg" className="w-full" disabled={verify.isPending}>{verify.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Verify Code</Button>
      <div className="flex justify-between text-sm">
        <button type="button" className="font-semibold text-primary hover:underline disabled:opacity-50" disabled={!email || resend.isPending} onClick={() => resend.mutate()}>Resend Code</button>
        <Link href="/forgot-password" className="text-ink-500 hover:text-primary">Change email address</Link>
      </div>
    </form>
  );
}

export function ResetPasswordForm() {
  let router = useRouter();
  let email = useSearchParams().get("email") ?? "";
  let { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof newPasswordSchema>>({ resolver: zodResolver(newPasswordSchema) });
  let reset = useMutation({
    mutationFn: (v: z.infer<typeof newPasswordSchema>) => api.put("/v1/auth/resetPassword", { email, newPassword: v.newPassword }),
    onSuccess: async (_r, v) => {
      toast.success("Password updated");
      let res = await signIn("credentials", { email, password: v.newPassword, redirect: false });
      router.push(res?.error ? "/login" : "/");
      router.refresh();
    },
    onError: (e) => toast.error(apiError(e, "Could not reset your password")),
  });
  return (
    <form onSubmit={handleSubmit((v) => reset.mutate(v))} className="space-y-4" noValidate>
      <FormField label="New Password" htmlFor="newPassword" error={errors.newPassword?.message}><Input id="newPassword" type="password" autoComplete="new-password" placeholder="Enter new password" {...register("newPassword")} /></FormField>
      <FormField label="Confirm Password" htmlFor="confirm" error={errors.confirm?.message}><Input id="confirm" type="password" autoComplete="new-password" placeholder="Confirm new password" {...register("confirm")} /></FormField>
      <Button type="submit" size="lg" className="w-full" disabled={reset.isPending || !email}>{reset.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Reset Password</Button>
    </form>
  );
}
