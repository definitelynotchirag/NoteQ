"use client";

import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Input } from "./ui/input";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { inviteUserToDocument } from "@/actions/actions";


const InviteUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();

    const roomId = pathname.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await inviteUserToDocument(roomId, email);

      if (success) {
        setIsOpen(false);
        setEmail("");

        toast.success("User added to room successfully!");
      } else {
        toast.error("Failed to add user to the room");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <Button asChild variant="ghost" className="bg-green-700 text-white shadow-xl shadow-green-800">
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent className="bg-gray-900 border-0">
        <DialogHeader>
          <DialogTitle>Invite a user to collaborate!</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to invite.
          </DialogDescription>
        </DialogHeader>

        <form className="flex gap-2" onSubmit={handleInvite}>
          <Input
            type="email"
            placeholder="Email"
            className="w-full bg-inherit border-0 shadow-xl shadow-slate-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="bg-black" type="submit" disabled={!email || isPending}>
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUser;