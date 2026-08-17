import { Commnet, CommnetStatus } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createComment = async (payload: Omit<Commnet, "id" | "createdAt" | "updatedAt" | "status">) => {

    await prisma.post.findFirstOrThrow({
        where: {
            id: payload.post_id
        }
    })

    if (payload.parent_id) {
        await prisma.commnet.findFirstOrThrow({
            where: {
                id: payload.parent_id
            }
        })
    }


    const result = await prisma.commnet.create({
        data: payload
    })

    return result

}

const getCommentsById = async (commentId: string) => {

    const result = await prisma.commnet.findUnique({
        where: {
            id: commentId
        },
        include: {
            replies: {
                include: {
                    replies: true
                }
            },
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })

    return result
}


const getCommentsByAuthor = async (authorId: string) => {
    const result = await prisma.commnet.findMany({
        where: {
            author_id: authorId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,

                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return result
}

const deleteComment = async (commentId: string, authorId: string) => {
    const comment = await prisma.commnet.findUnique({
        where: {
            id: commentId
        }
    })

    if (!comment) {
        throw new Error("Comment not found")
    }

    if (comment.author_id !== authorId) {
        throw new Error("You are not authorized to delete this comment")
    }

    const result = await prisma.commnet.delete({
        where: {
            id: commentId
        }
    })

    return result
}

const updateComment = async (commentId: string, payload: {
    content: string
}, authorId: string) => {


    const comment = await prisma.commnet.findUniqueOrThrow({
        where: {
            id: commentId
        }
    })

    if (comment.author_id !== authorId) {
        throw new Error("You are not authorized to update this comment")
    }

    const result = await prisma.commnet.update({
        where: {
            id: commentId
        },
        data: payload
    })

    return result
}


const modrateComment = async (commentId: string, status: CommnetStatus) => {
    const comment = await prisma.commnet.findUniqueOrThrow({
        where: {
            id: commentId
        }
    })

    if (comment.status === status) {
        throw new Error("Comment is already in the same status")
    }

    const result = await prisma.commnet.update({
        where: {
            id: commentId
        },
        data: {
            status: status
        }
    })
    return result
}

export const commentService = {
    createComment,
    getCommentsById,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    modrateComment
}