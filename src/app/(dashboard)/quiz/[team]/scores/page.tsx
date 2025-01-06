import { ScoresChartComponent } from "@/components/charts/scores-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  nextScorePageAction,
  prevScorePageAction,
} from "@/server/actions/scores";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default async function Scores({
  params,
  searchParams,
}: {
  params: Promise<{ team: string }>;
  searchParams: Promise<{
    direction: "next" | "prev" | undefined;
    location: string | undefined;
    date: string | undefined;
  }>;
}) {
  const { team } = await params;
  const { direction, location, date } = await searchParams;
  const cursor = location && date ? { location, date } : undefined;
  let scores =
    direction === "prev"
      ? await prevScorePageAction(team, cursor)
      : await nextScorePageAction(team, cursor);

  if (scores.length === 0) {
    scores =
      direction === "prev"
        ? await prevScorePageAction(team)
        : await nextScorePageAction(team);
  }

  const chartConfig = {
    percentScore: {
      label: "Score",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Scores</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-2">
          <form>
            <input
              type="hidden"
              name="location"
              value={scores[0]?.location?.slug ?? ""}
              className="hidden"
            />
            <input
              type="hidden"
              name="date"
              value={scores[0]?.quizDate ?? ""}
              className="hidden"
            />
            <input
              type="hidden"
              name="direction"
              value="prev"
              className="hidden"
            />
            <Button type="submit" size="icon">
              <ChevronLeft />
            </Button>
          </form>
          <div className="h-full w-full max-w-4xl">
            <ScoresChartComponent
              data={scores}
              config={chartConfig}
              xAxisKey="quizDate"
              barKey="percentScore"
            />
          </div>
          <form>
            <input
              type="hidden"
              name="location"
              value={scores.slice(-1)[0]?.location?.slug ?? ""}
              className="hidden"
            />
            <input
              type="hidden"
              name="date"
              value={scores.slice(-1)[0]?.quizDate ?? ""}
              className="hidden"
            />
            <input
              type="hidden"
              name="direction"
              value="next"
              className="hidden"
            />
            <Button type="submit" size="icon">
              <ChevronRight />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
