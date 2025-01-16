"use client";

import React from "react";

function ChartContainer({
  renderChart,
}: {
  renderChart: (width: number, height?: number) => React.JSX.Element;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
      setHeight(ref.current.offsetHeight);
    }
  }, [ref]);

  return (
    <div className="flex w-full items-center justify-center" ref={ref}>
      {renderChart(width, height)}
    </div>
  );
}

export default ChartContainer;
