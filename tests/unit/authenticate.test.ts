import { Request, Response } from "express";

import authenticate from "../../src/api/v1/middleware/authenticate";
import { AuthenticationError } from "../../src/api/v1/errors/errors";

jest.mock("../../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn()
    }
}));

import { auth } from "../../src/config/firebaseConfig";

const mockedAuth: { verifyIdToken: jest.Mock } = auth as unknown as {
    verifyIdToken: jest.Mock;
};

describe("authenticate middleware", (): void => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach((): void => {
        mockRequest = { headers: {} };
        mockResponse = { locals: {} };
        nextFunction = jest.fn();
        mockedAuth.verifyIdToken.mockReset();
    });

    it("should call next with AuthenticationError when no token is provided", async (): Promise<void> => {
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );
        const err: AuthenticationError = nextFunction.mock.calls[0][0];
        expect(err.message).toBe("Unauthorized: No token provided");
        expect(err.code).toBe("TOKEN_NOT_FOUND");
        expect(err.statusCode).toBe(401);
    });

    it("should call next with AuthenticationError when authorization header has no Bearer prefix", async (): Promise<void> => {
        mockRequest.headers = { authorization: "InvalidFormat" };

        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );
        const err: AuthenticationError = nextFunction.mock.calls[0][0];
        expect(err.message).toBe("Unauthorized: No token provided");
        expect(err.code).toBe("TOKEN_NOT_FOUND");
    });

    it("should call next with AuthenticationError when token verification fails", async (): Promise<void> => {
        mockRequest.headers = { authorization: "Bearer bad-token" };
        mockedAuth.verifyIdToken.mockRejectedValueOnce(new Error("Invalid token"));

        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );
        const err: AuthenticationError = nextFunction.mock.calls[0][0];
        expect(err.message).toBe("Unauthorized: Invalid token");
        expect(err.code).toBe("TOKEN_INVALID");
        expect(err.statusCode).toBe(401);
    });

    it("should set res.locals and call next() when token is valid", async (): Promise<void> => {
        mockRequest.headers = { authorization: "Bearer valid-token" };
        mockedAuth.verifyIdToken.mockResolvedValueOnce({
            uid: "user-123",
            email: "officer@pixell-river.com",
            role: "officer"
        });

        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockedAuth.verifyIdToken).toHaveBeenCalledWith("valid-token");
        expect(mockResponse.locals).toEqual({
            uid: "user-123",
            role: "officer"
        });
        expect(nextFunction).toHaveBeenCalledWith();
    });
});

