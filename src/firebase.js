import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_adminApiKey,
    authDomain: import.meta.env.VITE_FIREBASE_adminAuthDomain,
    projectId: import.meta.env.VITE_FIREBASE_adminProjectId,
    storageBucket: import.meta.env.VITE_FIREBASE_adminStorageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_adminMessagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_adminAppId,
    measurementId: import.meta.env.VITE_FIREBASE_adminMeasurementId,
    databaseURL: import.meta.env.VITE_FIREBASE_adminDatabaseURL
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

setPersistence(auth, browserSessionPersistence);

export { auth, database };
