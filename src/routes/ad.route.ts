import { Router } from "express";
import { AdController } from "../controllers/ad.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import validateRequest from "../middlewares/validateRequest";
import { AdValidation } from "../validation/ad.validation";

const router = Router();

const adController = new AdController();

router.get("/", authMiddleware(), adController.getAllAds);
router.get("/active", adController.getAllActiveAds);
router.get("/:id", authMiddleware(), adController.getAdById);
router.post(
  "/",
  authMiddleware(),
  validateRequest(AdValidation.createAdSchema),
  adController.createAd,
);
router.patch(
  "/:id",
  authMiddleware(),
  validateRequest(AdValidation.updateAdSchema),
  adController.updateAd,
);
router.delete("/:id", authMiddleware(), adController.deleteAd);

export default router;
