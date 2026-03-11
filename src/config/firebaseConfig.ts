import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

import * as raw from "../../credentials.json";

const serviceAccount: ServiceAccount = JSON.parse(
    JSON.stringify(raw)
) as ServiceAccount;

initializeApp({
    credential: cert(serviceAccount),
});

const db: Firestore = getFirestore();
const auth: Auth = getAuth();

export { db, auth };

