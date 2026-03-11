import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";
import {
    CreateLoanInput,
    Loan,
    UpdateLoanInput
} from "../models/loanModel";
import * as loanService from "../services/loanService";

/**
 * Retrieves all loan applications.
 *
 * @param _req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The next middleware function.
 * @returns Sends the loan collection response.
 */
export const getAllLoans = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const loans: Loan[] = await loanService.getAllLoans();

        res.status(HTTP_STATUS.OK).json({
            message: "Loan applications retrieved",
            count: loans.length,
            data: loans
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Retrieves a single loan application by ID.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The next middleware function.
 * @returns Sends the loan response or a not found error response.
 */
export const getLoanById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;
        const loan: Loan | undefined = await loanService.getLoanById(id);

        if (!loan) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse("Loan application not found", "LOAN_NOT_FOUND")
            );
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Loan application retrieved",
            data: loan
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Creates a new loan application.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The next middleware function.
 * @returns Sends the created loan response.
 */
export const createLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const loanData: CreateLoanInput = {
            applicant: req.body.applicant as string,
            amount: req.body.amount as number
        };

        const newLoan: Loan = await loanService.createLoan(loanData);

        res.status(HTTP_STATUS.CREATED).json({
            message: "Loan application created",
            data: newLoan
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Updates an existing loan application.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The next middleware function.
 * @returns Sends the updated loan response or a not found response.
 */
export const updateLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const updateData: UpdateLoanInput = {
            status: req.body.status as UpdateLoanInput["status"]
        };

        const updatedLoan: Loan | undefined = await loanService.updateLoan(
            id,
            updateData
        );

        if (!updatedLoan) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse("Loan application not found", "LOAN_NOT_FOUND")
            );
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Loan application updated",
            data: updatedLoan
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Deletes an existing loan application.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The next middleware function.
 * @returns Sends the delete response or a not found error response.
 */
export const deleteLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;
        const deletedLoan: Loan | undefined = await loanService.deleteLoan(id);

        if (!deletedLoan) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse("Loan application not found", "LOAN_NOT_FOUND")
            );
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Loan application deleted"
        });
    } catch (error: unknown) {
        next(error);
    }
};
