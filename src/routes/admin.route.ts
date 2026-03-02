import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import validateRequest from "../middlewares/validateRequest";
import { AdminValidation } from "../validation/admin.validation";
import { upload } from "../middlewares/multer.middleware";

const router = Router();
const adminController = new AdminController();

router.get("/", authMiddleware("view_admin"), adminController.getAllAdminUsers);
router.get(
  "/:id",
  authMiddleware("view_admin"),
  adminController.getAdminUserById,
);

router.patch(
  "/update-my-profile",
  authMiddleware(),
  upload.single("avatar"),
  validateRequest(AdminValidation.updateMyProfileSchema),
  adminController.updateMyProfile,
);

router.post(
  "/add",
  authMiddleware("create_admin"),
  upload.single("avatar"),
  validateRequest(AdminValidation.createAdminSchema),
  adminController.createAdminUser,
);
router.patch(
  "/:id",
  upload.single("avatar"),
  validateRequest(AdminValidation.updateAdminSchema),
  authMiddleware("update_admin"),
  adminController.updateAdminUser,
);
router.delete(
  "/:id",
  authMiddleware("delete_admin"),
  adminController.deleteAdminUser,
);

export default router;
