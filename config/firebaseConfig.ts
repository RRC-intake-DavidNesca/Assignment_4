import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

import * as serviceAccount from "./firebase-service-account.json";

/**
 * Initializes the Firebase Admin SDK using the project service account.
 */
initializeApp({
    credential: cert(serviceAccount as ServiceAccount)
});

/**
 * Firestore database instance for repository access.
 */
const db: Firestore = getFirestore();

/**
 * Firebase Authentication admin instance.
 */
const auth: Auth = getAuth();

export { db, auth };
