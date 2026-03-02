import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import validateRequest from "../middlewares/validateRequest";
import { CommentValidation } from "../validation/comment.validation";

const router = Router();
const commentController = new CommentController();

router.get(
  "/content/:id",
  authMiddleware(),
  commentController.getAllCommentsByContentId
);

router.post(
  "/",
  authMiddleware(),
  validateRequest(CommentValidation.createCommentSchema),
  commentController.createComment
);
router.post(
  "/replay/:id",
  authMiddleware(),
  validateRequest(CommentValidation.replayCommentSchema),
  commentController.replayComment
);
router.patch(
  "/:id",
  authMiddleware(),
  validateRequest(CommentValidation.replayCommentSchema),
  commentController.updateComment
);
router.delete("/:id", authMiddleware(), commentController.deleteComment);

export default router;
