import { CreateLoanInput, Loan, UpdateLoanInput } from "../models/loanModel";

/**
 * In-memory loan application data for the Phase 4 baseline.
 * Firestore integration is added in Phase 5.
 */
const loans: Loan[] = [
    {
        id: 1,
        applicant: "John Smith",
        amount: 50000,
        status: "pending",
        createdAt: "2025-01-10T10:00:00.000Z"
    },
    {
        id: 3,
        applicant: "Michael Chen",
        amount: 500000,
        status: "pending",
        createdAt: "2025-01-05T10:00:00.000Z"
    },
    {
        id: 4,
        applicant: "Emily Williams",
        amount: 1000000,
        status: "flagged",
        createdAt: "2025-01-03T10:00:00.000Z"
    },
    {
        id: 5,
        applicant: "Test User",
        amount: 75000,
        status: "pending",
        createdAt: "2025-12-19T20:09:30.211Z"
    }
];

let nextLoanId: number = 6;

/**
 * Retrieves all loan applications.
 *
 * @returns Array of all loan applications.
 */
export const getAllLoans = async (): Promise<Loan[]> => {
    const clonedLoans: Loan[] = structuredClone(loans);
    return clonedLoans;
};

/**
 * Retrieves a loan application by its ID.
 *
 * @param id - The loan ID.
 * @returns The matching loan application, or undefined when not found.
 */
export const getLoanById = async (id: number): Promise<Loan | undefined> => {
    const loan: Loan | undefined = loans.find(
        (existingLoan: Loan): boolean => existingLoan.id === id
    );

    if (!loan) {
        return undefined;
    }

    const clonedLoan: Loan = structuredClone(loan);
    return clonedLoan;
};

/**
 * Creates a new loan application.
 *
 * @param loanData - The input required to create a loan.
 * @returns The newly created loan application.
 */
export const createLoan = async (
    loanData: CreateLoanInput
): Promise<Loan> => {
    const newLoan: Loan = {
        id: nextLoanId,
        applicant: loanData.applicant,
        amount: loanData.amount,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    loans.push(newLoan);
    nextLoanId += 1;

    const clonedLoan: Loan = structuredClone(newLoan);
    return clonedLoan;
};

/**
 * Updates an existing loan application.
 *
 * @param id - The ID of the loan to update.
 * @param loanData - The fields allowed to be updated.
 * @returns The updated loan application, or undefined when not found.
 */
export const updateLoan = async (
    id: number,
    loanData: UpdateLoanInput
): Promise<Loan | undefined> => {
    const index: number = loans.findIndex(
        (existingLoan: Loan): boolean => existingLoan.id === id
    );

    if (index === -1) {
        return undefined;
    }

    loans[index] = {
        ...loans[index],
        ...loanData
    };

    const clonedLoan: Loan = structuredClone(loans[index]);
    return clonedLoan;
};

/**
 * Deletes an existing loan application.
 *
 * @param id - The ID of the loan to delete.
 * @returns The deleted loan application, or undefined when not found.
 */
export const deleteLoan = async (
    id: number
): Promise<Loan | undefined> => {
    const index: number = loans.findIndex(
        (existingLoan: Loan): boolean => existingLoan.id === id
    );

    if (index === -1) {
        return undefined;
    }

    const [deletedLoan]: Loan[] = loans.splice(index, 1);
    const clonedLoan: Loan = structuredClone(deletedLoan);

    return clonedLoan;
};
