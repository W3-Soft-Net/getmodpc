import z from "zod";

export const createCommentSchema = z.object({
  body: z
    .object({
      content: z.string().min(1, "Content is required"),
      blog_id: z.string().optional(),
      post_id: z.string().optional(),
    })
    .refine((data) => data.blog_id || data.post_id, {
      message: "Either blog or post id must be provided",
      path: ["blog_id"], // can also use ["post"] or leave it generic
    }),
});

const replayCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Content is required"),
  }),
});

export const CommentValidation = {
  createCommentSchema,
  replayCommentSchema,
};
