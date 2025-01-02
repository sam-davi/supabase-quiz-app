import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "./submit-button";

export function NewQuizScoreForm({
  location,
  date,
  rounds,
}: {
  location?: string;
  date?: string;
  rounds?: string;
}) {
  return (
    <form>
      <div className="flex items-end justify-center gap-6">
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            type="text"
            name="location"
            id="location"
            defaultValue={location}
            minLength={3}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            name="date"
            id="date"
            defaultValue={date}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rounds">Rounds</Label>
          <Input
            type="number"
            name="rounds"
            id="rounds"
            defaultValue={rounds ?? 10}
            min={1}
            max={20}
            required
          />
        </div>
        <SubmitButton type="submit">Add Scores</SubmitButton>
      </div>
    </form>
  );
}
