import { Request, Response, NextFunction } from "express";

import { errorResponse } from "../models/responseModel";

/**
 * Global error-handling middleware. Sends a consistent JSON error shape.
 */
const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const message: string = err instanceof Error ? err.message : "Internal server error";
    const code: string = "INTERNAL_ERROR";
    res.status(500).json(errorResponse(message, code));
};

export default errorHandler;
