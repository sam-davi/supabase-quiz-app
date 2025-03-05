import { NewQuizRoundsForm } from "@/components/new-quiz-rounds-form";
import { NewQuizScoreForm } from "@/components/new-quiz-score-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default async function AddQuizResults({
  params,
  searchParams,
}: {
  params: Promise<{ team: string }>;
  searchParams: Promise<{
    location: string | undefined;
    date: string | undefined;
    rounds: string | undefined;
  }>;
}) {
  const { team } = await params;
  const { location, date, rounds } = await searchParams;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card className="h-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Add Quiz Results</CardTitle>
          <CardDescription>
            Please enter the location, date and number of rounds to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewQuizScoreForm location={location} date={date} rounds={rounds} />
          <Separator className="my-4" />
          <NewQuizRoundsForm
            team={team}
            location={location}
            date={date}
            rounds={rounds}
          />
        </CardContent>
      </Card>
    </div>
  );
}
