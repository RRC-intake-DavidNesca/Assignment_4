import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../../../constants/httpConstants";
import { AppError } from "../errors/errors";
import { errorResponse } from "../models/responseModel";
import { getErrorCode, getErrorMessage } from "../utils/errorUtils";

/**
 * Global error handling middleware for the Express application.
 *
 * @param err - The error object passed from previous middleware or route handlers.
 * @param _req - The Express request object.
 * @param res - The Express response object.
 * @param _next - The Express next function.
 * @returns Sends a standardized error response.
 */
const errorHandler = (
    err: Error | null,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (!err) {
        // Fallback in case an unexpected null or undefined error is passed.
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json(errorResponse(err.message, err.code));
    } else {
        const message: string = getErrorMessage(err);
        const code: string = getErrorCode(err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse(message, code)
        );
    }
};

export default errorHandler;
