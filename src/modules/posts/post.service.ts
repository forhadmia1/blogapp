
import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const cratePost = async (payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author_id'>, userId: string) => {
    const result = await prisma.post.create({
        data: { ...payload, author_id: userId }
    })
    return result
}

const getAllPost = async () => {
    const result = await prisma.post.findMany()
    return result
}

export const PostService = {
    cratePost,
    getAllPost
}