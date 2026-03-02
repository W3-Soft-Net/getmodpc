import z from "zod";

const createTagDeveloperSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(255),
    description: z.string().max(1000).optional().nullable(),
  }),
});

const updateTagDeveloperSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters").max(255),
      description: z.string().max(1000).optional().nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be updated",
    }),
});

export const TagDeveloperValidation = {
  createTagDeveloperSchema,
  updateTagDeveloperSchema,
};
