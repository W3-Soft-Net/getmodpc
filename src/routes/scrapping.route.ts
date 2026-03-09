import { Router } from "express";
import validateRequest from "../middlewares/validateRequest";
import { AppValidation } from "../validation/app.validation";
import axios from "axios";
import { ScrappingController } from "../controllers/scrapping.controller";

const router = Router();
const scrappingController = new ScrappingController();

router.get(
  "/get-search-playstore-apps",
  scrappingController.getPlayStoreByAppName,
);
router.post(
  "/playstore-app-by-url",
  validateRequest(AppValidation.getAppScrapingSchema),
  scrappingController.getPlayStoreAppByUrl,
);

router.post(
  "/check-app-version",
  validateRequest(AppValidation.checkAppVersionSchema),
  scrappingController.checkUpdate,
);

export default router;
