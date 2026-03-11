/**
 * HTTP status codes used across the API.
 */
export const HTTP_STATUS: {
    OK: number;
    CREATED: number;
    BAD_REQUEST: number;
    NOT_FOUND: number;
} = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
} as const;
