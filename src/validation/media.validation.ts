import z from "zod";

const createFolderSchema = z.object({
  body: z.object({
    folderName: z.string().min(1, "Folder name is required"),
  }),
});

const renameFolderSchema = z.object({
  body: z.object({
    oldFolder: z.string().min(1, "Old Folder name is required"),
    newFolder: z.string().min(1, "New Folder name is required"),
  }),
});

const deleteMediasSchema = z.object({
  body: z.object({
    fileKeys: z
      .array(z.string().min(1, "File key is required"))
      .min(1, "At least one file key is required"),
  }),
});

export const MediaValidation = {
  createFolderSchema,
  deleteMediasSchema,
  renameFolderSchema,
};
