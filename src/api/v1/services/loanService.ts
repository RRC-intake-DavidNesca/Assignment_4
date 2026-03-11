import type { DocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";

import { CreateLoanInput, Loan, UpdateLoanInput } from "../models/loanModel";
import * as firestoreRepository from "../repositories/firestoreRepository";

/**
 * Firestore collection used for loan documents.
 * Replace YOUR_STUDENT_ID with the real student ID before taking screenshots.
 */
export const COLLECTION_NAME: string = "0436080_loans";

/**
 * Retrieves all loan applications from Firestore.
 *
 * @returns Array of all loan applications.
 */
export const getAllLoans = async (): Promise<Loan[]> => {
    try {
        const snapshot: QuerySnapshot =
            await firestoreRepository.getDocuments(COLLECTION_NAME);

        const loans: Loan[] = [];

        snapshot.forEach((loanDoc): void => {
            const data: Omit<Loan, "id"> = loanDoc.data() as Omit<Loan, "id">;

            loans.push({
                id: loanDoc.id,
                applicant: data.applicant,
                amount: data.amount,
                status: data.status,
                createdAt: data.createdAt
            });
        });

        return loans;
    } catch (error: unknown) {
        const errorMessage: string =
            error instanceof Error ? error.message : "Unknown error";

        throw new Error(`Failed to get loans: ${errorMessage}`);
    }
};

/**
 * Retrieves a single loan application by ID from Firestore.
 *
 * @param id - The loan ID.
 * @returns The matching loan application, or undefined when not found.
 */
export const getLoanById = async (
    id: string
): Promise<Loan | undefined> => {
    try {
        const loanDoc: DocumentSnapshot | null =
            await firestoreRepository.getDocumentById(COLLECTION_NAME, id);

        if (!loanDoc) {
            return undefined;
        }

        const data: Omit<Loan, "id"> = loanDoc.data() as Omit<Loan, "id">;

        return {
            id: loanDoc.id,
            applicant: data.applicant,
            amount: data.amount,
            status: data.status,
            createdAt: data.createdAt
        };
    } catch (error: unknown) {
        const errorMessage: string =
            error instanceof Error ? error.message : "Unknown error";

        throw new Error(`Failed to get loan ${id}: ${errorMessage}`);
    }
};

/**
 * Creates a new loan application in Firestore.
 *
 * @param loanData - The input required to create a loan.
 * @returns The newly created loan application.
 */
export const createLoan = async (
    loanData: CreateLoanInput
): Promise<Loan> => {
    try {
        const newLoanData: Omit<Loan, "id"> = {
            applicant: loanData.applicant,
            amount: loanData.amount,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        const id: string = await firestoreRepository.createDocument<
            Omit<Loan, "id">
        >(COLLECTION_NAME, newLoanData);

        return {
            id,
            ...newLoanData
        };
    } catch (error: unknown) {
        const errorMessage: string =
            error instanceof Error ? error.message : "Unknown error";

        throw new Error(`Failed to create loan: ${errorMessage}`);
    }
};

/**
 * Updates an existing loan application in Firestore.
 *
 * @param id - The ID of the loan to update.
 * @param loanData - The fields allowed to be updated.
 * @returns The updated loan application, or undefined when not found.
 */
export const updateLoan = async (
    id: string,
    loanData: UpdateLoanInput
): Promise<Loan | undefined> => {
    try {
        const existingLoanDoc: DocumentSnapshot | null =
            await firestoreRepository.getDocumentById(COLLECTION_NAME, id);

        if (!existingLoanDoc) {
            return undefined;
        }

        const existingLoanData: Omit<Loan, "id"> =
            existingLoanDoc.data() as Omit<Loan, "id">;

        await firestoreRepository.updateDocument<UpdateLoanInput>(
            COLLECTION_NAME,
            id,
            loanData
        );

        return {
            id,
            applicant: existingLoanData.applicant,
            amount: existingLoanData.amount,
            status: loanData.status,
            createdAt: existingLoanData.createdAt
        };
    } catch (error: unknown) {
        const errorMessage: string =
            error instanceof Error ? error.message : "Unknown error";

        throw new Error(`Failed to update loan ${id}: ${errorMessage}`);
    }
};

/**
 * Deletes an existing loan application from Firestore.
 *
 * @param id - The ID of the loan to delete.
 * @returns The deleted loan application, or undefined when not found.
 */
export const deleteLoan = async (
    id: string
): Promise<Loan | undefined> => {
    try {
        const existingLoanDoc: DocumentSnapshot | null =
            await firestoreRepository.getDocumentById(COLLECTION_NAME, id);

        if (!existingLoanDoc) {
            return undefined;
        }

        const existingLoanData: Omit<Loan, "id"> =
            existingLoanDoc.data() as Omit<Loan, "id">;

        await firestoreRepository.deleteDocument(COLLECTION_NAME, id);

        return {
            id,
            applicant: existingLoanData.applicant,
            amount: existingLoanData.amount,
            status: existingLoanData.status,
            createdAt: existingLoanData.createdAt
        };
    } catch (error: unknown) {
        const errorMessage: string =
            error instanceof Error ? error.message : "Unknown error";

        throw new Error(`Failed to delete loan ${id}: ${errorMessage}`);
    }
};
