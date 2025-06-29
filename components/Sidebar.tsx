"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collectionGroup, DocumentData, query, where } from "firebase/firestore";
import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import NewDocumentButton from "./NewDocument";
import { default as SidebarOption, default as SidebarOptions } from "./SidebarOption";

interface RoomDocument extends DocumentData {
    createdAt: string;
    role: "owner" | "editor";
    roomId: string;
    userId: string;
}

const Sidebar = () => {
    const { user } = useUser();
    const [groupedData, setGroupedData] = useState<{
        owner: RoomDocument[];
        editor: RoomDocument[];
    }>({
        owner: [],
        editor: [],
    });

    const [data] = useCollection(
        user && query(collectionGroup(db, "rooms"), where("userId", "==", user.emailAddresses[0].toString())),
        {
            onError: error => {
                console.error("Firestore collection error:", error);
                // Handle the error appropriately
            },
        }
    );

    useEffect(() => {
        try {
            if (!data) return;

            const grouped = data.docs.reduce<{
                owner: RoomDocument[];
                editor: RoomDocument[];
            }>(
                (acc, cur) => {
                    const roomData = cur.data() as RoomDocument;

                    if (roomData.role === "owner") {
                        acc.owner.push({
                            id: cur.id,
                            ...roomData,
                        });
                    } else {
                        acc.editor.push({
                            id: cur.id,
                            ...roomData,
                        });
                    }
                    return acc;
                },
                {
                    owner: [],
                    editor: [],
                }
            );
            setGroupedData(grouped);
        } catch (error) {
            console.error("Error processing Firestore data:", error);
            // Handle the error appropriately
        }
    }, [data]);

    const menuOptions = (
        <>
            <NewDocumentButton />

            <div className="flex py-4 flex-col space-y-4 md:max-w-36 ">
                {/* My Documents */}
                {groupedData.owner.length === 0 ? (
                    <h2 className="text-gray-400 font-semibold text-sm">No documents found</h2>
                ) : (
                    <>
                        <h2 className="text-gray-400 text-center font-semibold text-sm">My Documents</h2>
                        {groupedData.owner.map(doc => (
                            <SidebarOptions key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                        ))}
                    </>
                )}

                {/* Shared with me */}
                {groupedData.editor.length > 0 && (
                    <>
                        <h2 className="text-gray-400 text-center font-semibold text-sm">Shared with Me</h2>
                        {groupedData.editor.map(doc => (
                            <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                        ))}
                    </>
                )}
            </div>
        </>
    );

    return (
        <div className="p-2 md:p-5 bg-gray-900 relative shadow-lg shadow-slate-700">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
                    </SheetTrigger>
                    <SheetContent className="bg-gray-900" side="left">
                        <SheetHeader>
                            <SheetTitle className="text-white text-bold">Menu</SheetTitle>
                            <div>{menuOptions}</div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:inline ">{menuOptions}</div>
        </div>
    );
};
export default Sidebar;
