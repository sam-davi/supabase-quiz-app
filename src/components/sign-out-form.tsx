import React from "react";
import { signOutAction } from "@/server/actions/auth";
import { LogOut } from "lucide-react";

export default function SignOutForm() {
  return (
    <form className="w-full" action={signOutAction}>
      <button
        className="flex w-full items-center justify-start transition-colors focus:bg-accent focus:text-accent-foreground"
        type="submit"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </button>
    </form>
  );
}
