import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import httpStatusCodes from "http-status-codes";
import sendResponse from "../utils/ApiResponse";

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 70,
  handler: (req: Request, res: Response) => {
    sendResponse(res, {
      message: "Too many requests, please try again later",
      statusCode: httpStatusCodes.TOO_MANY_REQUESTS,
      success: false,
    });
  },
  legacyHeaders: false,
});
