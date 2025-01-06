"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Score = {
  id: number;
  rounds: number | null;
  quizDate: string;
  score: number;
  outOf: number | null;
  percentScore: number | null;
  location: {
    name: string;
    slug: string | null;
  };
};

type ScoresChartProps = {
  data: Score[];
  config: ChartConfig;
  xAxisKey: string;
  barKey: string;
};

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export function ScoresChartComponent({
  data,
  config,
  xAxisKey,
  barKey,
}: ScoresChartProps) {
  return (
    <ChartContainer config={config}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, _, item) => (
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-light">
                    {item.payload.location.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold">Score:</div>
                    <div className="text-sm font-light">
                      {item.payload.score} / {item.payload.outOf}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold">Percent Score:</div>
                    <div className="text-sm font-light">{value}%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold">Rounds:</div>
                    <div className="text-sm font-light">
                      {item.payload.rounds}
                    </div>
                  </div>
                </div>
              )}
            />
          }
        />
        <Bar dataKey={barKey} fill={`var(--color-${barKey})`} radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
