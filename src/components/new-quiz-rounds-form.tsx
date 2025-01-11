import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/submit-button";
import { upsertRoundsAction } from "@/server/actions/rounds";

function NewQuizRound({ index }: { index: number }) {
  return (
    <div className="flex flex-col justify-center gap-6 md:flex-row md:items-end">
      <div className="grid gap-2">
        <Label
          className={index !== 0 ? "md:hidden" : ""}
          htmlFor={`round_number-${index}`}
        >
          Round #
        </Label>
        <Input
          type="number"
          name={`round_number-${index}`}
          id={`round_number-${index}`}
          defaultValue={index + 1}
          min={1}
          max={20}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label
          className={index !== 0 ? "md:hidden" : ""}
          htmlFor={`category-${index}`}
        >
          Category
        </Label>
        <Input
          type="text"
          name={`category-${index}`}
          id={`category-${index}`}
          minLength={3}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label
          className={index !== 0 ? "md:hidden" : ""}
          htmlFor={`score-${index}`}
        >
          Score
        </Label>
        <Input
          type="number"
          name={`score-${index}`}
          id={`score-${index}`}
          defaultValue={0}
          min={0}
          max={100}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label
          className={index !== 0 ? "md:hidden" : ""}
          htmlFor={`out_of-${index}`}
        >
          Out of
        </Label>
        <Input
          type="number"
          name={`out_of-${index}`}
          id={`out_of-${index}`}
          defaultValue={10}
          min={1}
          max={100}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label
          className={index !== 0 ? "md:hidden" : ""}
          htmlFor={`double-${index}`}
        >
          Double
        </Label>
        <div className="flex h-9 w-12 items-center justify-center">
          <Input
            className="h-4 w-4"
            type="checkbox"
            name={`double-${index}`}
            id={`double-${index}`}
            defaultChecked={false}
          />
        </div>
        <Separator className="md:hidden" />
      </div>
    </div>
  );
}

export function NewQuizRoundsForm({
  team,
  location,
  date,
  rounds,
}: {
  team: string;
  location?: string;
  date?: string;
  rounds?: string;
}) {
  if (!rounds) {
    return null;
  }

  return (
    <form action={upsertRoundsAction}>
      <div className="flex flex-col gap-2">
        {team && <input type="hidden" name="team" value={team} />}
        {location && <input type="hidden" name="location" value={location} />}
        {date && <input type="hidden" name="date" value={date} />}
        {rounds && <input type="hidden" name="rounds" value={rounds} />}
        {[...Array(Number(rounds)).keys()].map((index) => (
          <NewQuizRound key={index} index={index} />
        ))}
        <div className="flex items-end justify-center gap-6">
          <SubmitButton type="submit" size="lg" formAction={upsertRoundsAction}>
            Save Scores
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
