import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const authUser = req.user;
        const { post_id, content, parent_id } = req.body;
        const result = await commentService.createComment({
            post_id: post_id as string,
            content: content as string,
            author_id: authUser.id as string,
            parent_id: parent_id ?? null
        })

        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create comment",
            error: error
        })
    }
}



const getCommentsById = async (req: Request, res: Response) => {
    try {

        const commentId = req.params.commentId as string

        const result = await commentService.getCommentsById(commentId)

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch comments",
            error: error
        })
    }
}


const getCommentsByAuthorId = async (req: Request, res: Response) => {
    try {

        const authorId = req.params.authorId as string

        const result = await commentService.getCommentsByAuthor(authorId)

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch comments",
            error: error
        })
    }
}



const deleteCommnet = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.commentId as string
        const authUser = req.user
        const result = await commentService.deleteComment(commentId, authUser.id as string)
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete comment",
            error: error
        })
    }
}

export const commentController = {
    createComment,
    getCommentsById,
    getCommentsByAuthorId,
    deleteCommnet
}