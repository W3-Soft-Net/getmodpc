import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import ApiError from "./ApiError";
import httpStatusCodes from "http-status-codes";
import { logger } from "./logger";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Upload a file to S3
 * @param file Multer file object
 * @param folder Folder path inside the bucket
 * @returns Public S3 URL
 */
export const uploadToS3 = async (
  file: Express.Multer.File,
  folder: string = "uploads"
): Promise<string> => {
  try {
    if (!file || !file.path) {
      throw new Error("File path not found");
    }

    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileName,
      Body: fs.createReadStream(file.path), // ← diskStorage compatible
      ContentType: file.mimetype,
      ACL: "public-read" as any,
    };

    await s3.send(new PutObjectCommand(params));

    // Delete local file safely
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return fileName;
  } catch (err) {
    logger.error("S3 Upload Error:", err);

    // delete file only if exists
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    throw new ApiError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to upload file to S3"
    );
  }
};

/**
 * Delete a file from S3
 * @param fileUrl Full S3 file URL
 */
export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  try {
    const bucketUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    const key = fileUrl.replace(bucketUrl, "");

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    };

    await s3.send(new DeleteObjectCommand(params));
    console.log(`Deleted from S3: ${key}`);
  } catch (err) {
    logger.error("S3 Delete Error:", err);
    throw new ApiError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete file from S3"
    );
  }
};
