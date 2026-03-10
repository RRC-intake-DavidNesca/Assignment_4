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
