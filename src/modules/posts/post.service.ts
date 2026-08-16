
import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const cratePost = async (payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author_id'>, userId: string) => {
    const result = await prisma.post.create({
        data: { ...payload, author_id: userId }
    })
    return result
}

const getAllPost = async (payload: { search: string | undefined, tags: string[] | [], isFeatured: boolean | undefined, status: PostStatus | undefined, authorId: string | undefined }) => {
    const { search, tags, isFeatured, status, authorId } = payload;


    const andFilter: PostWhereInput[] = []

    if (search) {
        andFilter.push({
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { tags: { has: search } }
            ]
        })
    }

    if (tags.length > 0) {
        andFilter.push({ tags: { hasEvery: tags } })
    }

    if (isFeatured) {
        andFilter.push({ isFeatured: isFeatured })
    }

    if (status) {
        andFilter.push({ status: status })
    }

    if (authorId) {
        andFilter.push({ author_id: authorId })
    }


    const result = await prisma.post.findMany({
        where: {
            AND: andFilter
        },
    })

    return result
}

export const PostService = {
    cratePost,
    getAllPost
}