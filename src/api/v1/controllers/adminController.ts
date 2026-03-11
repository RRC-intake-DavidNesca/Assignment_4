import { NextFunction, Request, Response } from "express";

import { auth } from "../../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse, successResponse } from "../models/responseModel";

/**
 * Roles supported by the Assignment 4 demo flow.
 */
type AssignableRole = "officer" | "manager" | "admin";

interface SetCustomClaimsBody {
    uid: string;
    role: AssignableRole | undefined;
}

const VALID_ROLES: AssignableRole[] = ["officer", "manager", "admin"];

/**
 * Handles setting custom claims for a Firebase user.
 *
 * @param req - The request object containing uid and role.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns Sends a success response when claims are updated.
 */
export const setCustomClaims = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { uid, role } = req.body as SetCustomClaimsBody;

    if (!uid || !role) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse("uid and role are required", "BAD_REQUEST")
        );
        return;
    }

    if (!VALID_ROLES.includes(role)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse(
                "role must be officer, manager, or admin",
                "BAD_REQUEST"
            )
        );
        return;
    }

    try {
        await auth.setCustomUserClaims(uid, { role });

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                {},
                `Custom claims set for user: ${uid}. User must obtain a new token for changes to take effect.`
            )
        );
    } catch (error: unknown) {
        next(error);
    }
};

