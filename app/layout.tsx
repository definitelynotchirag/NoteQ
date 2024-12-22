import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "NoteQ",
  description: "NoteQ is a note-taking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-950 text-white">
          <Header />

          <div className="flex min-h-screen ">
            <Sidebar />

            <div className="flex-1 p-4 overflow-y-auto scrollbar-hide bg-gray-950">
              {children}
            </div>
          </div>

          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
