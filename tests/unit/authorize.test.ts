import { Request, Response } from "express";
import { NextFunction } from "express";

import { authorize } from "../../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../../src/api/v1/errors/errors";

type Middleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

describe("authorize middleware", (): void => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach((): void => {
        mockRequest = {};
        mockResponse = {
            locals: {}
        };
        nextFunction = jest.fn();
    });

    it("should call next when the user has an allowed role", (): void => {
        mockResponse.locals = {
            uid: "u1",
            role: "admin"
        };
        const middleware: Middleware = authorize([
            "officer",
            "manager",
            "admin"
        ]);

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should call next with AuthorizationError when the role is missing", (): void => {
        mockResponse.locals = {
            uid: "u1"
        };
        const middleware: Middleware = authorize(["admin"]);

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthorizationError)
        );
        const error: AuthorizationError = nextFunction.mock.calls[0][0];
        expect(error.message).toBe("Forbidden: No role found in token");
        expect(error.code).toBe("ROLE_NOT_FOUND");
        expect(error.statusCode).toBe(403);
    });

    it("should call next with AuthorizationError when the role is not allowed", (): void => {
        mockResponse.locals = {
            uid: "u1",
            role: "officer"
        };
        const middleware: Middleware = authorize(["admin"]);

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthorizationError)
        );
        const error: AuthorizationError = nextFunction.mock.calls[0][0];
        expect(error.message).toBe("Forbidden: Insufficient role");
        expect(error.code).toBe("INSUFFICIENT_ROLE");
        expect(error.statusCode).toBe(403);
    });
});
