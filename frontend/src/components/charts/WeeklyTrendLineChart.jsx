import React from 'react';
import SingleLineD3 from '../SingleLineChart';
import * as d3 from 'd3';

export default function WeeklyTrendLineChart({ data = [], year }) {
  // Aggregate total cases per week
  const aggregated = Array.from(
    d3.rollup(
      data,
      v => d3.sum(v, d => d.dengueCases),
      d => d.week
    ),
    ([week, total]) => ({ year, week, value: total })
  )
  .sort((a, b) => a.week - b.week);

  const chartData = {
    title: `Weekly Dengue Cases — ${year}`,
    xAxisLabel: 'Week',
    yAxisLabel: 'Total Cases',
    data: aggregated,
  };

  return <SingleLineD3 chartData={chartData} width={800} height={400} />;
}
