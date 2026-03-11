import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

import { auth } from "../../../config/firebaseConfig";
import { AuthenticationError } from "../errors/errors";

/**
 * Verifies a Firebase ID token and stores uid and role in res.locals.
 */
const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader: string | undefined = req.headers.authorization;
    const token: string | undefined = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;

    if (!token) {
        next(
            new AuthenticationError(
                "Unauthorized: No token provided",
                "TOKEN_NOT_FOUND"
            )
        );
        return;
    }

    try {
        const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);
        res.locals.uid = decodedToken.uid;
        res.locals.role = (
            decodedToken as DecodedIdToken & { role?: string }
        ).role;
        next();
    } catch {
        next(
            new AuthenticationError(
                "Unauthorized: Invalid token",
                "TOKEN_INVALID"
            )
        );
    }
};

export default authenticate;
