"use client";

import { db } from "@/firebase";
import { useFirebaseAuth } from "@/lib/useFirebaseAuth";
import useOwner from "@/lib/useOwner";
import { useUser } from "@clerk/nextjs";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { toast } from "sonner";
import Avatars from "./Avatars";
import DeleteDocument from "./DeleteDocument";
import Editor from "./Editor";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Document = ({ id }: { id: string }) => {
    const { user, isLoaded: isClerkLoaded } = useUser();
    const { isLoading: isFirebaseAuthLoading, error: firebaseAuthError } = useFirebaseAuth();
    const router = useRouter();
    const [data, loading, error] = useDocumentData(user && !isFirebaseAuthLoading ? doc(db, "documents", id) : null, {
        onError: error => {
            console.error("Firestore document error:", error);
            if (error.message.includes("Missing or insufficient permissions")) {
                toast.error("You don't have permission to access this document");
                router.push("/");
            }
        },
    });
    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();
    const isOwner = useOwner();

    useEffect(() => {
        if (!isClerkLoaded) return;
        if (!user) {
            router.push("/");
            return;
        }
    }, [isClerkLoaded, user, router]);

    useEffect(() => {
        if (firebaseAuthError) {
            toast.error("Authentication error. Please try again.");
            router.push("/");
        }
    }, [firebaseAuthError, router]);

    useEffect(() => {
        try {
            if (data) {
                setInput(data.title);
            }
        } catch (error) {
            console.error("Error setting document title:", error);
            toast.error("Error loading document title");
        }
    }, [data]);

    const updateTitle = async (e: FormEvent) => {
        e.preventDefault();

        if (!isOwner) {
            toast.error("Only document owners can update the title");
            return;
        }

        if (input.trim()) {
            try {
                startTransition(async () => {
                    await updateDoc(doc(db, "documents", id), {
                        title: input,
                    });
                    toast.success("Title updated successfully");
                });
            } catch (error) {
                console.error("Error updating document title:", error);
                toast.error("Failed to update document title");
            }
        }
    };

    if (!isClerkLoaded || loading || isFirebaseAuthLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (error || firebaseAuthError) {
        return <div className="flex items-center justify-center h-screen">Error loading document</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex-1 h-full bg-inherit p-5">
            <div className="flex max-w-6xl mx-auto justify-between pb-5">
                <form className="md:flex md:flex-1 w-full md:space-x-2" onSubmit={updateTitle}>
                    <Input
                        value={input}
                        className="border-0 w-full bg-slate-600 shadow-xl shadow-slate-800"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    />

                    <div className="flex justify-between items-center md:space-x-2 my-3 md:my-0">
                        <div className="hidden md:flex">|</div>
                        <Button
                            disabled={isUpdating || !isOwner}
                            className="bg-slate-700 shadow-xl shadow-slate-800"
                            type="submit"
                        >
                            {isUpdating ? "Updating..." : "Update"}
                        </Button>
                        <div>|</div>

                        {isOwner && (
                            <>
                                <InviteUser />
                                <div>|</div>
                                <DeleteDocument />
                            </>
                        )}
                    </div>
                </form>
            </div>

            <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
                <ManageUsers />
                <Avatars />
            </div>

            <hr className="pb-10" />

            <Editor />
        </div>
    );
};
export default Document;
