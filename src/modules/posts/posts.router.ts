import express, { Router } from "express";
import { postController } from "./posts.controller";
import { USER_ROLE, authMiddleware } from "../../middleware/auth";

const router: Router = express.Router();

router.post('/', authMiddleware(USER_ROLE.USER), postController.cratePost)

router.get('/', postController.getAllPost)



export const PostRouter: Router = router;