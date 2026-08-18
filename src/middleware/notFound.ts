import { Request, Response } from "express";

function notFoundHandler(req: Request, res: Response,) {
    res.status(404).json({
        success: false,
        message: "Route not found",
        error: {
            path: req.originalUrl,
            date: new Date()
        }
    })
}

export default notFoundHandler