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
  nextCategoryPageAction,
  prevCategoryPageAction,
} from "@/server/actions/categories";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  }>;
}) {
  const { team } = await params;
  const { direction, category, averagePercentScore } = await searchParams;
  const cursor =
    category && averagePercentScore
      ? { category, averagePercentScore }
      : undefined;
  let scores =
    direction === "prev"
      ? await prevCategoryPageAction(team, cursor)
      : await nextCategoryPageAction(team, cursor);

  if (scores.length === 0) {
    scores =
      direction === "prev"
        ? await prevCategoryPageAction(team)
        : await nextCategoryPageAction(team);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Round Stats</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Min Score
                </TableHead>
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
                  <TableCell>
                    {score.averagePercentScore?.toFixed(0)}%
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {score.minPercentScore?.toFixed(0)}%
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
