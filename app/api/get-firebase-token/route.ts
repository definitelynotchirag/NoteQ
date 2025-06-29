import { adminApp } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { userId, sessionId, sessionClaims } = auth();

        if (!userId || !sessionId || !sessionClaims?.email) {
            return NextResponse.json({ error: "Unauthorized - Missing required authentication data" }, { status: 401 });
        }

        // Create a custom token with the user's email and additional claims
        const firebaseToken = await getAuth(adminApp).createCustomToken(sessionClaims.email as string, {
            email: sessionClaims.email as string,
            name: sessionClaims.fullName as string,
            userId: userId,
            // Add any additional claims you need
        });

        return NextResponse.json({ firebaseToken });
    } catch (error) {
        console.error("Error generating Firebase token:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
