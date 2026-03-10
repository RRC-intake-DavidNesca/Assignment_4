/**
 * Allowed loan statuses used in the attached Assignment 4 screenshots.
 */
export type LoanStatus = "pending" | "under_review" | "flagged";

/**
 * Represents a loan application in the system.
 */
export interface Loan {
    id: number;
    applicant: string;
    amount: number;
    status: LoanStatus;
    createdAt: string;
}

/**
 * Represents the allowed input for creating a loan application.
 */
export type CreateLoanInput = Pick<Loan, "applicant" | "amount">;

/**
 * Represents the allowed input for updating a loan application.
 */
export type UpdateLoanInput = Pick<Loan, "status">;
