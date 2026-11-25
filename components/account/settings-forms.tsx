"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { api, apiError } from "@/lib/api/client";
import { passwordSchema, profileSchema } from "@/lib/validators";
import type { z } from "zod";

export function SettingsForms() {
  let { data: session, update } = useSession();
  let p = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: { name: session?.user?.name ?? "", email: session?.user?.email ?? "", phone: "" },
  });
  let pw = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema) });

  let saveProfile = useMutation({
    mutationFn: (v: z.infer<typeof profileSchema>) => api.put("/v1/users/updateMe/", v),
    onSuccess: async (_r, v) => { toast.success("Profile updated"); await update?.({ name: v.name, email: v.email }); },
    onError: (e) => toast.error(apiError(e, "Could not update your profile")),
  });

  let changePassword = useMutation({
    mutationFn: (v: z.infer<typeof passwordSchema>) => api.put("/v1/users/changeMyPassword", v),
    onSuccess: () => { toast.success("Password changed. Please sign in again."); signOut({ callbackUrl: "/login" }); },
    onError: (e) => toast.error(apiError(e, "Could not change your password")),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={p.handleSubmit((v) => saveProfile.mutate(v))} className="space-y-4 rounded-xl border bg-white p-6" noValidate>
        <div><h2 className="text-lg font-bold text-ink-900">Profile Information</h2><p className="text-sm text-ink-500">Update your personal details</p></div>
        <FormField label="Full Name" htmlFor="name" error={p.formState.errors.name?.message}><Input id="name" {...p.register("name")} /></FormField>
        <FormField label="Email Address" htmlFor="email" error={p.formState.errors.email?.message}><Input id="email" type="email" {...p.register("email")} /></FormField>
        <FormField label="Phone Number" htmlFor="phone" error={p.formState.errors.phone?.message}><Input id="phone" type="tel" placeholder="01xxxxxxxxx" {...p.register("phone")} /></FormField>
        <Button type="submit" disabled={saveProfile.isPending}>{saveProfile.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Save Changes</Button>
      </form>

      <form onSubmit={pw.handleSubmit((v) => changePassword.mutate(v))} className="space-y-4 rounded-xl border bg-white p-6" noValidate>
        <div><h2 className="text-lg font-bold text-ink-900">Change Password</h2><p className="text-sm text-ink-500">Update your account password</p></div>
        <FormField label="Current Password" htmlFor="currentPassword" error={pw.formState.errors.currentPassword?.message}><Input id="currentPassword" type="password" autoComplete="current-password" {...pw.register("currentPassword")} /></FormField>
        <FormField label="New Password" htmlFor="password" error={pw.formState.errors.password?.message}><Input id="password" type="password" autoComplete="new-password" {...pw.register("password")} /></FormField>
        <FormField label="Confirm New Password" htmlFor="rePassword" error={pw.formState.errors.rePassword?.message}><Input id="rePassword" type="password" autoComplete="new-password" {...pw.register("rePassword")} /></FormField>
        <Button type="submit" disabled={changePassword.isPending}>{changePassword.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Change Password</Button>
      </form>
    </div>
  );
}
