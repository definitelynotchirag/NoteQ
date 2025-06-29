import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

import liveblocks from "@/lib/liveblocks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { sessionClaims } = await auth();

        // If no session claims, return unauthorized
        if (!sessionClaims) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { room } = await req.json();

        const session = liveblocks.prepareSession(sessionClaims?.email ?? "", {
            userInfo: {
                name: sessionClaims?.fullName ?? "",
                email: sessionClaims?.email ?? "",
                avatar: sessionClaims?.image ?? "",
            },
        });

        const usersInRoom = await adminDb.collectionGroup("rooms").where("userId", "==", sessionClaims?.email).get();

        const userInRoom = usersInRoom.docs.find(doc => doc.id === room);

        if (userInRoom?.exists) {
            session.allow(room, session.FULL_ACCESS);
            const { body, status } = await session.authorize();
            return new Response(body, { status });
        } else {
            return NextResponse.json({ message: "You are not in this room" }, { status: 403 });
        }
    } catch (error) {
        console.error("Auth endpoint error:", error);
        if (error.message?.includes("NEXT_REDIRECT")) {
            // Handle redirect gracefully
            return NextResponse.json({ message: "Authentication required" }, { status: 401 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
