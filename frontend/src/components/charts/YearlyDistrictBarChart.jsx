import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function YearlyDistrictBarChart({ data, year }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return;
    const aggregated = d3.rollups(
      data,
      v => d3.sum(v, d => d.dengueCases),
      d => d.districtId
    ).map(([districtId, total]) => ({ districtId, total }));

    d3.select(svgRef.current).selectAll('*').remove();
    const width = 800, height = 400, margin = { top: 40, right: 20, bottom: 70, left: 60 };
    const svg = d3.select(svgRef.current).append('svg').attr('width', width).attr('height', height);
    const x = d3.scaleBand().domain(aggregated.map(d => d.districtId)).range([margin.left, width - margin.right]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(aggregated, d => d.total)]).nice().range([height - margin.bottom, margin.top]);

    svg.append('g').selectAll('rect')
      .data(aggregated).enter().append('rect')
      .attr('x', d => x(d.districtId)).attr('y', d => y(d.total))
      .attr('width', x.bandwidth()).attr('height', d => y(0) - y(d.total))
      .attr('fill', 'steelblue');

    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x)).selectAll('text').attr('transform', 'rotate(-45)').style('text-anchor','end');
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));
    svg.append('text').attr('x', width/2).attr('y', margin.top/2).attr('text-anchor','middle').text(`Total Cases by District — ${year}`);
  }, [data, year]);

  return <div ref={svgRef} style={{ position: 'relative' }} />;
}
