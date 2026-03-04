import z from "zod";

const createReportReasonSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Reason is required"),
    is_active: z.boolean().default(true),
  }),
});

const updateReportReasonSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      is_active: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be updated",
    }),
});

export const ReportValidation = {
  createReportReasonSchema,
  updateReportReasonSchema,
};
