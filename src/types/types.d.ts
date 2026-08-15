declare global {
    namespace Express {
        interface Request {
            session?: any
            user?: any
        }
    }
}

export {};