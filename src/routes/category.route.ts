import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import validateRequest from "../middlewares/validateRequest";
import { CategoryValidation } from "../validation/category.validation";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const categoryController = new CategoryController();

router.get("/", authMiddleware(), categoryController.getAllCategories);

router.get(
  "/active",
  authMiddleware(),
  categoryController.getAllActiveCategories,
);

router.get("/:id", authMiddleware(), categoryController.getCategoryById);
router.post(
  "/",
  authMiddleware(),
  validateRequest(CategoryValidation.createCategorySchema),
  categoryController.createCategory,
);
router.patch(
  "/:id",
  authMiddleware(),
  validateRequest(CategoryValidation.updateCategorySchema),
  categoryController.updateCategory,
);
router.delete("/:id", authMiddleware(), categoryController.deleteCategory);

export default router;
