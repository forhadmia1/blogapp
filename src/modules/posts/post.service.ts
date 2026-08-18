
import { CommnetStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { USER_ROLE } from "../../middleware/auth";

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


const getAuthorPost = async (payload: {
    page: number,
    limit: number,
    skip: number,
    orderBy: string,
    sortBy: string,
    search: string | undefined,
    tags: string[],
    isFeatured: boolean | undefined,
    status: PostStatus | undefined,
    authorId: string
}
) => {



    const { search, tags, isFeatured, page, limit, skip, sortBy, status, orderBy, authorId } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId
        },
        select: {
            status: true
        }
    })


    if (user.status === 'INACTIVE') {
        throw new Error("You are banned from creating posts")
    }

    const andFilter: PostWhereInput[] = []

    if (search) {
        andFilter.push({
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
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





    const result = await prisma.post.findMany({
        where: {
            author_id: authorId,
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
            author_id: authorId,
            AND: andFilter
        }
    })


    return { data: result, pagination: { total, page, limit, totalPage: Math.ceil(total / limit) } }
}


//update own post 

const updateOwnPost = async ({ payload, isAdmin, authorId, id }: { payload: Partial<Post>, isAdmin: boolean, authorId: string, id: string }) => {


    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id
        }
    })


    if (!isAdmin && post.author_id !== authorId) {
        throw new Error("You are not authorized to update this post")
    }

    if (!isAdmin) {
        delete payload.isFeatured;
    }

    delete payload.id;
    delete payload.author_id;
    delete payload.updatedAt;
    delete payload.createdAt;

    const result = await prisma.post.update({
        where: {
            id,
            author_id: authorId
        },
        data: payload
    })

    return result

}


const deletePost = async (id: string, authorId: string, isAdmin: boolean) => {

    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id
        }
    })


    if (!isAdmin && post.author_id !== authorId) {
        throw new Error("You are not authorized to delete this post")
    }

    const result = await prisma.post.delete({
        where: {
            id
        }
    })

    return result

}

const getStats = async () => {
    return await prisma.$transaction(async (transaction) => {

        const [totalPosts, totalDraft, totalPublished, totalArchived, totalComments, totalUsers, totalAdmin, approvedComment, totalViews] = await Promise.all([
            transaction.post.count(),
            transaction.post.count({
                where: {
                    status: PostStatus.Draft
                }
            }),
            transaction.post.count({
                where: {
                    status: PostStatus.Published
                }
            }),
            transaction.post.count({
                where: {
                    status: PostStatus.Archived
                }
            }),
            transaction.commnet.count(),
            transaction.user.count(
                {
                    where: {
                        role: USER_ROLE.USER
                    }
                }
            ),
            transaction.user.count({
                where: {
                    role: USER_ROLE.ADMIN
                }
            }),
            transaction.commnet.count({
                where: {
                    status: CommnetStatus.Approved
                }
            }),
            transaction.post.aggregate({
                _sum: {
                    views: true
                }
            })

        ]);



        return {
            totalPosts,
            totalDraft,
            totalPublished,
            totalArchived,
            totalComments,
            totalUsers,
            approvedComment,
            totalAdmin,
            totalViews
        }
    })
}



export const PostService = {
    cratePost,
    getAllPost,
    getPostById,
    getAuthorPost,
    updateOwnPost,
    deletePost,
    getStats
}