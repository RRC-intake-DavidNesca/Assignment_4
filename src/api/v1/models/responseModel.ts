/**
 * Builds a standardized error response object.
 *
 * @param message - Human-readable error message.
 * @param code - Machine-readable error code.
 * @returns Error response shape with timestamp.
 */
export const errorResponse = (
    message: string,
    code: string
): { success: false; error: { message: string; code: string }; timestamp: string } => {
    return {
        success: false,
        error: { message, code },
        timestamp: new Date().toISOString(),
    };
};

/**
 * Builds a standardized success response object.
 *
 * @param data - Successful response payload.
 * @param message - Optional human-readable success message.
 * @returns Success response shape with timestamp.
 */
export const successResponse = <T>(
    data: T,
    message?: string
): { success: true; data: T; message?: string; timestamp: string } => {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    };
};
