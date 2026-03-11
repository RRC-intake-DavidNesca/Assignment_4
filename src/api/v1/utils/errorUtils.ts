/**
 * Extracts a readable message from an unknown error value.
 *
 * @param error - The unknown error value.
 * @returns A readable error message string.
 */
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
};

/**
 * Extracts an error code from an unknown error value.
 *
 * @param error - The unknown error value.
 * @returns A programmatic error code string.
 */
export const getErrorCode = (error: unknown): string => {
    if (error instanceof Error) {
        const firebaseError: { code?: string } = error as { code?: string };

        return firebaseError.code ?? "UNKNOWN_ERROR";
    }

    return "UNKNOWN_ERROR";
};

