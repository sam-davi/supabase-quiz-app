"use client";

import React from "react";
import * as d3 from "d3";
import ChartContainer from "@/components/d3/ChartContainer";

type Score = {
  minPercentScore: number | null;
  averagePercentScore: number | null;
  maxPercentScore: number | null;
};

type ChartProps = {
  score: Score;
};

export default function AvgScoreChart({ score }: ChartProps) {
  return (
    <ChartContainer
      renderChart={(width) => <AvgScoreSVG data={score} width={width} />}
    />
  );
}

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  data: Score;
}

export function AvgScoreSVG(props: SVGProps) {
  const { width = 165, height = 30, data } = props;
  const minWidth = 40;
  const maxWidth = 100;
  const minPosition = Math.min(
    Math.max(data.minPercentScore ?? 0, minWidth),
    maxWidth,
  );
  const averagePosition = Math.min(
    Math.max(data.averagePercentScore ?? 0, minWidth),
    maxWidth,
  );
  const maxPosition = Math.min(
    Math.max(data.maxPercentScore ?? 0, minWidth),
    maxWidth,
  );
  const xScale = d3
    .scaleLinear()
    .domain([minWidth - 5, maxWidth + 5])
    .range([0, Number(width)]);
  const colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, 100]);
  return (
    <svg {...props} width={width} height={height} overflow="visible">
      {data.minPercentScore &&
        data.maxPercentScore &&
        data.averagePercentScore && (
          <>
            <line
              x1={xScale(minPosition)}
              y1="50%"
              x2={xScale(maxPosition)}
              y2="50%"
              stroke="#DDD"
              strokeWidth="2"
            />
            <circle cx={xScale(minWidth)} cy="50%" r="2" fill="#DDD" />
            <circle cx={xScale(maxWidth)} cy="50%" r="2" fill="#DDD" />
            <circle
              cx={xScale(minPosition)}
              cy="50%"
              r="17"
              fill={colorScale(data.minPercentScore)}
            />
            <circle
              cx={xScale(maxPosition)}
              cy="50%"
              r="17"
              fill={colorScale(data.maxPercentScore)}
            />
            <circle
              cx={xScale(averagePosition)}
              cy="50%"
              r="22"
              fill={colorScale(data.averagePercentScore)}
            />
            {averagePosition >= minPosition + 10 && (
              <text
                x={xScale(minPosition)}
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={data.minPercentScore < 50 ? "white" : "black"}
                fontSize="0.75rem"
              >
                {data.minPercentScore.toFixed(0)}
              </text>
            )}
            <text
              x={xScale(averagePosition)}
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={data.averagePercentScore < 50 ? "white" : "black"}
            >
              {data.averagePercentScore.toFixed(0)}
            </text>
            {averagePosition <= maxPosition - 10 && (
              <text
                x={xScale(maxPosition)}
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={data.maxPercentScore < 50 ? "white" : "black"}
                fontSize="0.75rem"
              >
                {data.maxPercentScore.toFixed(0)}
              </text>
            )}
          </>
        )}
    </svg>
  );
}
