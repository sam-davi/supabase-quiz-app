import { getLastQuizScoresAction } from "@/server/actions/scores";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DataPoint = NonNullable<
  Awaited<ReturnType<typeof getLastQuizScoresAction>>
>["rounds"][number];

export default async function LastQuizChart({ team }: { team: string }) {
  const data = await getLastQuizScoresAction(team);

  if (!data) return null;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex justify-between">
          <span>{data.location.name}</span>
          <span>{data.quizDate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <LastQuizChartInner rounds={data.rounds} />
      </CardContent>
    </Card>
  );
}

async function LastQuizChartInner({ rounds }: { rounds: DataPoint[] }) {
  if (rounds.length === 0) return null;

  const width = 480;
  const height = width / 2;
  const margin = { top: 10, right: 20, bottom: 30, left: 40 };

  const roundsNumbers = rounds.map((round) => round.roundNumber.toString());

  const xScale = d3
    .scaleBand()
    .domain(roundsNumbers)
    .range([0, width - margin.left - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom - margin.top, 0]);

  const colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, 100]);

  return (
    <div className="aspect-2/1 w-full">
      <svg className="h-full w-full overflow-visible">
        {/* X axis */}
        {rounds.map((round) => (
          <g key={round.roundNumber} className="text-xs">
            <text
              x={`${(((xScale(round.roundNumber.toString()) ?? 0) + margin.left + xScale.bandwidth() / 2) / width) * 100}%`}
              y={"100%"}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="currentColor"
            >
              {round.roundNumber}
            </text>
          </g>
        ))}
        {/* Y axis */}
        <g className="translate-x-4">
          {yScale
            .ticks(5)
            .map(yScale.tickFormat(8, "d"))
            .map((tick, i) => (
              <text
                key={i}
                x={0}
                y={`${((yScale(+tick) + margin.top) / height) * 100}%`}
                alignmentBaseline="middle"
                textAnchor="end"
                className="text-xs tabular-nums"
                fill="currentColor"
              >
                {tick}
              </text>
            ))}
        </g>
        {/* Chart area */}
        <svg viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Grid lines */}
            {yScale
              .ticks(5)
              .map(yScale.tickFormat(8, "d"))
              .map((tick, i) => (
                <g key={i} transform={`translate(0, ${yScale(+tick)})`}>
                  <line
                    x1={0}
                    x2={width - margin.left - margin.right}
                    stroke="currentColor"
                    strokeDasharray="2 2"
                    strokeWidth={0.5}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}

            {/* Bars */}
            {rounds.map((round) => (
              <rect
                key={round.roundNumber}
                x={
                  (xScale(round.roundNumber.toString()) ?? 0) +
                  xScale.bandwidth() / 4
                }
                y={yScale(round.percentScore ?? 0)}
                width={xScale.bandwidth() / 2}
                height={
                  height -
                  margin.bottom -
                  margin.top -
                  yScale(round.percentScore ?? 0)
                }
                fill={colorScale(round.percentScore ?? 0)}
              />
            ))}
          </g>
        </svg>
      </svg>
    </div>
  );
}
