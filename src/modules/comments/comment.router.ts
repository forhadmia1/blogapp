import express, { Router } from "express";
import { commentController } from "./comment.controller";
import { authMiddleware, USER_ROLE } from "../../middleware/auth";

const router: Router = express.Router();


router.get('/:commentId', commentController.getCommentsById)

router.get('/author/:authorId', commentController.getCommentsByAuthorId)

router.post('/', authMiddleware(USER_ROLE.USER), commentController.createComment)

router.delete('/:commentId', authMiddleware(USER_ROLE.USER, USER_ROLE.ADMIN), commentController.deleteCommnet)

router.patch('/:commentId', authMiddleware(USER_ROLE.USER), commentController.updateComment)

router.patch('/:commentId/moderate', authMiddleware(USER_ROLE.ADMIN), commentController.modrateComment)

export const commentRouter: Router = router;