import z from "zod";

const getAppScrapingSchema = z.object({
  body: z.object({
    url: z.string().min(1, "Url is required").url("Invalid url"),
  }),
});

const checkAppVersionSchema = z.object({
  body: z.object({
    appId: z.string().min(1, "App id is required"),
    currentVersion: z.string().min(1, "Current version is required"),
  }),
});

export const AppValidation = {
  checkAppVersionSchema,
  getAppScrapingSchema,
};
