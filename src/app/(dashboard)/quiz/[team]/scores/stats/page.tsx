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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
                <TableHead>Category</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Min Score
                </TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Max Score
                </TableHead>
                <TableHead>Rounds</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score) => (
                <TableRow key={score.slug}>
                  <TableCell>{score.name}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {score.minPercentScore?.toFixed(0)}%
                  </TableCell>
                  <TableCell>
                    {score.averagePercentScore?.toFixed(0)}%
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {score.maxPercentScore?.toFixed(0)}%
                  </TableCell>
                  <TableCell>{score.rounds}</TableCell>
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
