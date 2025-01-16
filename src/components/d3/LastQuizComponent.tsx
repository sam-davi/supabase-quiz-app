import { getLastQuizScoresAction } from "@/server/actions/scores";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LastQuizChart from "@/components/d3/LastQuizChart";

export default async function LastQuiz({ team }: { team: string }) {
  const scores = await getLastQuizScoresAction(team);

  if (!scores) return null;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{scores.location.name}</span>
          <span>{scores.quizDate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between">
          <span>{scores.roundsPlayed} rounds</span>
          <span>
            {scores.score} / {scores.outOf}
          </span>
          <span>{scores.percentScore}%</span>
        </div>
        <LastQuizChart rounds={scores.rounds} />
      </CardContent>
    </Card>
  );
}
