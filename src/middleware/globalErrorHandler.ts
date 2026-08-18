import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    let statusCode: number = 500;
    let errorMessage: string = "Internal server error";
    let error = err;

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = 'You provide incorrect field or missing fields';
        error = err
    }

    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
            statusCode = 404;
            errorMessage = 'record not found!';
            error = err
        } else if (err.code === 'P2002') {
            statusCode = 409;
            errorMessage = 'This field must be unique!';
            error = err
        } else if (err.code === 'P2003') {
            statusCode = 404;
            errorMessage = 'Foregin key is missing!';
            error = err
        } else {
            statusCode = 404;
            errorMessage = 'record not found!';
            error = err
        }

    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = 'Something went wrong';
        error = err

    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        errorMessage = err.message;
        error = err
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === 'P1000') {
            statusCode = 401;
            errorMessage = "Authentication failed, Please check your credentials";
            error = err
        }
    } else {
        statusCode = 500;
        errorMessage = 'Something went wrong';
        error = err
    }

    return res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: error
    });
}

export default errorHandler;