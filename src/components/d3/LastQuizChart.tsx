"use client";

import React from "react";
import * as d3 from "d3";
import ChartContainer from "@/components/d3/ChartContainer";

type Round = {
  roundNumber: number;
  score: number;
  outOf: number | null;
  percentScore: number | null;
  double: boolean | null;
  totalScore: number | null;
  totalOutOf: number | null;
  category: {
    slug: string | null;
    name: string;
  };
};

type ChartProps = {
  rounds: Round[];
};

export default function LastQuizChart({ rounds }: ChartProps) {
  return (
    <ChartContainer
      renderChart={(width) => <LastQuizSVG data={rounds} width={width} />}
    />
  );
}

type Props = {
  data: Round[];
  width?: number;
  height?: number;
};

export function LastQuizSVG(props: Props) {
  const { width = 165, height = 150, data } = props;

  if (data.length === 0) return null;

  const xScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([0, Number(width)]);

  const heightScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, Number(height)]);

  const colorScale = d3.scaleSequential(d3.interpolateSinebow).domain([0, 100]);

  return (
    <svg {...props} width={width} height={height} overflow="visible">
      {data.map((round, i) => (
        <rect
          key={round.roundNumber}
          x={xScale(i + 0.15)}
          y={height - heightScale(round.percentScore ?? 0)}
          width={xScale(0.7)}
          height={heightScale(round.percentScore ?? 0)}
          fill={colorScale(round.percentScore ?? 0)}
        />
      ))}
    </svg>
  );
}
