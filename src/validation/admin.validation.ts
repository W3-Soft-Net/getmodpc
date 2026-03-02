import z from "zod";

const createAdminSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").max(255),
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(255),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(8, "Password must be at most 8 characters"),
    avatar: z.string().url("Avatar must be a valid URL").optional().nullable(),
    is_active: z.boolean().optional(),
  }),
});

const updateAdminSchema = z.object({
  body: z
    .object({
      full_name: z.string().min(2).max(255).optional(),
      avatar: z
        .string()
        .url("Avatar must be a valid URL")
        .optional()
        .nullable(),
      is_active: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const AdminValidation = {
  createAdminSchema,
  updateAdminSchema,
};
