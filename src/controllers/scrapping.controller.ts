import { Request, Response } from "express";
import { ScrappingService } from "../services/scrapping.service";
import { catchAsync } from "../utils/catchAsync";
import sendResponse from "../utils/ApiResponse";
import httpStatusCodes from "http-status-codes";
import { ICheckAppVersionResponse, IPaginationOptions } from "../types";
import pick from "../utils/pick";
import { paginationFields } from "../const/pagination.const";

export class ScrappingController {
  private readonly scrappingService = new ScrappingService();
  public getPlayStoreAppByUrl = catchAsync(
    async (req: Request, res: Response) => {
      const appData = await this.scrappingService.getPlayStoreAppByUrl(
        req.body.url,
      );
      sendResponse(res, {
        message: "App data fetched successfully",
        statusCode: httpStatusCodes.OK,
        data: appData,
        success: true,
      });
    },
  );

  public getPlayStoreByAppName = catchAsync(
    async (req: Request, res: Response) => {
      const { appName } = req.query;
      const paginationOptions: IPaginationOptions = pick(
        req.query,
        paginationFields,
      );
      const appData = await this.scrappingService.getPlayStoreByAppName(
        appName as string,
        paginationOptions,
      );
      sendResponse(res, {
        message: "App data fetched successfully",
        statusCode: httpStatusCodes.OK,
        data: appData.data,
        meta: appData.meta,
        success: true,
      });
    },
  );

  public checkUpdate = catchAsync(async (req: Request, res: Response) => {
    const appData = await this.scrappingService.checkUpdate(
      req.body.appId,
      req.body.currentVersion,
    );
    sendResponse<ICheckAppVersionResponse>(res, {
      message: "App data fetched successfully",
      statusCode: httpStatusCodes.OK,
      data: appData,
      success: true,
    });
  });
}
