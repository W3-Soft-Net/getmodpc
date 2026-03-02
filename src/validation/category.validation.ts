import z from "zod";

const createCategorySchema = z.object({
  body: z.object({
    title: z.string().min(1, "Name is required").max(100),
    thumbnail: z.any().nullable().optional(),
    description: z.string().nullable().optional(),
    is_active: z.boolean().default(true),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    title: z.string().optional(),
    thumbnail: z.any().nullable().optional(),
    description: z.string().nullable().optional(),
    is_active: z.boolean().optional(),
  }),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
