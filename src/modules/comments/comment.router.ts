import express, { Router } from "express";
import { commentController } from "./comment.controller";
import { authMiddleware, USER_ROLE } from "../../middleware/auth";

const router: Router = express.Router();

router.post('/', authMiddleware(USER_ROLE.USER), commentController.createComment)

router.get('/:commentId', commentController.getCommentsById)

router.get('/author/:authorId', commentController.getCommentsByAuthorId)


router.delete('/:commentId', authMiddleware(USER_ROLE.USER, USER_ROLE.ADMIN), commentController.deleteCommnet)




export const commentRouter: Router = router;