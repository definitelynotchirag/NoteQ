// Import the functions you need from the SDKs you need
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
    clearIndexedDbPersistence,
    connectFirestoreEmulator,
    disableNetwork,
    enableIndexedDbPersistence,
    enableNetwork,
    Firestore,
    getFirestore,
    initializeFirestore,
    waitForPendingWrites,
} from "firebase/firestore";
import { toast } from "sonner";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firebaseApp: FirebaseApp | undefined;
let firestoreInstance: Firestore | undefined;

// Initialize Firebase app
function getFirebaseApp() {
    if (!firebaseApp) {
        if (!getApps().length) {
            firebaseApp = initializeApp(firebaseConfig);
        } else {
            firebaseApp = getApp();
        }
    }
    return firebaseApp;
}

// Initialize Firestore with settings
function getFirestoreInstance() {
    if (!firestoreInstance) {
        const app = getFirebaseApp();

        try {
            // First try to get an existing instance
            firestoreInstance = getFirestore(app);

            // If we get here, Firestore is already initialized
            console.log("Using existing Firestore instance");
        } catch (_) {
            // If getting existing instance fails, initialize with settings
            console.log("Initializing new Firestore instance with settings");
            firestoreInstance = initializeFirestore(app, {
                experimentalForceLongPolling: true,
                cacheSizeBytes: 100 * 1024 * 1024, // 100 MB cache size
            });

            // Only set up persistence and listeners on first initialization
            if (typeof window !== "undefined") {
                enableIndexedDbPersistence(firestoreInstance, {
                    forceOwnership: false,
                }).catch(err => {
                    if (err.code === "failed-precondition") {
                        toast.warning("Multiple tabs open. Offline mode limited to one tab.");
                        console.warn("Multiple tabs open, persistence limited to one tab:", err);
                    } else if (err.code === "unimplemented") {
                        toast.warning("Your browser doesn't support offline mode.");
                        console.warn("Browser doesn't support persistence:", err);
                    } else {
                        console.error("Error enabling persistence:", err);
                        toast.error("Failed to enable offline mode. Some features may be limited.");
                    }
                });

                // Setup network status listeners
                let isOnline = true;
                window.addEventListener("online", () => {
                    if (!isOnline && firestoreInstance) {
                        isOnline = true;
                        enableNetwork(firestoreInstance)
                            .then(() => {
                                toast.success("Back online! Syncing changes...");
                                return waitForPendingWrites(firestoreInstance!);
                            })
                            .then(() => {
                                toast.success("All changes synced successfully!");
                            })
                            .catch(err => {
                                console.error("Error reconnecting to Firestore:", err);
                                toast.error("Error reconnecting to Firestore. Please refresh the page.");
                            });
                    }
                });

                window.addEventListener("offline", () => {
                    if (firestoreInstance) {
                        isOnline = false;
                        disableNetwork(firestoreInstance)
                            .then(() => {
                                toast.warning("You are offline. Changes will sync when you're back online.");
                            })
                            .catch(err => {
                                console.error("Error handling offline state:", err);
                            });
                    }
                });
            }
        }

        // Connect to emulators in development
        if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
            connectFirestoreEmulator(firestoreInstance, "localhost", 8080);
        }
    }
    return firestoreInstance;
}

// Export the getter functions and instances
export const app = getFirebaseApp();
export const db = getFirestoreInstance();

// Utility function to clear cache if needed
export async function clearFirestoreCache() {
    const instance = getFirestoreInstance();
    try {
        await clearIndexedDbPersistence(instance);
        console.log("Firestore cache cleared successfully");
    } catch (error) {
        console.error("Error clearing Firestore cache:", error);
        throw error;
    }
}
