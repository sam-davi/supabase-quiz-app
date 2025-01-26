import * as d3 from "d3";

type Score = {
  minPercentScore: number | null;
  averagePercentScore: number | null;
  maxPercentScore: number | null;
};

type ChartProps = {
  score: Score;
};

export default function AvgScoreChart({ score }: ChartProps) {
  const width = 480;
  const minScore = 40;
  const minPercentScore = Math.max(minScore, score.minPercentScore ?? 0);
  const averagePercentScore = Math.max(
    minScore,
    score.averagePercentScore ?? 0,
  );
  const maxPercentScore = Math.max(minScore, score.maxPercentScore ?? 0);

  const margin = { top: 0, right: 40, bottom: 0, left: 40 };

  const xScale = d3
    .scaleLinear()
    .domain([minScore, 100])
    .range([0, width - margin.left - margin.right]);

  const colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, 100]);

  return (
    <div className="w-full overflow-visible">
      <svg width="100%" height="35" overflow="visible">
        <svg viewBox={`0 0 ${width} 35`} overflow="visible">
          {/* score line */}
          <line
            x1={xScale(minPercentScore) + margin.left}
            y1="50%"
            x2={xScale(maxPercentScore) + margin.left}
            y2="50%"
            stroke="#DDD"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* base line circles */}
        <circle
          cx={`${(margin.left / width) * 100}%`}
          cy="50%"
          r="2"
          fill="#DDD"
        />
        <circle
          cx={`${((width - margin.right) / width) * 100}%`}
          cy="50%"
          r="2"
          fill="#DDD"
        />
        {/* min score circle */}
        <circle
          cx={`${((xScale(minPercentScore) + margin.left) / width) * 100}%`}
          cy="50%"
          r="15"
          fill={colorScale(score.minPercentScore ?? 0)}
        />
        {/* max score circle */}
        <circle
          cx={`${((xScale(maxPercentScore) + margin.left) / width) * 100}%`}
          cy="50%"
          r="15"
          fill={colorScale(score.maxPercentScore ?? 0)}
        />
        {/* average score circle */}
        <circle
          cx={`${((xScale(averagePercentScore) + margin.left) / width) * 100}%`}
          cy="50%"
          r="22"
          fill={colorScale(score.averagePercentScore ?? 0)}
        />
        {/* min score label */}
        {minPercentScore < averagePercentScore - 10 && (
          <text
            x={`${((xScale(minPercentScore) + margin.left) / width) * 100}%`}
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={(score.minPercentScore ?? 0) < 50 ? "white" : "black"}
            fontSize="0.75rem"
          >
            {score.minPercentScore?.toFixed(0) ?? ""}
          </text>
        )}
        {/* max score label */}
        {maxPercentScore > averagePercentScore + 10 && (
          <text
            x={`${((xScale(maxPercentScore) + margin.left) / width) * 100}%`}
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={(score.maxPercentScore ?? 0) < 50 ? "white" : "black"}
            fontSize="0.75rem"
          >
            {score.maxPercentScore?.toFixed(0) ?? ""}
          </text>
        )}
        {/* average score label */}
        <text
          x={`${((xScale(averagePercentScore) + margin.left) / width) * 100}%`}
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={(score.averagePercentScore ?? 0) < 50 ? "white" : "black"}
        >
          {score.averagePercentScore?.toFixed(0) ?? ""}
        </text>
      </svg>
    </div>
  );
}
