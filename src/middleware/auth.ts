
import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";


export enum USER_ROLE {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER"
}


export const authMiddleware = (...roles: USER_ROLE[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers as any
            })

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            if (session.user.status === 'INACTIVE') {
                return res.status(403).json({
                    success: false,
                    message: 'Your account is inactive. Please contact admin for more information.'
                })
            }

            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: 'Your email not verified. Please verify your email address.'
                })
            }

            if (roles.length > 0) {
                if (!roles.includes(session.user.role as USER_ROLE)) {
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden'
                    })
                }
            }
            req.session = session
            req.user = session.user
            next()

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            })

        }
    }

}