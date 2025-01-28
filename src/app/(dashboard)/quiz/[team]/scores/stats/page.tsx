import CategoriesTable from "@/components/tables/categories";
import React from "react";

export default async function RoundStats({
  params,
}: {
  params: Promise<{ team: string }>;
}) {
  const { team } = await params;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <CategoriesTable team={team} />
    </div>
  );
}
