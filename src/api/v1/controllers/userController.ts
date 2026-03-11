import { NextFunction, Request, Response } from "express";
import { UserRecord } from "firebase-admin/auth";

import { auth } from "../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse, successResponse } from "../models/responseModel";

/**
 * Retrieves details for the currently authenticated Firebase user.
 *
 * @param _req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The next middleware function.
 * @returns Sends the current user's details.
 */
export const getUserDetails = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const uid: string | undefined = res.locals.uid as string | undefined;

    if (!uid) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json(
            errorResponse("Unauthorized", "UNAUTHORIZED")
        );
        return;
    }

    try {
        const user: UserRecord = await auth.getUser(uid);

        res.status(HTTP_STATUS.OK).json(successResponse(user));
    } catch (error: unknown) {
        next(error);
    }
};

