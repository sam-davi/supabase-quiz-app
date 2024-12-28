import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createTeamAction } from "@/server/actions/teams";
import { SubmitButton } from "./submit-button";

export function NewTeamForm() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">New Team</CardTitle>
        <CardDescription>
          Please create a team display name to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createTeamAction}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input type="text" name="name" id="name" minLength={3} />
            </div>
            <SubmitButton
              type="submit"
              className="w-full"
              formAction={createTeamAction}
            >
              Create Team
            </SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
