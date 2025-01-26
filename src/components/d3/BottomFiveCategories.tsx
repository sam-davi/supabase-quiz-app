import { prevCategoryPageAction } from "@/server/actions/categories";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AvgScoreChart from "./AvgScoreChartServer";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
} from "@/components/ui/table";

export default async function BottomFiveCategories({ team }: { team: string }) {
  const categories = await prevCategoryPageAction(team, undefined, 2, 5);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          Bottom 5 categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="sr-only">
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead className="w-[100px] text-end">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="w-[100px]">{category.name}</TableCell>
                <TableCell className="w-[100px] text-end">
                  <AvgScoreChart key={category.id} score={category} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
