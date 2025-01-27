import * as d3 from "d3";
import AvgScoreChart from "./AvgScoreChartServer";

type DataPoint = {
  percentScore: number | null;
};

type Score = {
  minPercentScore: number | null;
  averagePercentScore: number | null;
  maxPercentScore: number | null;
  rounds: DataPoint[];
};

type Props = {
  score: Score;
};

export default function ViolinChart({ score }: Props) {
  const width = 480;
  const height = 35;

  const margin = { top: 0, right: 20, bottom: 0, left: 20 };

  const bucketGenerator = d3
    .bin<DataPoint, number>()
    .value((d: DataPoint) => d.percentScore ?? 0)
    .domain([0, 110])
    .thresholds(10);

  const buckets = bucketGenerator(score.rounds);
  const biggestBucket = Math.max(...buckets.map((bucket) => bucket.length));

  const yScale = d3
    .scaleLinear()
    .domain([-biggestBucket, biggestBucket])
    .range([0, height]);

  const xScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, width - margin.left - margin.right]);

  const areaBuilder = d3
    .area<d3.Bin<DataPoint, number>>()
    .y0((d) => yScale(-d.length))
    .y1((d) => yScale(d.length))
    .x((d) => xScale(d.x0 ?? 0) + margin.left)
    .curve(d3.curveBumpX);

  const colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, 100]);

  const areaPath = areaBuilder(buckets);

  return (
    <svg className="group" width="100%" height="35" overflow="visible">
      <AvgScoreChart score={score} />
      <g className="hidden group-hover:block">
        <circle
          cx={`${(margin.left / width) * 100}%`}
          cy={"50%"}
          r={2}
          fill="#ddd"
        />
        <circle
          cx={`${((width - margin.right) / width) * 100}%`}
          cy={"50%"}
          r={2}
          fill="#ddd"
        />
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
          overflow="visible"
          preserveAspectRatio="none"
        >
          <path
            d={areaPath ?? undefined}
            fill={colorScale(score.averagePercentScore ?? 0)}
          />
        </svg>
      </g>
      <rect x={0} y={0} width={"100%"} height={"100%"} fill="transparent" />
    </svg>
  );
}
