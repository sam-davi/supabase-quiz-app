"use client";

import React from "react";

function ChartContainer({
  renderChart,
}: {
  renderChart: (width: number) => React.JSX.Element;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, [ref]);

  return (
    <div className="flex w-full items-center justify-center" ref={ref}>
      {renderChart(width)}
    </div>
  );
}

export default ChartContainer;
