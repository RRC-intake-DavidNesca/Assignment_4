import { Request, Response, NextFunction } from "express";

/**
 * Represents a standard Express middleware function.
 */
export type MiddlewareFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

