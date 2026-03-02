import z from "zod";

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email().min(1, "Email is required"),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    otp: z.number().min(100000, "OTP must be at least 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const AuthValidation = {
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
