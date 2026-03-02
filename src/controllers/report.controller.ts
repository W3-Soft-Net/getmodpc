import { Request, Response } from "express";
import { ReportService } from "../services/report.service";
import { catchAsync } from "../utils/catchAsync";
import httpStatusCode from "http-status-codes";
import pick from "../utils/pick";
import { ReportConstant } from "../const/report.const";
import { IPaginationOptions } from "../types";
import { paginationFields } from "../const/pagination.const";
import sendResponse from "../utils/ApiResponse";
import { Report } from "../models/report.model";
import { User } from "../models/user.model";
import { uploadToS3 } from "../utils/s3Upload";

export class ReportController {
  private reportService = new ReportService();

  public getAllReports = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ReportConstant.reportFiltersFields);
    const pagination: IPaginationOptions = pick(req.query, paginationFields);
    const reports = await this.reportService.getAllReports(filters, pagination);
    sendResponse<Report[]>(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      data: reports.data,
      meta: reports.meta,
      message: "Reports fetched successfully",
    });
  });

  public getAllMyReports = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ReportConstant.reportFiltersFields);
    const userId = (req?.user as User)?.id as string;
    const pagination: IPaginationOptions = pick(req.query, paginationFields);
    const reports = await this.reportService.getAllReports(
      {
        ...filters,
        reporter: userId,
      },
      pagination
    );
    sendResponse<Report[]>(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      data: reports.data,
      meta: reports.meta,
      message: "Reports fetched successfully",
    });
  });

  public getReportById = catchAsync(async (req: Request, res: Response) => {
    const report = await this.reportService.getReportById(req.params.id);
    sendResponse<Report>(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      data: report,
      message: "Report fetched successfully",
    });
  });

  public createReport = catchAsync(async (req: Request, res: Response) => {
    const userId = (req?.user as User)?.id as string;

    const file = req.file as Express.Multer.File;

    // Upload all files to S3
    const media = file ? await uploadToS3(file) : undefined;

    const payload = {
      ...req.body,
      reporter: userId,
      media,
    };
    const report = await this.reportService.createReport(payload);
    sendResponse<Report>(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      data: report,
      message: "Report created successfully",
    });
  });

  public updateReport = catchAsync(async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;

    const payload: Partial<Report> = {
      ...req.body,
    };

    if (file) {
      payload.media = await uploadToS3(file);
    }

    const report = await this.reportService.updateReport(
      req.params.id,
      payload
    );

    sendResponse<Report>(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      data: report,
      message: "Report updated successfully",
    });
  });

  public deleteReport = catchAsync(async (req: Request, res: Response) => {
    const userId = (req?.user as User)?.id;
    await this.reportService.deleteReport(req.params.id, userId);
    sendResponse<void>(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Report deleted successfully",
    });
  });
}
