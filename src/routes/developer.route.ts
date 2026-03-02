import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import validateRequest from "../middlewares/validateRequest";
import { TagDeveloperValidation } from "../validation/tag-developer.validation";
import { DeveloperController } from "../controllers/developer.controller";

const router = Router();

const developerController = new DeveloperController();
router.get("/", authMiddleware(), developerController.getAllDevelopers);
router.get("/:id", authMiddleware(), developerController.getDeveloperById);
router.get(
  "/slug/:slug",
  authMiddleware(),
  developerController.getDeveloperBySlug,
);
router.post(
  "/",
  authMiddleware(),
  validateRequest(TagDeveloperValidation.createTagDeveloperSchema),
  developerController.createDeveloper,
);
router.patch(
  "/:id",
  authMiddleware(),
  validateRequest(TagDeveloperValidation.updateTagDeveloperSchema),
  developerController.updateDeveloper,
);
router.delete("/:id", authMiddleware(), developerController.deleteDeveloper);

export default router;
