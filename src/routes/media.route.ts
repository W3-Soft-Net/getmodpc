import { Router } from "express";
import { MediaController } from "../controllers/media.controller";
import { adminAuthMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { statusMiddleware } from "../middlewares/status-middleware";

const router = Router();
const mediaController = new MediaController();

router.get("/", adminAuthMiddleware("view_media"), mediaController.getAllMedia);
router.get(
  "/:id",
  adminAuthMiddleware("view_media"),
  mediaController.getMediaById,
);

router.post(
  "/",
  adminAuthMiddleware("create_media"),
  upload.array("media", 10),
  mediaController.addMultipleMedia,
);

router.post(
  "/upload-media-for-chat",
  authMiddleware(),
  statusMiddleware(),
  upload.array("media", 1),
  mediaController.addMultipleMedia,
);

router.post(
  "/delete-medias",
  adminAuthMiddleware("delete_media"),
  mediaController.deleteMultipleMedia,
);

export default router;
