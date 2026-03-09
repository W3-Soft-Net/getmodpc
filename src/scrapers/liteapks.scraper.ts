import axios from "axios";
import * as cheerio from "cheerio";

async function scrapeLiteApkApp(url: string) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  const $ = cheerio.load(data);

  const title = $("h1").first().text().trim();

  const descriptionHtml = $(".entry-content").html() || null;

  const description = $(".entry-content").text().trim();

  const icon = $(".site-content img").first().attr("src") || null;

  let version: string | null = null;
  let size: string | null = null;
  let developer: string | null = null;
  let modFeatures: string | null = null;

  const texts: string[] = [];

  $(".entry-content p, li, td").each((_, el) => {
    const t = $(el).text().trim();
    if (t) texts.push(t);
  });

  texts.forEach((t) => {
    if (!version && /^\d+\.\d+/.test(t)) {
      version = t;
    }

    if (!size && /\d+\s?(MB|GB|M)/i.test(t)) {
      size = t;
    }

    if (!modFeatures && /unlocked|premium|mod/i.test(t)) {
      modFeatures = t;
    }

    if (!developer && /spotify|inc|ltd|studio/i.test(t)) {
      developer = t;
    }
  });

  const screenshots: string[] = [];

  $('a[data-fancybox="gallery"]').each((_, el) => {
    const src =
      $(el).attr("href") ||
      $(el).find("img").attr("src") ||
      $(el).find("img").attr("data-src");

    if (src) screenshots.push(src);
  });

  const downloadPage = $("a:contains('Download')").attr("href") || null;

  return {
    source: "liteapks",
    url,

    title,
    icon,

    developer,
    version,
    size,

    modFeatures,

    description,
    descriptionHtml,

    screenshots,

    downloadPage,

    score: null,
    installs: null,
    ratings: null,
    reviews: null,
  };
}

export const LiteApkScraper = {
  scrapeLiteApkApp,
};
