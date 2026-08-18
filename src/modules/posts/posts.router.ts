import express, { Router } from "express";
import { postController } from "./posts.controller";
import { USER_ROLE, authMiddleware } from "../../middleware/auth";

const router: Router = express.Router();

router.get('/', postController.getAllPost)

router.get('/my-posts', authMiddleware(USER_ROLE.USER), postController.getAuthorPost)

router.get('/stats', authMiddleware(USER_ROLE.ADMIN), postController.getStats)

router.get('/:id', postController.getPostById)

router.post('/', authMiddleware(USER_ROLE.USER), postController.cratePost)

router.patch('/:id', authMiddleware(USER_ROLE.USER), postController.updateOwnPost)

router.delete('/:id', authMiddleware(USER_ROLE.USER, USER_ROLE.ADMIN), postController.deletePost)

export const PostRouter: Router = router;