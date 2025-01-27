import ViolinChart from "@/components/d3/ViolinChart";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  nextCategoryPageAction,
  prevCategoryPageAction,
} from "@/server/actions/categories";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import React from "react";

export default async function RoundStats({
  params,
  searchParams,
}: {
  params: Promise<{ team: string }>;
  searchParams: Promise<{
    direction: "next" | "prev" | undefined;
    category: string | undefined;
    averagePercentScore: number | undefined;
    minRounds: number | undefined;
  }>;
}) {
  const { team } = await params;
  const {
    direction,
    category,
    averagePercentScore,
    minRounds = 2,
  } = await searchParams;
  const cursor =
    category && averagePercentScore
      ? { category, averagePercentScore }
      : undefined;
  let scores =
    direction === "prev"
      ? await prevCategoryPageAction(team, cursor, minRounds)
      : await nextCategoryPageAction(team, cursor, minRounds);

  if (scores.length === 0) {
    scores =
      direction === "prev"
        ? await prevCategoryPageAction(team, undefined, minRounds)
        : await nextCategoryPageAction(team, undefined, minRounds);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>Round Stats</div>
              <form className="flex items-center justify-between gap-2">
                <Label htmlFor="minRounds">Min Rounds:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    name="minRounds"
                    defaultValue={minRounds}
                    min={1}
                    max={100}
                    className="w-24"
                  />
                  <SubmitButton size="icon">
                    <RefreshCw />
                  </SubmitButton>
                </div>
              </form>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[125px]">Category</TableHead>
                <TableHead className="w-[165px] text-center">Scores</TableHead>
                <TableHead className="hidden w-[75px] text-center lg:table-cell">
                  Min Score
                </TableHead>
                <TableHead className="hidden w-[75px] text-center lg:table-cell">
                  Avg Score
                </TableHead>
                <TableHead className="hidden w-[75px] text-center lg:table-cell">
                  Max Score
                </TableHead>
                <TableHead className="hidden w-[75px] text-center md:table-cell">
                  Rounds
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score) => (
                <TableRow key={score.slug}>
                  <TableCell>{score.name}</TableCell>
                  <TableCell className="max-w-[165px] items-center justify-items-center">
                    <ViolinChart score={score} />
                  </TableCell>
                  <TableCell className="hidden text-center lg:table-cell">
                    {score.minPercentScore?.toFixed(0)}%
                  </TableCell>
                  <TableCell className="hidden justify-items-center lg:table-cell">
                    <span className="flex items-center gap-1">
                      {score.averagePercentScore?.toFixed(0)}%{" "}
                      <ScoreDelta
                        averagePercentScore={score.averagePercentScore}
                        percentScore={score.rounds[0]?.percentScore}
                      />
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-center lg:table-cell">
                    {score.maxPercentScore?.toFixed(0)}%
                  </TableCell>
                  <TableCell className="hidden text-center md:table-cell">
                    {score.roundsPlayed}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <form>
              <input
                type="hidden"
                name="direction"
                value="next"
                className="hidden"
              />
              <input
                type="hidden"
                name="minRounds"
                value={minRounds}
                className="hidden"
              />
              <Button type="submit" size="icon">
                <ChevronsLeft />
              </Button>
            </form>
            <form>
              <input
                type="hidden"
                name="category"
                value={scores[0]?.slug ?? ""}
                className="hidden"
              />
              <input
                type="hidden"
                name="averagePercentScore"
                value={scores[0]?.averagePercentScore ?? ""}
                className="hidden"
              />
              <input
                type="hidden"
                name="direction"
                value="prev"
                className="hidden"
              />
              <input
                type="hidden"
                name="minRounds"
                value={minRounds}
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
                name="category"
                value={scores.slice(-1)[0]?.slug ?? ""}
                className="hidden"
              />
              <input
                type="hidden"
                name="averagePercentScore"
                value={scores.slice(-1)[0]?.averagePercentScore ?? ""}
                className="hidden"
              />
              <input
                type="hidden"
                name="direction"
                value="next"
                className="hidden"
              />
              <input
                type="hidden"
                name="minRounds"
                value={minRounds}
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
              <input
                type="hidden"
                name="minRounds"
                value={minRounds}
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

const ScoreDelta = ({
  averagePercentScore,
  percentScore,
}: {
  averagePercentScore: number | null | undefined;
  percentScore: number | null | undefined;
}) => {
  if (!averagePercentScore) return null;
  if (!percentScore) return null;

  const delta = percentScore - averagePercentScore;

  if (delta > 10) return <ChevronsUp className="h-4 w-4 text-green-500" />;
  if (delta > 0) return <ChevronUp className="h-4 w-4 text-green-800" />;
  if (delta < -10) return <ChevronsDown className="h-4 w-4 text-red-500" />;
  if (delta < 0) return <ChevronDown className="h-4 w-4 text-red-800" />;

  return null;
};
