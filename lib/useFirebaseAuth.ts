import { app } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useEffect, useState } from "react";

export function useFirebaseAuth() {
    const { user, isLoaded: isClerkLoaded } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!isClerkLoaded) return;

        const setupFirebaseAuth = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (!user) {
                    setIsLoading(false);
                    return;
                }

                // Get the Firebase custom token from your backend
                const response = await fetch("/api/get-firebase-token", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // Use the correct Clerk token method
                        Authorization: `Bearer ${await user.sessionId}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to get Firebase token: ${response.statusText}`);
                }

                const { firebaseToken } = await response.json();

                if (!firebaseToken) {
                    throw new Error("No Firebase token received from server");
                }

                const auth = getAuth(app);

                // Sign in to Firebase with the custom token
                await signInWithCustomToken(auth, firebaseToken);
            } catch (err) {
                console.error("Firebase authentication error:", err);
                setError(err instanceof Error ? err : new Error("Authentication failed"));
            } finally {
                setIsLoading(false);
            }
        };

        setupFirebaseAuth();
    }, [user, isClerkLoaded]);

    return { isLoading, error };
}
