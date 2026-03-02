import { Request } from "express";
import multer, { StorageEngine } from "multer";
import path from "path";

const storage: StorageEngine = multer.diskStorage({
  destination: function (
    req: Request,
    file: any,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: function (
    req: Request,
    file: any,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
