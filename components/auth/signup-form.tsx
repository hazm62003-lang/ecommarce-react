"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { api, apiError } from "@/lib/api/client";
import { signupSchema, type SignupValues } from "@/lib/validators";

export function SignupForm() {
  let router = useRouter();
  let { register, handleSubmit, formState: { errors } } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  let signup = useMutation({
    mutationFn: async (v: SignupValues) => api.post("/v1/auth/signup", v),
    onSuccess: async (_res, v) => {
      toast.success("Account created");
      let res = await signIn("credentials", { email: v.email, password: v.password, redirect: false });
      router.push(res?.error ? "/login" : "/");
      router.refresh();
    },
    onError: (e) => toast.error(apiError(e, "Could not create your account")),
  });

  return (
    <form onSubmit={handleSubmit((v) => signup.mutate(v))} className="space-y-4" noValidate>
      <FormField label="Name" htmlFor="name" error={errors.name?.message}><Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} /></FormField>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}><Input id="email" type="email" autoComplete="email" placeholder="ali@example.com" aria-invalid={!!errors.email} {...register("email")} /></FormField>
      <FormField label="Password" htmlFor="password" error={errors.password?.message}><Input id="password" type="password" autoComplete="new-password" placeholder="Create a strong password" aria-invalid={!!errors.password} {...register("password")} /></FormField>
      <FormField label="Confirm Password" htmlFor="rePassword" error={errors.rePassword?.message}><Input id="rePassword" type="password" autoComplete="new-password" aria-invalid={!!errors.rePassword} {...register("rePassword")} /></FormField>
      <FormField label="Phone Number" htmlFor="phone" error={errors.phone?.message}><Input id="phone" type="tel" autoComplete="tel" placeholder="01xxxxxxxxx" aria-invalid={!!errors.phone} {...register("phone")} /></FormField>
      <Button type="submit" size="lg" className="w-full" disabled={signup.isPending}>
        {signup.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Create Account
      </Button>
      <p className="text-center text-sm text-ink-500">Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Sign In</Link></p>
    </form>
  );
}
