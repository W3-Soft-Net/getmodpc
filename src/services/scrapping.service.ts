import axios from "axios";
import gPlay from "google-play-scraper";
import {
  EnumLiteApkType,
  ICheckAppVersionResponse,
  IGenericResponse,
  IPaginationOptions,
} from "../types";
import ApiError from "../utils/ApiError";
import httpStatusCodes from "http-status-codes";
import * as cheerio from "cheerio";
import { calculatePagination } from "../utils/pagination";
import { format } from "date-fns";

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
        updated_text:
          updated ??
          (app.updated ? format(new Date(app.updated), "MMM d, yyyy") : null),
        source: "google-play-store",
      };
    } catch (error) {
      throw new ApiError(httpStatusCodes.BAD_REQUEST, "Invalid URL");
    }
  }

  async getPlayStoreAppsByAppName(
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

  //=========================== LiteApks APPS =========================//
  async getLiteApkAppByUrl(url: string): Promise<any> {}

  async getAllLiteApkLatestAppsAndGames(type: EnumLiteApkType): Promise<any[]> {
    const baseUrl = "https://liteapks.com/";

    const { data } = await axios.get(`${baseUrl}${type}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);
    const apps: any[] = [];
    $(".post").each((_, el) => {
      const title = $(el).find("h3, h2, h4").first().text().trim();

      const link = $(el).find("a").first().attr("href");

      const image =
        $(el).find("img").attr("data-src") || $(el).find("img").attr("src");

      if (title && link) {
        apps.push({
          title,
          link,
          image,
        });
      }
    });

    return apps;
  }
}
