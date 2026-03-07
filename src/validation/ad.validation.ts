import { z } from "zod";
import { EnumMediaType } from "../types";

const createAdSchema = z.object({
  body: z
    .object({
      media_url: z.string().min(1, "Media URL is required").url(),
      media_type: z.nativeEnum(EnumMediaType, {
        required_error: "Media type is required",
      }),
      cta_url: z.string().min(1, "CTA URL is required").url(),
      cta_label: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      is_active: z.boolean().optional(),
      start_at: z.string().datetime(),
      end_at: z.string().datetime(),
    })
    .refine((data) => new Date(data.end_at) > new Date(data.start_at), {
      message: "end_at must be greater than start_at",
      path: ["end_at"],
    }),
});

export const updateAdSchema = z.object({
  body: z
    .object({
      media_url: z.string().url().optional(),
      media_type: z.nativeEnum(EnumMediaType).optional(),
      cta_url: z.string().url().optional(),
      cta_label: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      is_active: z.boolean().optional(),
      start_at: z.string().datetime().optional(),
      end_at: z.string().datetime().optional(),
    })
    .refine(
      (data) => {
        if (data.start_at && data.end_at) {
          return new Date(data.end_at) > new Date(data.start_at);
        }
        return true;
      },
      {
        message: "end_at must be greater than start_at",
        path: ["end_at"],
      },
    )
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be updated",
    }),
});

export const AdValidation = {
  createAdSchema,
  updateAdSchema,
};
