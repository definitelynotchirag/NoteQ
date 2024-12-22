'use client';
import React from "react";
import {
  RoomProvider as RoomProviderWrapper,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import LiveCursorProvider from "./LiveCursorProvider";

function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  return (
    <RoomProviderWrapper id={roomId} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
}

export default RoomProvider;
