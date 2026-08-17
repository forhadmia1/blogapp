
import { CommnetStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const cratePost = async (payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'author_id'>, userId: string) => {
    const result = await prisma.post.create({
        data: { ...payload, author_id: userId }
    })
    return result
}

const getAllPost = async (payload: { search: string | undefined, tags: string[] | [], page: number, isFeatured: boolean | undefined, status: PostStatus | undefined, authorId: string | undefined, skip: number, limit: number, sortBy: string, orderBy: string }) => {
    const { search, tags, isFeatured, status, authorId, skip, limit, sortBy, orderBy, page } = payload;


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
        include: {
            _count: {
                select: {
                    commnets: true
                }
            }
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: orderBy
        }
    })

    const total = await prisma.post.count({
        where: {
            AND: andFilter
        }
    })

    return { data: result, pagination: { total, page, limit, totalPage: Math.ceil(total / limit) } }
}

const getPostById = async (id: string) => {
    const result = await prisma.$transaction(async (transaction) => {
        const post = await transaction.post.findUnique({
            where: { id },
            include: {
                commnets: {
                    where: {
                        parent_id: null,
                        status: CommnetStatus.Approved
                    },
                    orderBy: {
                        'createdAt': 'desc'
                    },
                    include: {
                        replies: {
                            where: {
                                status: CommnetStatus.Approved
                            },

                            include: {
                                replies: {
                                    where: {
                                        status: CommnetStatus.Approved
                                    },

                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        commnets: {
                            where: {
                                status: CommnetStatus.Approved
                            }
                        }
                    }
                }
            }
        })

        if (!post) {
            return null
        }

        await transaction.post.update({
            where: { id },
            data: { views: { increment: 1 } }
        })
        return post
    })
    return result
}

export const PostService = {
    cratePost,
    getAllPost,
    getPostById
}