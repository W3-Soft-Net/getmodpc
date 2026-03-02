import { Router } from "express";
import { PageController } from "../controllers/page.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import validateRequest from "../middlewares/validateRequest";
import { PageValidation } from "../validation/page.validation";

const router = Router();
const pageController = new PageController();

router.get("/", authMiddleware("view_page"), pageController.getAllPages);
router.get("/:id", authMiddleware("view_page"), pageController.getPageById);
router.get("/slug/:slug", pageController.getPageBySlug);
router.post(
  "/",
  authMiddleware("create_page"),
  validateRequest(PageValidation.createPageSchema),
  pageController.createPage,
);
router.patch(
  "/:id",
  authMiddleware("update_page"),
  validateRequest(PageValidation.updatePageSchema),
  pageController.updatePage,
);
router.delete("/:id", authMiddleware("delete_page"), pageController.deletePage);

export default router;
