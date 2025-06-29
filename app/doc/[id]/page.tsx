"use client";

import Document from "@/components/Document";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DocumentPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params);
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !user) {
            router.replace("/");
        }
    }, [isLoaded, user, router]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col flex-1 min-h-screen">
            <Document id={id} />
        </div>
    );
};

export default DocumentPage;
