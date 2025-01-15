import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  nextScorePageAction,
  prevScorePageAction,
} from "@/server/actions/scores";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Scores</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden lg:table-cell">Rounds</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Out of</TableHead>
                <TableHead>Percent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score) => (
                <TableRow key={score.id}>
                  <TableCell className="hidden md:table-cell">
                    {score.location.name}
                  </TableCell>
                  <TableCell>{score.quizDate}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {score.roundsPlayed}
                  </TableCell>
                  <TableCell>{score.score}</TableCell>
                  <TableCell>{score.outOf}</TableCell>
                  <TableCell>{score.percentScore?.toFixed(0)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <form>
              <input
                type="hidden"
                name="direction"
                value="next"
                className="hidden"
              />
              <Button type="submit" size="icon">
                <ChevronsLeft />
              </Button>
            </form>
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
          </div>
          <div className="flex items-center gap-2">
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
            <form>
              <input
                type="hidden"
                name="direction"
                value="prev"
                className="hidden"
              />
              <Button type="submit" size="icon">
                <ChevronsRight />
              </Button>
            </form>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
