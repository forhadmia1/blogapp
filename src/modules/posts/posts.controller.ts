import { NextFunction, Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { PaginationSortingHelper } from "../../helpers/paginationSortingHelper";
import { USER_ROLE } from "../../middleware/auth";

const cratePost = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error)
    }
}

const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error)
    }
}

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const result = await PostService.getPostById(id as string)

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}


const getAuthorPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        const { search, tags, isFeatured, status } = req.query;

        const tagsArray = tags ? (tags as string)?.split(',') : []



        const {
            page, limit, skip, orderBy, sortBy
        } = PaginationSortingHelper(req.query)

        const result = await PostService.getAuthorPost({
            page,
            limit,
            skip,
            orderBy,
            sortBy,
            search: search as string | undefined,
            tags: tagsArray,
            isFeatured: isFeatured ? isFeatured === 'true' : undefined,
            status: status as PostStatus | undefined,
            authorId: user.id
        })
        res.status(200).json({
            success: true,
            message: 'Author posts fetched successfully',
            data: result
        })
    } catch (error) {
        next(error)
    }
}


const updateOwnPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        const { id } = req.params

        const isAdmin = user.role === USER_ROLE.ADMIN;

        const result = await PostService.updateOwnPost({
            payload: {
                ...req.body
            }, id: id as string, authorId: user.id, isAdmin
        })
        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const deletePost = async (req: Request, res: Response, next: NewableFunction) => {
    try {
        const user = req.user
        const { id } = req.params

        const isAdmin = user.role === USER_ROLE.ADMIN;

        const result = await PostService.deletePost(id as string, user.id, isAdmin)
        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
            data: result
        })
    } catch (error) {
        next(error)
    }
}



const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await PostService.getStats()
        res.status(200).json({
            success: true,
            message: 'Stats fetched successfully',
            data: result
        })
    } catch (error) {
        next(error)
    }
}


export const postController = {
    cratePost,
    getAllPost,
    getPostById,
    getAuthorPost,
    updateOwnPost,
    deletePost,
    getStats
}