import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const DocLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params; // Await the params to unwrap
  auth.protect();
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
};

export default DocLayout;
