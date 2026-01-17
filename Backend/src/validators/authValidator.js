import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name must not exceed 60 characters"),
  email: z.string().email("Invalid email format"),
  address: z.string().max(400, "Address must not exceed 400 characters").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});