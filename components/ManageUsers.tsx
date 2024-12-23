"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";

import { useRoom } from "@liveblocks/react/suspense";
import { useCollection } from "react-firebase-hooks/firestore";

import { collectionGroup, query, where } from "firebase/firestore";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

import { db } from "@/firebase";

import useOwner from "@/lib/useOwner";
import { removeUserFromDocument } from "@/actions/actions";

const ManageUsers = () => {
  const { user } = useUser();
  const room = useRoom();
  const isOwner = useOwner();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      if (!user) return;

      const { success } = await removeUserFromDocument(room.id, userId);
      toast.success("User removed from room successfully!");
      if (success) {
        toast.error("Failed to remove user from room");
      } else {
      }
    });
  };

  return (
    <div>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    
      <Button asChild variant="default" className="border-0 bg-slate-700 shadow-lg shadow-slate-800">
        <DialogTrigger>Users ({usersInRoom?.docs.length || 0})</DialogTrigger>
      </Button>
      <DialogContent className="bg-gray-900 border-0">
        <DialogHeader>
          <DialogTitle>Users with Access</DialogTitle>
          <DialogDescription>
            Below is a list of users who have access to this document.
          </DialogDescription>
        </DialogHeader>
      

        <hr className="my-2" />

        {/* Users in the room */}
        <div className="flex flex-col space-y-2 ">
          {usersInRoom?.docs.map((doc) => (
            <div
              key={doc.data().userId}
              className="flex items-center justify-between"
            >
              <p className="font-light">
                {doc.data().userId === user?.emailAddresses[0].toString()
                  ? `You (${doc.data().userId})`
                  : doc.data().userId}
              </p>

              <div className="flex items-center gap-2">
                    
                <Button className="bg-black text-white" variant="default">{doc.data().role}</Button>

                {isOwner &&
                  doc.data().userId !== user?.emailAddresses[0].toString() && (
                    <Button
                    className="bg-black text-white"
                      variant="destructive"
                      onClick={() => handleDelete(doc.data().userId)}
                      disabled={isPending}
                      size="sm"
                    >
                      {isPending ? "Removing..." : "X"}
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default ManageUsers;