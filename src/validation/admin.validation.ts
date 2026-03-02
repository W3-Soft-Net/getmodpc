import z from "zod";

const createAdminSchema = z.object({
  body: z.object({
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    first_name: z.string().min(1, "First name is required").max(100),
    last_name: z.string().min(1, "Last name is required").max(100),
    is_active: z.boolean().default(true),
    role: z.string().min(1, "Role is required"),
  }),
});

const updateAdminSchema = z.object({
  body: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    is_active: z.boolean().optional(),
    role: z.string().optional(),
  }),
});

const updateMyProfileSchema = z.object({
  body: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }),
});

export const AdminValidation = {
  createAdminSchema,
  updateAdminSchema,
  updateMyProfileSchema,
};
