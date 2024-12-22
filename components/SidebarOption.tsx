
import { doc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";
import clsx from "clsx";
import { db } from "@/firebase";

type SidebarOptionsProps = {
    href: string;
    id: string;
};

function SidebarOptions({ href, id }: SidebarOptionsProps) {
    const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const pathname = usePathname();
    const isActive = pathname === href; // Adjust logic based on your use case

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;
    if (!data) return null;

    return (
        <Link 
            href={href} 
            className={clsx(
                "relative border p-2 rounded-md",
                isActive ? "bg-gray-700 shadow-md shadow-gray-600 text-center font-bold border-0 hover:bg-gray-600 ease-in-out transition-all" : "border-gray-700 shadow-md shadow-gray-600 text-center hover:bg-gray-600 ease-in-out transition-all"
            )}
        >
            <p>{data.title}</p>
        </Link>
    );
}

export default SidebarOptions;
