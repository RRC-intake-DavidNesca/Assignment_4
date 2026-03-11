import type {
    DocumentReference,
    DocumentSnapshot,
    QuerySnapshot
} from "firebase-admin/firestore";

import { db } from "../../../config/firebaseConfig";

/**
 * Creates a new document in a specified Firestore collection.
 *
 * @param collectionName - The name of the collection.
 * @param data - The data for the new document.
 * @param id - Optional custom document ID.
 * @returns The ID of the newly created document.
 */
export const createDocument = async <T>(
    collectionName: string,
    data: Partial<T>,
    id?: string
): Promise<string> => {
    try {
        let docRef: DocumentReference;

        if (id) {
            docRef = db.collection(collectionName).doc(id);
            await docRef.set(data);
        } else {
            docRef = await db.collection(collectionName).add(data);
        }

        return docRef.id;
    } catch (error: unknown) {
        const errorMessage: string =
            error instanceof Error ? error.message : "Unknown error";

        throw new Error(
            `Failed to create document in ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Retrieves all documents from a specified Firestore collection.
 *
 * @param collectionName - The name of the collection.
 * @returns A QuerySnapshot containing all documents.
 */
export const getDocuments = async (
    collectionName: string
): Promise<QuerySnapshot> => {
    try {
        return await db.collection(collectionName).get();
    } catch (error: unknown) {
        const errorMessage: string =
            error instanceof Error ? error.message : "Unknown error";

        throw new Error(
            `Failed to fetch documents from ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Retrieves a document by its ID from a specified Firestore collection.
 *
 * @param collectionName - The name of the collection.
 * @param id - The ID of the document to retrieve.
 * @returns The document snapshot or null if it does not exist.
 */
export const getDocumentById = async (
    collectionName: string,
    id: string
): Promise<DocumentSnapshot | null> => {
    try {
        const doc: DocumentSnapshot = await db
            .collection(collectionName)
            .doc(id)
            .get();

        return doc.exists ? doc : null;
    } catch (error: unknown) {
        const errorMessage: string =
            error instanceof Error ? error.message : "Unknown error";

        throw new Error(
            `Failed to fetch document ${id} from ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Updates an existing document in a specified Firestore collection.
 *
 * @param collectionName - The name of the collection.
 * @param id - The ID of the document to update.
 * @param data - The updated document data.
 * @returns Promise that resolves when the update completes.
 */
export const updateDocument = async <T>(
    collectionName: string,
    id: string,
    data: Partial<T>
): Promise<void> => {
    try {
        await db.collection(collectionName).doc(id).update(data);
    } catch (error: unknown) {
        const errorMessage: string =
            error instanceof Error ? error.message : "Unknown error";

        throw new Error(
            `Failed to update document ${id} in ${collectionName}: ${errorMessage}`
        );
    }
};

/**
 * Deletes a document from a specified Firestore collection.
 *
 * @param collectionName - The name of the collection.
 * @param id - The ID of the document to delete.
 * @returns Promise that resolves when the delete completes.
 */
export const deleteDocument = async (
    collectionName: string,
    id: string
): Promise<void> => {
    try {
        const docRef: DocumentReference = db
            .collection(collectionName)
            .doc(id);

        await docRef.delete();
    } catch (error: unknown) {
        const errorMessage: string =
            error instanceof Error ? error.message : "Unknown error";

        throw new Error(
            `Failed to delete document ${id} from ${collectionName}: ${errorMessage}`
        );
    }
};
