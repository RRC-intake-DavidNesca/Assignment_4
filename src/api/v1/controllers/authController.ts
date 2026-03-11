import { Request, Response } from "express";

import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";

const FIREBASE_SIGN_IN_URL: string =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";

interface SignInBody {
    email: string;
    password: string;
}

interface FirebaseSignInResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

interface FirebaseErrorResponse {
    error?: {
        message: string;
    };
}

/**
 * Signs in a Firebase user through the Firebase Authentication REST API and returns
 * the token payload needed for Bruno or Postman testing.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @returns Sends the Firebase token payload or an error response.
 */
export const signIn = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as SignInBody;
    const apiKey: string | undefined = process.env.FIREBASE_WEB_API_KEY;

    if (!email || !password) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse("email and password are required", "BAD_REQUEST")
        );
        return;
    }

    if (!apiKey) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse(
                "Firebase Web API key not configured",
                "CONFIG_ERROR"
            )
        );
        return;
    }

    const url: string = `${FIREBASE_SIGN_IN_URL}?key=${apiKey}`;
    const requestBody: string = JSON.stringify({
        email,
        password,
        returnSecureToken: true
    });

    try {
        const fetchResponse: Awaited<ReturnType<typeof fetch>> = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: requestBody
            }
        );

        const data: FirebaseSignInResponse | FirebaseErrorResponse =
            (await fetchResponse.json()) as FirebaseSignInResponse &
                FirebaseErrorResponse;

        if (!fetchResponse.ok) {
            const message: string =
                (data as FirebaseErrorResponse).error?.message ??
                "Invalid email or password";
            res.status(HTTP_STATUS.UNAUTHORIZED).json(
                errorResponse(message, "INVALID_CREDENTIALS")
            );
            return;
        }

        const payload: FirebaseSignInResponse = data as FirebaseSignInResponse;
        res.status(HTTP_STATUS.OK).json({
            idToken: payload.idToken,
            email: payload.email,
            localId: payload.localId,
            expiresIn: payload.expiresIn,
            refreshToken: payload.refreshToken
        });
    } catch {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse("Failed to sign in", "INTERNAL_SERVER_ERROR")
        );
    }
};
