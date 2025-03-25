import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function YearlyDistrictPieChart({ data, year }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return;
    const aggregated = d3.rollups(
      data,
      v => d3.sum(v, d => d.dengueCases),
      d => d.districtId
    ).map(([districtId, total]) => ({ districtId, total }));

    const width = 400, height = 400, radius = Math.min(width, height) / 2;
    const pie = d3.pie().value(d => d.total)(aggregated);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    d3.select(svgRef.current).selectAll('*').remove();
    const svg = d3.select(svgRef.current).append('svg').attr('width', width).attr('height', height)
      .append('g').attr('transform', `translate(${width/2},${height/2})`);

    svg.selectAll('path').data(pie).enter().append('path')
      .attr('d', arc)
      .attr('fill', (_, i) => d3.schemeCategory10[i % 10]);

    svg.append('text').attr('text-anchor','middle').attr('y', -radius - 20).text(`Distribution by District — ${year}`);
  }, [data, year]);

  return <div ref={svgRef} />;
}
