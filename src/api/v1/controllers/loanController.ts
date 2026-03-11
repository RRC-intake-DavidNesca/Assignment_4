import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";
import {
    CreateLoanInput,
    Loan,
    LoanStatus,
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
        const id: number = Number(req.params.id);
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
 * @returns Sends the created loan response or a bad request error response.
 */
export const createLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            applicant,
            amount
        }: {
            applicant: string | undefined;
            amount: number | undefined;
        } = req.body;

        if (!applicant || amount === undefined) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse(
                    "Applicant and amount are required",
                    "INVALID_LOAN_INPUT"
                )
            );
            return;
        }

        const loanData: CreateLoanInput = {
            applicant: applicant,
            amount: amount
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
 * @returns Sends the updated loan response, a bad request response, or a not found response.
 */
export const updateLoan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: number = Number(req.params.id);
        const {
            status
        }: {
            status: LoanStatus | undefined;
        } = req.body;

        if (!status) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse(
                    "Loan status is required",
                    "INVALID_LOAN_UPDATE"
                )
            );
            return;
        }

        const updateData: UpdateLoanInput = {
            status: status
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
        const id: number = Number(req.params.id);
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
