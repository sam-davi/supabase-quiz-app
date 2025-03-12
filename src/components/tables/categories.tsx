"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViolinChart from "@/components/d3/ViolinChart";
import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { nextCategoryPageAction } from "@/server/actions/categories";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export type Category = {
  id: number;
  name: string;
  slug: string | null;
  minPercentScore: number | null;
  averagePercentScore: number | null;
  maxPercentScore: number | null;
  rounds: {
    percentScore: number | null;
  }[];
  roundsPlayed: number | null;
};

function ScoreDelta({
  averagePercentScore,
  percentScore,
}: {
  averagePercentScore: number | null | undefined;
  percentScore: number | null | undefined;
}) {
  if (!averagePercentScore) return null;
  if (!percentScore) return null;

  const delta = percentScore - averagePercentScore;

  if (delta > 10) return <ChevronsUp className="h-4 w-4 text-green-500" />;
  if (delta > 0) return <ChevronUp className="h-4 w-4 text-green-800" />;
  if (delta < -10) return <ChevronsDown className="h-4 w-4 text-red-500" />;
  if (delta < 0) return <ChevronDown className="h-4 w-4 text-red-800" />;

  return null;
}

function CategoryRow({ category }: { category: Category }) {
  return (
    <TableRow key={category.slug}>
      <TableCell>{category.name}</TableCell>
      <TableCell className="max-w-[165px] items-center justify-items-center">
        <ViolinChart score={category} />
      </TableCell>
      <TableCell className="hidden text-center lg:table-cell">
        {category.minPercentScore?.toFixed(0)}%
      </TableCell>
      <TableCell className="hidden justify-items-center lg:table-cell">
        <span className="flex items-center gap-1">
          {category.averagePercentScore?.toFixed(0)}%{" "}
          <ScoreDelta
            averagePercentScore={category.averagePercentScore}
            percentScore={category.rounds[0]?.percentScore}
          />
        </span>
      </TableCell>
      <TableCell className="hidden text-center lg:table-cell">
        {category.maxPercentScore?.toFixed(0)}%
      </TableCell>
      <TableCell className="hidden text-center md:table-cell">
        {category.roundsPlayed}
      </TableCell>
    </TableRow>
  );
}

type Cursor =
  | {
      category: string;
      averagePercentScore: number;
    }
  | undefined;

const getCursor = (categories: Category[]) => {
  const lastCategory = categories[categories.length - 1];
  if (!lastCategory) return undefined;
  return {
    category: lastCategory.slug ?? "",
    averagePercentScore: lastCategory.averagePercentScore ?? 0,
  };
};

export default function CategoriesTable({ team }: { team: string }) {
  const PAGE_SIZE = 20;
  const DEFAULT_ROUNDS_PLAYED = 2;
  const [roundsPlayed, setRoundsPlayed] = useState<number>(
    DEFAULT_ROUNDS_PLAYED,
  );
  const [lastPageSize, setLastPageSize] = useState<number>(PAGE_SIZE);
  const [pages, setPages] = useState<number>(0);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [cursor, setCursor] = useState<Cursor>(undefined);
  const { ref, inView } = useInView();

  useEffect(() => {
    const loadMoreData = async () => {
      const newCategories = await nextCategoryPageAction(
        team,
        cursor,
        1,
        PAGE_SIZE,
      );
      setCategoryData((prev) => [
        ...prev,
        ...newCategories.filter(
          (category) => !prev.find((c) => c.id === category.id),
        ),
      ]);
      setLastPageSize(newCategories.length);
      setCursor(getCursor(newCategories));
      setPages((prev) => prev + 1);
    };

    if (inView && !(lastPageSize < PAGE_SIZE)) {
      loadMoreData().catch(console.error);
    }
  }, [inView, lastPageSize, pages, cursor, team]);

  return (
    <Card className="h-full">
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
                  defaultValue={roundsPlayed}
                  min={1}
                  max={100}
                  className="w-24"
                  onChange={(e) => setRoundsPlayed(parseInt(e.target.value))}
                />
              </div>
            </form>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <ScrollArea className="h-[75vh] w-full">
          <Table>
            <TableHeader className="bg-background sticky top-0">
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
              {categoryData
                .filter(
                  (category) => (category.roundsPlayed ?? 0) >= roundsPlayed,
                )
                .map((category) => (
                  <CategoryRow key={category.id} category={category} />
                ))}
              <TableRow ref={ref}>
                <TableCell colSpan={6} className="h-16 text-center">
                  {lastPageSize < PAGE_SIZE
                    ? "No more categories"
                    : "Loading..."}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
