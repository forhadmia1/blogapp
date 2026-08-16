import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { Post } from "../../../generated/prisma/client";
import { PaginationSortingHelper } from "../../helpers/paginationSortingHelper";

const cratePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden'
            })
        }

        const result = await PostService.cratePost(req.body, user.id)
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error
        })
    }
}

const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search, tags, isFeatured, status, authorId } = req.query;
        const tagsArray = tags ? (tags as string)?.split(',') : []


        const options = PaginationSortingHelper(req.query)


        const result = await PostService.getAllPost({
            search: search as string | undefined,
            tags: tagsArray,
            isFeatured: isFeatured ? isFeatured === 'true' : undefined,
            status: status as PostStatus | undefined,
            authorId: authorId as string | undefined,
            ...options
        })

        res.status(200).json({
            success: true,
            message: 'Posts fetched successfully',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
            error: error
        })
    }
}


export const postController = {
    cratePost,
    getAllPost
}