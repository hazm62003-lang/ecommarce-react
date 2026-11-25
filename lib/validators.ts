import { z } from "zod";

export let loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export let signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/\d/, "Include a number")
      .regex(/[^A-Za-z0-9]/, "Include a symbol"),
    rePassword: z.string(),
    phone: z.string().regex(/^01[0125][0-9]{8}$/, "Enter an Egyptian number (01xxxxxxxxx)"),
  })
  .refine((v) => v.password === v.rePassword, { path: ["rePassword"], message: "Passwords do not match" });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;

export let profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "Enter an Egyptian number (01xxxxxxxxx)"),
});
export let passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    password: z.string().min(6, "Must be at least 6 characters"),
    rePassword: z.string(),
  })
  .refine((v) => v.password === v.rePassword, { path: ["rePassword"], message: "Passwords do not match" });
export let addressSchema = z.object({
  name: z.string().min(2, "Give the address a name (e.g. Home)"),
  city: z.string().min(2, "City is required"),
  details: z.string().min(5, "Enter the full address"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "Enter an Egyptian number (01xxxxxxxxx)"),
});
export let emailSchema = z.object({ email: z.string().email("Enter a valid email address") });
export let codeSchema = z.object({ resetCode: z.string().regex(/^\d{6}$/, "Enter the 6-digit code") });
export let newPasswordSchema = z
  .object({ newPassword: z.string().min(6, "Must be at least 6 characters"), confirm: z.string() })
  .refine((v) => v.newPassword === v.confirm, { path: ["confirm"], message: "Passwords do not match" });
