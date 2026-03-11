import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Base application error with HTTP status and machine-readable code.
 */
export class AppError extends Error {
    public readonly statusCode: number;

    public readonly code: string;

    public constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Error type for repository-level failures.
 */
export class RepositoryError extends AppError {
    public constructor(message: string, code: string) {
        super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, code);
    }
}

/**
 * Error type for service-level failures.
 */
export class ServiceError extends AppError {
    public constructor(message: string, code: string) {
        super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, code);
    }
}

/**
 * Error type for authentication failures.
 */
export class AuthenticationError extends AppError {
    public constructor(message: string, code: string) {
        super(message, HTTP_STATUS.UNAUTHORIZED, code);
    }
}

/**
 * Error type for authorization failures.
 */
export class AuthorizationError extends AppError {
    public constructor(message: string, code: string) {
        super(message, HTTP_STATUS.FORBIDDEN, code);
    }
}

