import Joi from "joi";

/**
 * Loan operation schemas organized by request part.
 */
export const loanSchemas = {
    /**
     * POST /loans - Create new loan
     */
    create: {
        body: Joi.object({
            applicant: Joi.string().required().messages({
                "any.required": "Applicant is required",
                "string.empty": "Applicant cannot be empty"
            }),
            amount: Joi.number().required().messages({
                "any.required": "Amount is required"
            })
        })
    },

    /**
     * GET /loans/:id - Get single loan
     */
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Loan ID is required",
                "string.empty": "Loan ID cannot be empty"
            })
        })
    },

    /**
     * PUT /loans/:id - Update loan
     */
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Loan ID is required",
                "string.empty": "Loan ID cannot be empty"
            })
        }),
        body: Joi.object({
            status: Joi.string()
                .valid("pending", "under_review", "flagged")
                .required()
                .messages({
                    "any.required": "Loan status is required",
                    "string.empty": "Loan status cannot be empty"
                })
        })
    },

    /**
     * DELETE /loans/:id - Delete loan
     */
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Loan ID is required",
                "string.empty": "Loan ID cannot be empty"
            })
        })
    }
};

