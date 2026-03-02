import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import httpStatusCodes from "http-status-codes";
import { AppDataSource } from "../config/db";
import { Admin } from "../models/admin.model";
import { verifyAccessToken } from "../utils/generateTokens";

export const authMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      const authHeader =
        req.headers.authorization || (req.headers.Authorization as string);
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      }

      if (!token) {
        throw new ApiError(httpStatusCodes.UNAUTHORIZED, "No token provided");
      }

      const decoded = verifyAccessToken(token);

      if (!decoded || !decoded?.userId) {
        throw new ApiError(
          httpStatusCodes.UNAUTHORIZED,
          "Invalid token or failed to verify token",
        );
      }

      const adminRepository = AppDataSource.getRepository(Admin);
      const admin = await adminRepository.findOne({
        where: { id: decoded.userId },
        select: ["id", "email", "avatar", "full_name", "is_active"],
      });

      if (!admin) {
        throw new ApiError(httpStatusCodes.UNAUTHORIZED, "Invalid token");
      }

      if (!admin.is_active) {
        throw new ApiError(
          httpStatusCodes.UNAUTHORIZED,
          "Your account is inactive. Please contact support.",
        );
      }
      req.admin = admin;
      return next();
    } catch (error) {
      next(error);
    }
  };
