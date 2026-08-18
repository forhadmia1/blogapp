import { NextFunction, Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error)
    }
}



const getCommentsById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const commentId = req.params.commentId as string

        const result = await commentService.getCommentsById(commentId)

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: result
        })

    } catch (error) {
        next(error)
    }
}


const getCommentsByAuthorId = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authorId = req.params.authorId as string

        const result = await commentService.getCommentsByAuthor(authorId)

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: result
        })

    } catch (error) {
        next(error)
    }
}



const deleteCommnet = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error)
    }
}

const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentId = req.params.commentId as string
        const authUser = req.user
        const { content, status } = req.body
        const result = await commentService.updateComment(commentId, { content }, authUser.id as string)
        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const modrateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentId = req.params.commentId as string
        const { status } = req.body
        const result = await commentService.modrateComment(commentId, status)
        res.status(200).json({
            success: true,
            message: "Comment moderated successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const commentController = {
    createComment,
    getCommentsById,
    getCommentsByAuthorId,
    deleteCommnet,
    updateComment,
    modrateComment
}