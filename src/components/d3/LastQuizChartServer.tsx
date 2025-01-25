import { getLastQuizScoresAction } from "@/server/actions/scores";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LastQuizChart({ team }: { team: string }) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Last Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <LastQuizChartInner team={team} />
      </CardContent>
    </Card>
  );
}

async function LastQuizChartInner({ team }: { team: string }) {
  const data = await getLastQuizScoresAction(team);

  if (!data) return null;

  const { rounds } = data;
  if (rounds.length === 0) return null;

  const width = 960;
  const height = (width * 9) / 16;
  const margin = { top: 10, right: 20, bottom: 30, left: 40 };

  const roundsNumbers = rounds.map((round) => round.roundNumber);

  const xScale = d3
    .scaleLinear()
    .domain([Math.min(...roundsNumbers), Math.max(...roundsNumbers)])
    .range([0, width - margin.left - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom - margin.top, 0]);

  type DataPoint = (typeof rounds)[number];

  const line = d3
    .line<DataPoint>()
    .x((d) => xScale(d.roundNumber) ?? 0)
    .y((d) => yScale(d.percentScore ?? 0));

  const d = line(rounds);
  if (!d) return null;

  return (
    <div className="aspect-video">
      <svg className="h-full w-full overflow-visible">
        {/* X axis */}
        {rounds.map((round, i) => (
          <g key={round.roundNumber} className="text-xs">
            <text
              x={`${((xScale(round.roundNumber) + margin.left) / width) * 100}%`}
              y={"100%"}
              textAnchor={
                i === 0 ? "start" : i === rounds.length - 1 ? "end" : "middle"
              }
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

            {/* Line */}
            <path
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      </svg>
    </div>
  );
}
