import { NextFunction, Request, Response } from "express";

import { AuthorizationError } from "../errors/errors";

/**
 * Roles supported by the Assignment 4 demo flow.
 */
export type AllowedRole = "officer" | "manager" | "admin";

/**
 * Restricts access to the roles supplied for a route.
 *
 * @param allowed - The roles allowed to access the route.
 * @returns Express middleware for role-based authorization.
 */
export const authorize = (allowed: readonly AllowedRole[]) => {
    return (
        _req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const role: string | undefined = res.locals.role as string | undefined;

        if (!role) {
            next(
                new AuthorizationError(
                    "Forbidden: No role found in token",
                    "ROLE_NOT_FOUND"
                )
            );
            return;
        }

        if (!allowed.includes(role as AllowedRole)) {
            next(
                new AuthorizationError(
                    "Forbidden: Insufficient role",
                    "INSUFFICIENT_ROLE"
                )
            );
            return;
        }

        next();
    };
};

