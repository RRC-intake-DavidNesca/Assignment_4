import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

import { MiddlewareFunction } from "../types/expressTypes";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface RequestSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}

/**
 * Creates an Express middleware function that validates different parts of the request
 * against separate Joi schemas and strips unknown fields appropriately.
 *
 * @param schemas - Object containing separate schemas for body, params, and query.
 * @param options - Validation options for stripping behavior.
 * @returns Express middleware function that performs the validation.
 */
export const validateRequest = (
    schemas: RequestSchemas,
    options: ValidationOptions = {}
): MiddlewareFunction => {
    const defaultOptions: Required<ValidationOptions> = {
        stripBody: true,
        stripQuery: true,
        stripParams: false,
        ...options
    };

    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const errors: string[] = [];

            /**
             * Validates a specific part of the request against a Joi schema.
             *
             * @param schema - Joi schema to validate against.
             * @param data - Request data to validate.
             * @param partName - Name of the request part for error prefixing.
             * @param shouldStrip - Whether unknown fields should be stripped.
             * @returns The validated value or the original value.
             */
            const validatePart = (
                schema: ObjectSchema,
                data: unknown,
                partName: string,
                shouldStrip: boolean
            ): unknown => {
                const { error, value } = schema.validate(data, {
                    abortEarly: false,
                    stripUnknown: shouldStrip
                });

                if (error) {
                    errors.push(
                        ...error.details.map(
                            (detail): string => `${partName}: ${detail.message}`
                        )
                    );
                } else if (shouldStrip) {
                    return value;
                }

                return data;
            };

            if (schemas.body) {
                req.body = validatePart(
                    schemas.body,
                    req.body,
                    "Body",
                    defaultOptions.stripBody
                );
            }

            if (schemas.params) {
                req.params = validatePart(
                    schemas.params,
                    req.params,
                    "Params",
                    defaultOptions.stripParams
                ) as Request["params"];
            }

            if (schemas.query) {
                req.query = validatePart(
                    schemas.query,
                    req.query,
                    "Query",
                    defaultOptions.stripQuery
                ) as Request["query"];
            }

            if (errors.length > 0) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: `Validation error: ${errors.join(", ")}`
                });
                return;
            }

            next();
        } catch (error: unknown) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: (error as Error).message
            });
        }
    };
};

