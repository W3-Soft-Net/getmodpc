import { Request, Response } from "express";
import { paginationFields } from "../const/pagination.const";
import { AdminService } from "../services/admin.service";
import { IPaginationOptions } from "../types";
import pick from "../utils/pick";
import sendResponse from "../utils/ApiResponse";
import { Admin } from "../models/admin.model";
import { AdminConstant } from "../const/admin.const";
import { uploadToS3 } from "../utils/s3Upload";
import httpStatusCodes from "http-status-codes";

export class AdminController {
  private adminService = new AdminService();

  public getAllAdminUsers = async (req: Request, res: Response) => {
    const filters = pick(req.query, AdminConstant.adminFiltersFields);
    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields
    );
    const adminUsers = await this.adminService.getAllAdminUsers(
      filters,
      paginationOptions
    );
    sendResponse<Admin[]>(res, {
      message: "Admin users fetched successfully",
      statusCode: httpStatusCodes.OK,
      data: adminUsers.data,
      meta: adminUsers.meta,
      success: true,
    });
  };

  public getAdminUserById = async (req: Request, res: Response) => {
    const adminUser = await this.adminService.getAdminUserById(req.params.id);
    sendResponse<Admin>(res, {
      message: "Admin user fetched successfully",
      statusCode: httpStatusCodes.OK,
      data: adminUser,
      success: true,
    });
  };

  public createAdminUser = async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };
    if (req.file) {
      payload.avatar = await uploadToS3(req.file);
    }
    const adminUser = await this.adminService.createAdminUser(payload);
    sendResponse<Admin>(res, {
      message: "Admin user created successfully",
      statusCode: httpStatusCodes.CREATED,
      data: adminUser,
      success: true,
    });
  };

  public updateAdminUser = async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };

    if (req.file) {
      payload.avatar = await uploadToS3(req.file);
    }
    const updatedAdminUser = await this.adminService.updateAdminUser(
      req.params.id,
      payload
    );
    sendResponse<Admin>(res, {
      message: "Admin user updated successfully",
      statusCode: httpStatusCodes.OK,
      data: updatedAdminUser,
      success: true,
    });
  };

  public updateMyProfile = async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };

    if (req.file) {
      payload.avatar = await uploadToS3(req.file);
    }
    const updatedAdminUser = await this.adminService.updateAdminUser(
      req?.admin?.id as string,
      payload
    );
    sendResponse<Admin>(res, {
      message: "Admin user updated successfully",
      statusCode: httpStatusCodes.OK,
      data: updatedAdminUser,
      success: true,
    });
  };

  public deleteAdminUser = async (req: Request, res: Response) => {
    const deletedAdminUser = await this.adminService.deleteAdminUser(
      req.params.id
    );
    sendResponse<Boolean>(res, {
      message: "Admin user deleted successfully",
      statusCode: httpStatusCodes.OK,
      data: deletedAdminUser,
      success: true,
    });
  };
}
