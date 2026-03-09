import axios from "axios";
import gPlay from "google-play-scraper";
import {
  ICheckAppVersionResponse,
  IGenericResponse,
  IPaginationOptions,
} from "../types";
import ApiError from "../utils/ApiError";
import httpStatusCodes from "http-status-codes";
import * as cheerio from "cheerio";
import { calculatePagination } from "../utils/pagination";
export class ScrappingService {
  async getPlayStoreAppByUrl(playStoreUrl: string): Promise<any> {
    try {
      const appId = new URL(playStoreUrl).searchParams.get("id");

      if (!appId) {
        throw new ApiError(httpStatusCodes.BAD_REQUEST, "Invalid URL");
      }

      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      };

      const [app, html] = await Promise.all([
        gPlay.app({
          appId,
          lang: "en",
        }),
        axios.get(playStoreUrl, { headers }),
      ]);

      const $ = cheerio.load(html.data);

      const bodyText = $("body").text();

      const size =
        bodyText.match(/\d+(\.\d+)?\s?(MB|GB)/i)?.[0] || "Varies with device";

      const updated =
        bodyText.match(/Updated on\s*(\w+\s\d+,\s\d+)/i)?.[1] || null;

      return {
        ...app,
        size,
        updated_text: updated,
        source: "google-play-store",
      };
    } catch (error) {
      throw new ApiError(httpStatusCodes.BAD_REQUEST, "Invalid URL");
    }
  }

  async getPlayStoreByAppName(
    searchText: string,
    paginationOptions: IPaginationOptions,
  ): Promise<IGenericResponse<any[]>> {
    const { limit, page, skip } = calculatePagination(paginationOptions);
    const apps = await gPlay.search({
      term: searchText?.toLocaleLowerCase(),
      lang: "en",
      price: "all",
      fullDetail: false,
      num: 250,
    });
    const startIndex = skip;
    const endIndex = startIndex + limit;
    const paginatedApps = apps.slice(startIndex, endIndex);
    return {
      data: paginatedApps,
      meta: {
        page,
        limit,
        total: apps.length,
      },
    };
  }

  async checkUpdate(
    appId: string,
    currentVersion: string,
  ): Promise<ICheckAppVersionResponse> {
    const app = await gPlay.app({ appId });
    return {
      update_available: app.version !== currentVersion,
      current_version: currentVersion,
      new_version: app.version,
      last_checked: new Date(),
    };
  }
}
